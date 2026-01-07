import type { MouseEvent } from "react";
import { useState } from "react";
import { useMusic } from "../../context/MusicContext";
import type { Song } from "../../types/music.types";

type SongItemProps = Pick<Song, "_id" | "image" | "name" | "desc">;

export default function SongItem({ _id, image, name, desc }: SongItemProps) {
  const { playWithId, isFavorite, toggleFavorite, favoriteUpdatingIds, addSongToQueue } = useMusic();
  const isSongFavorite = isFavorite(_id);
  const isUpdating = favoriteUpdatingIds.has(_id);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleFavorite(_id);
  };
  
  return (
    <div
      onClick={() => playWithId(_id)}
      className="group min-w-[190px] max-w-[210px] p-3 rounded-2xl cursor-pointer bg-white/5 border border-white/10 hover:border-white/30 hover:-translate-y-1 transition shadow-md shadow-black/30"
    >
      <div className="relative rounded-xl overflow-hidden aspect-square">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "http://localhost:3000/static/default-song.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition" />

        <button
          onClick={handleToggleFavorite}
          disabled={isUpdating}
          className={`absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isSongFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isSongFavorite ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
          )}
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-white/90">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur">
            ▶
          </span>
          <span className="opacity-80">Tap to play</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addSongToQueue(_id);
            }}
            className="px-3 py-1 rounded-full bg-white/80 text-black text-xs font-semibold hover:scale-105 transition"
          >
            + Queue
          </button>
        </div>
      </div>
      <p className="font-bold mt-3 mb-1 text-white leading-tight line-clamp-2 max-h-12 max-w-[180px]">{name}</p>
      <p className="text-slate-200 text-sm opacity-90 leading-relaxed line-clamp-2 max-h-12 max-w-[180px]">{desc}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(true);
        }}
        className="mt-2 text-xs text-blue-200 hover:text-white font-semibold"
      >
        See more
      </button>

      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white text-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{name}</h2>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
