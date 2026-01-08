import { useMemo } from "react";
import Navbar from "./Navbar";
import SongItem from "./SongItem";
import { useMusic } from "../../context/MusicContext";

export default function DisplayFavorites() {
  const { favoriteSongs, isFavoritesLoading, searchQuery, sortSongs } =
    useMusic();

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favoriteSongs;
    const q = searchQuery.toLowerCase();
    return favoriteSongs.filter(
      (song) =>
        song.name.toLowerCase().includes(q) || song.desc.toLowerCase().includes(q)
    );
  }, [favoriteSongs, searchQuery]);
  const sortedFavorites = useMemo(
    () => sortSongs(filteredFavorites),
    [filteredFavorites, sortSongs]
  );

  return (
    <>
      <Navbar />
      <div className="mt-6">
        <h1 className="my-6 font-bold text-2xl">Your Favorites</h1>
        {isFavoritesLoading ? (
          <p className="text-gray-400">Loading favorites...</p>
        ) : sortedFavorites.length ? (
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide flex-wrap">
            {sortedFavorites.map((item) => (
              <SongItem key={item._id} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You have not favorited any songs yet.</p>
        )}
      </div>
    </>
  );
}
