import type { MouseEvent } from "react";
import { useMusic } from "../../context/MusicContext";

interface SongItemProps {
  _id: string;
  image: string;
  name: string;
  desc: string;
}

export default function SongItem({ _id, image, name, desc }: SongItemProps) {
  const { playWithId, isFavorite, toggleFavorite, favoriteUpdatingIds } = useMusic();
  const isSongFavorite = isFavorite(_id);
  const isUpdating = favoriteUpdatingIds.has(_id);

  const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleFavorite(_id);
  };
  
  return (
    <div
      onClick={() => playWithId(_id)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <div className="relative">
        <img className="rounded" src={image} alt={name} />
        <button
          onClick={handleToggleFavorite}
          disabled={isUpdating}
          className={`absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
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
      </div>
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
}
