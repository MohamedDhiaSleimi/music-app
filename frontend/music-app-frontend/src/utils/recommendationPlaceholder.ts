import type { Song } from "../types/music.types";

export interface RecommendationRequest {
  userId?: string;
  seedTrackIds?: string[];
  mood?: "happy" | "energetic" | "chill" | "dark";
  genre?: string;
  limit?: number;
}

export interface RecommendationResponse {
  recommendations: Song[];
  placeholder?: boolean;
  debug?: {
    seeds: string[];
    featureWeights: Record<string, number>;
    mood?: RecommendationRequest["mood"];
    genre?: string;
  };
}

export interface ScoredSong {
  song: Song;
  score: number;
}

type FeatureKeys =
  | "bpm"
  | "energy"
  | "danceability"
  | "valence"
  | "acousticness"
  | "instrumentalness"
  | "liveness"
  | "speechiness";

const FEATURE_WEIGHTS: Record<FeatureKeys, number> = {
  bpm: 0.25,
  energy: 0.2,
  danceability: 0.2,
  valence: 0.15,
  acousticness: 0.05,
  instrumentalness: 0.05,
  liveness: 0.05,
  speechiness: 0.05,
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const normalize = (value: number | undefined, min = 0, max = 1) => {
  if (value === undefined || Number.isNaN(value)) return 0;
  return clamp((value - min) / (max - min));
};

const songToVector = (song: Song) => ({
  bpm: normalize(song.bpm, 60, 190),
  energy: normalize(song.energy, 0, 1),
  danceability: normalize(song.danceability, 0, 1),
  valence: normalize(song.valence, 0, 1),
  acousticness: normalize(song.acousticness, 0, 1),
  instrumentalness: normalize(song.instrumentalness, 0, 1),
  liveness: normalize(song.liveness, 0, 1),
  speechiness: normalize(song.speechiness, 0, 1),
});

const cosineSimilarity = (
  a: Record<FeatureKeys, number>,
  b: Record<FeatureKeys, number>
) => {
  const dot = (Object.keys(a) as FeatureKeys[]).reduce(
    (sum, key) => sum + a[key] * b[key] * FEATURE_WEIGHTS[key],
    0
  );
  const normA = Math.sqrt(
    (Object.keys(a) as FeatureKeys[]).reduce(
      (sum, key) => sum + (a[key] * FEATURE_WEIGHTS[key]) ** 2,
      0
    )
  );
  const normB = Math.sqrt(
    (Object.keys(b) as FeatureKeys[]).reduce(
      (sum, key) => sum + (b[key] * FEATURE_WEIGHTS[key]) ** 2,
      0
    )
  );
  if (!normA || !normB) return 0;
  return dot / (normA * normB);
};

const applyMood = (
  vector: Record<FeatureKeys, number>,
  mood?: RecommendationRequest["mood"]
) => {
  if (!mood) return vector;
  const adjusted = { ...vector };
  if (mood === "happy") adjusted.valence = clamp(adjusted.valence + 0.1);
  if (mood === "energetic") adjusted.energy = clamp(adjusted.energy + 0.15);
  if (mood === "chill") {
    adjusted.energy = clamp(adjusted.energy - 0.1);
    adjusted.danceability = clamp(adjusted.danceability - 0.05);
  }
  if (mood === "dark") adjusted.valence = clamp(adjusted.valence - 0.15);
  return adjusted;
};

export const getRecommendations = async (
  input: RecommendationRequest,
  catalog: Song[]
): Promise<RecommendationResponse> => {
  if (!catalog.length) {
    return { recommendations: [], placeholder: false };
  }

  const { scored, seedPool } = await getRecommendationScores(input, catalog);

  const limit = input.limit ?? 10;
  return {
    recommendations: scored.slice(0, limit).map((s) => s.song),
    placeholder: false,
    debug: {
      seeds: seedPool.map((s) => s._id),
      featureWeights: FEATURE_WEIGHTS,
      mood: input.mood,
      genre: input.genre,
    },
  };
};

export const getRecommendationScores = async (
  input: RecommendationRequest,
  catalog: Song[]
): Promise<{ scored: ScoredSong[]; seedPool: Song[] }> => {
  if (!catalog.length) {
    return { scored: [], seedPool: [] };
  }

  const seeds =
    input.seedTrackIds
      ?.map((id) => catalog.find((s) => s._id === id))
      .filter(Boolean) as Song[] || [];

  const seedPool = seeds.length ? seeds : catalog.slice(0, 3);

  const targetVector: Record<FeatureKeys, number> = (Object.keys(
    FEATURE_WEIGHTS
  ) as FeatureKeys[]).reduce(
    (acc, key) => {
      const avg =
        seedPool.reduce((sum, song) => sum + songToVector(song)[key], 0) /
        seedPool.length;
      acc[key] = avg;
      return acc;
    },
    {} as Record<FeatureKeys, number>
  );

  const adjustedTarget = applyMood(targetVector, input.mood);

  const scored = catalog
    .filter((song) => !input.seedTrackIds?.includes(song._id))
    .map((song) => {
      const vector = songToVector(song);
      let score = cosineSimilarity(adjustedTarget, vector);

      if (input.genre && song.genre?.toLowerCase() === input.genre.toLowerCase()) {
        score += 0.05;
      }
      if (seeds.some((s) => s.artist && s.artist === song.artist)) {
        score += 0.02;
      }

      return { song, score };
    })
    .sort((a, b) => b.score - a.score);

  return { scored, seedPool };
};
