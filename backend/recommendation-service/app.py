import logging
import os
import shutil
import tempfile
from datetime import datetime
from numbers import Number
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import joblib
import numpy as np
import pandas as pd
import requests
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from tinytag import TinyTag

# Essentia ships the MusicExtractor algorithm for common audio descriptors
from essentia.standard import MusicExtractor

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("recommendation-service")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/musicapp")
MONGODB_DB = os.getenv("MONGODB_DB", "musicapp")
FEATURE_COLLECTION = os.getenv("FEATURE_COLLECTION", "song_features")
FAVORITE_COLLECTION = os.getenv("FAVORITE_COLLECTION", "favorites")
RECOMMENDATION_LIMIT_DEFAULT = int(os.getenv("RECOMMENDATION_LIMIT_DEFAULT", "10"))

AI_DATA_DIR = Path(__file__).resolve().parent / "ai"
MODEL_PATH = AI_DATA_DIR / "spotify_song_cluster_pipeline.joblib"
DATASET_PATH = AI_DATA_DIR / "archive" / "data" / "data.csv"

FEATURE_COLUMNS = [
    "valence",
    "year",
    "acousticness",
    "danceability",
    "duration_ms",
    "energy",
    "explicit",
    "instrumentalness",
    "key",
    "liveness",
    "loudness",
    "mode",
    "popularity",
    "speechiness",
    "tempo",
]

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
features_collection = db[FEATURE_COLLECTION]
favorites_collection = db[FAVORITE_COLLECTION]

# Configure Essentia extractor once per process
music_extractor = MusicExtractor(
    lowlevelStats=True,
    rhythmStats=True,
    tonalStats=True,
)

# Load clustering pipeline and dataset for recommendations
dataset_df = None
scaled_features = None
cluster_labels = None
scaler = None
kmeans_model = None

try:
    clustering_pipeline = joblib.load(MODEL_PATH)
    scaler = clustering_pipeline.named_steps["scaler"]
    kmeans_model = clustering_pipeline.named_steps["kmeans"]

    dataset_df = pd.read_csv(DATASET_PATH)
    missing_cols = [c for c in FEATURE_COLUMNS if c not in dataset_df.columns]
    if missing_cols:
        raise RuntimeError(f"Dataset missing required columns: {missing_cols}")

    # Prepare feature matrix and cluster labels at startup
    feature_matrix = dataset_df[FEATURE_COLUMNS].fillna(0).to_numpy()
    scaled_features = scaler.transform(feature_matrix)
    cluster_labels = kmeans_model.predict(scaled_features)
    logger.info(
        "Loaded recommendation assets: %s rows, %s clusters",
        len(dataset_df),
        kmeans_model.n_clusters,
    )
except Exception as exc:
    logger.exception("Failed to preload recommendation model/data: %s", exc)


class SongPayload(BaseModel):
    songId: str
    file: str
    name: Optional[str] = None
    album: Optional[str] = None


app = FastAPI(title="Recommendation Service", version="1.0.0")

# Permit browser calls from frontend and APIs during local/dev usage
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _safe_number(pool, key: str, default: Optional[float] = None) -> Optional[float]:
    try:
        value = pool[key]
        # MusicExtractor already aggregates most values; convert to python float
        if isinstance(value, (list, tuple, np.ndarray)):
            value = value[0] if value else default
        if hasattr(value, "item") and not isinstance(value, Number):
            value = value.item()
        return float(value)
    except Exception:
        return default


def _safe_string(pool, key: str, default: str = "") -> str:
    try:
        value = pool[key]
        if isinstance(value, (list, tuple)):
            return str(value[0]) if value else default
        return str(value)
    except Exception:
        return default


def download_audio(file_url: str, target_path: str) -> None:
    resp = requests.get(file_url, stream=True, timeout=30)
    if not resp.ok:
        raise HTTPException(
            status_code=400,
            detail=f"Audio download failed with status {resp.status_code}",
        )

    with open(target_path, "wb") as fp:
        for chunk in resp.iter_content(chunk_size=8192):
            if chunk:
                fp.write(chunk)


def extract_metadata(audio_path: str, file_url: str) -> dict:
    base_stem = Path(urlparse(file_url).path).stem or Path(audio_path).stem
    metadata = {
        "name": base_stem,
        "artist": "Unknown",
        "album": "Unknown",
        "year": 2000,
        "genre": "Unknown",
        "duration_ms": None,
    }

    try:
        tag = TinyTag.get(audio_path)
        metadata["name"] = tag.title or Path(audio_path).stem or metadata["name"]
        metadata["artist"] = tag.artist or "Unknown"
        metadata["album"] = tag.album or "Unknown"
        metadata["year"] = int(tag.year) if tag.year else 2000
        metadata["genre"] = tag.genre or "Unknown"
        metadata["duration_ms"] = (
            int(float(tag.duration) * 1000) if tag.duration else None
        )
    except Exception as exc:
        logger.warning("Metadata extraction skipped for %s: %s", audio_path, exc)

    return metadata


def _key_to_index(key_str: str) -> int:
    key_map = {
        "c": 0,
        "c#": 1,
        "d": 2,
        "d#": 3,
        "e": 4,
        "f": 5,
        "f#": 6,
        "g": 7,
        "g#": 8,
        "a": 9,
        "a#": 10,
        "b": 11,
    }
    return key_map.get(key_str.lower(), -1)


def extract_features(audio_path: str, metadata_year: int, metadata_duration_ms: Optional[int]) -> dict:
    features, _ = music_extractor(audio_path)

    tempo = _safe_number(features, "rhythm.bpm", 0.0)
    key_str = _safe_string(features, "tonal.key_key", "")
    scale = _safe_string(features, "tonal.key_scale", "").lower()
    mode = 1 if scale == "major" else 0 if scale else -1
    duration_ms = metadata_duration_ms
    if duration_ms is None:
        extracted_duration = _safe_number(features, "metadata.duration", 0.0)
        duration_ms = int(float(extracted_duration) * 1000) if extracted_duration else 0

    audio_features = {
        "valence": _safe_number(features, "highlevel.mood_happy.value", 0.0),
        "year": metadata_year,
        "acousticness": _safe_number(features, "highlevel.acoustic.value", 0.0),
        "danceability": _safe_number(features, "rhythm.danceability", 0.0),
        "duration_ms": duration_ms,
        "energy": _safe_number(features, "highlevel.energy.value", 0.0),
        "explicit": 0,
        "instrumentalness": _safe_number(features, "highlevel.instrumental.value", 0.0),
        "key": _key_to_index(key_str),
        "liveness": _safe_number(features, "highlevel.live.value", 0.0),
        "loudness": _safe_number(features, "lowlevel.average_loudness", 0.0),
        "mode": mode,
        "popularity": 0,
        "speechiness": _safe_number(features, "highlevel.speechiness.value", 0.0),
        "tempo": tempo,
    }

    return {k: v for k, v in audio_features.items() if v is not None}


def persist_features(song_id: str, file_url: str, metadata: dict, audio_features: dict):
    features_collection.update_one(
        {"_id": song_id},
        {
            "$set": {
                "_id": song_id,
                "songId": song_id,
                "file": file_url,
                "metadata": metadata,
                "features": audio_features,
                "updatedAt": datetime.utcnow(),
            }
        },
        upsert=True,
    )


def process_song(payload: SongPayload) -> None:
    song_id = payload.songId
    file_url = payload.file

    tmp_dir = tempfile.mkdtemp(prefix="audio_")
    audio_name = Path(urlparse(file_url).path).name or f"{song_id}.audio"
    audio_path = os.path.join(tmp_dir, audio_name)

    try:
        logger.info("Downloading audio for song %s", song_id)
        download_audio(file_url, audio_path)

        logger.info("Extracting metadata for song %s", song_id)
        metadata = extract_metadata(audio_path, file_url)
        if payload.name:
            metadata["name"] = payload.name
        if payload.album:
            metadata["album"] = payload.album

        logger.info("Running Essentia feature extraction for song %s", song_id)
        audio_features = extract_features(
            audio_path, metadata_year=metadata["year"], metadata_duration_ms=metadata["duration_ms"]
        )

        persist_features(song_id, file_url, metadata, audio_features)
        logger.info(
            "Stored feature set for song %s with keys: %s",
            song_id,
            list(audio_features.keys()),
        )
    except Exception as exc:
        logger.exception("Feature extraction failed for song %s: %s", song_id, exc)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/recommendation/extract")
async def schedule_feature_extraction(
    payload: SongPayload, background_tasks: BackgroundTasks
):
    if not payload.file:
        raise HTTPException(status_code=400, detail="file is required")

    background_tasks.add_task(process_song, payload)
    return {"success": True, "message": "Feature extraction scheduled"}


def _build_feature_vector(song_features: dict) -> Optional[list]:
    try:
        return [float(song_features.get(col, 0.0)) for col in FEATURE_COLUMNS]
    except Exception:
        return None


def _recommend_from_scaled_vector(scaled_vector: np.ndarray, limit: int):
    cluster = int(kmeans_model.predict(scaled_vector)[0])

    cluster_mask = cluster_labels == cluster
    if not cluster_mask.any():
        raise HTTPException(status_code=404, detail="No similar songs in dataset")

    cluster_vectors = scaled_features[cluster_mask]
    distances = np.linalg.norm(cluster_vectors - scaled_vector, axis=1)
    nearest_idx_within_cluster = np.argsort(distances)[:limit]

    dataset_indices = np.flatnonzero(cluster_mask)[nearest_idx_within_cluster]
    recommendations = []
    for idx, dist in zip(dataset_indices, distances[nearest_idx_within_cluster]):
        row = dataset_df.iloc[idx]
        recommendations.append(
            {
                "id": row.get("id"),
                "name": row.get("name"),
                "artists": row.get("artists"),
                "year": int(row.get("year")) if pd.notna(row.get("year")) else None,
                "popularity": int(row.get("popularity"))
                if pd.notna(row.get("popularity"))
                else None,
                "distance": float(dist),
                "features": {col: row.get(col) for col in FEATURE_COLUMNS},
            }
        )

    return cluster, recommendations


@app.get("/api/recommendation/song/{song_id}")
def recommend_for_song(song_id: str, limit: int = RECOMMENDATION_LIMIT_DEFAULT):
    if scaler is None or kmeans_model is None or dataset_df is None:
        raise HTTPException(status_code=500, detail="Recommendation assets not loaded")

    doc = features_collection.find_one({"songId": song_id}) or features_collection.find_one({"_id": song_id})
    if not doc or not doc.get("features"):
        raise HTTPException(status_code=404, detail="Song features not found")

    vector = _build_feature_vector(doc["features"])
    if not vector:
        raise HTTPException(status_code=400, detail="Song feature vector incomplete")

    limit = max(1, min(int(limit or RECOMMENDATION_LIMIT_DEFAULT), 50))

    scaled_song = scaler.transform([vector])
    cluster, recommendations = _recommend_from_scaled_vector(scaled_song, limit)

    return {
        "success": True,
        "cluster": cluster,
        "count": len(recommendations),
        "recommendations": recommendations,
    }


@app.get("/api/recommendation/user/{user_id}")
def recommend_for_user(user_id: str, limit: int = RECOMMENDATION_LIMIT_DEFAULT):
    if scaler is None or kmeans_model is None or dataset_df is None:
        raise HTTPException(status_code=500, detail="Recommendation assets not loaded")

    limit = max(1, min(int(limit or RECOMMENDATION_LIMIT_DEFAULT), 50))

    favorite_docs = list(favorites_collection.find({"userId": user_id}))
    if not favorite_docs:
        raise HTTPException(status_code=404, detail="No favorites found for user")

    favorite_song_ids = [str(doc.get("song")) for doc in favorite_docs if doc.get("song")]
    if not favorite_song_ids:
        raise HTTPException(status_code=404, detail="No favorite songs found for user")

    feature_docs = list(
        features_collection.find(
            {"$or": [{"songId": {"$in": favorite_song_ids}}, {"_id": {"$in": favorite_song_ids}}]}
        )
    )
    vectors = []
    for doc in feature_docs:
        vec = _build_feature_vector(doc.get("features", {}))
        if vec:
            vectors.append(vec)

    if not vectors:
        raise HTTPException(status_code=404, detail="No extracted features for favorites")

    scaled_favorites = scaler.transform(vectors)
    centroid = np.mean(scaled_favorites, axis=0, keepdims=True)

    cluster, recommendations = _recommend_from_scaled_vector(centroid, limit)

    return {
        "success": True,
        "cluster": cluster,
        "favoritesUsed": len(vectors),
        "count": len(recommendations),
        "recommendations": recommendations,
    }
