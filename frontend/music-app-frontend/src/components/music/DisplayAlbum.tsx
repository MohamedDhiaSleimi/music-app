import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMusic } from "../../context/MusicContext";
import Navbar from "./Navbar";
import type { Album } from "../../types/music.types";
import { Skeleton } from "../ui/Skeleton";

export default function DisplayAlbum() {
  const { id } = useParams();
  const { albums, songs, playWithId, track, playStatus, play, pause, playAlbum, toggleShuffle, loopMode, cycleLoopMode, favoriteSongIds, isLoading } = useMusic();
  const [album, setAlbum] = useState<Album | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const found = albums.find((item) => item._id === id) || null;
    setAlbum(found);
  }, [albums, id]);

  if (isLoading || !album) {
    return (
      <>
        <Navbar />
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
          <Skeleton className="w-48 h-48 rounded" />
          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </>
    );
  }

  const albumSongs = songs.filter((s) => s.album === album.name);

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={album.image} alt={album.name} />
        <div className="flex flex-col gap-3">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-2 md:text-7xl">{album.name}</h2>
          <h4>{album.desc}</h4>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => playAlbum(album._id)}
              className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition"
            >
              Play album
            </button>
            <button
              onClick={() => albumSongs[0] && playWithId(albumSongs[0]._id)}
              className="px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white/10"
            >
              Play first track
            </button>
            <button
              onClick={toggleShuffle}
              className="px-4 py-2 rounded-full bg-white/20 border border-white/40 text-white hover:bg-white/10"
            >
              Shuffle album
            </button>
            <button
              onClick={cycleLoopMode}
              className="px-4 py-2 rounded-full bg-white/20 border border-white/40 text-white hover:bg-white/10"
            >
              Loop {loopMode === "one" ? "track" : loopMode === "all" ? "all" : "off"}
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-[0.5fr_2fr_2fr_0.5fr] mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p><b className="mr-4">#</b>Title</p>
        <p>Name</p>
        <p className="hidden sm:block">Album</p>
        <p className="text-center">Duration</p>
      </div>
      <hr />
      {albumSongs.map((song, idx) => (
        <div
          key={song._id}
          onClick={() => (hoveredId === song._id && playStatus ? pause() : playWithId(song._id))}
          onMouseEnter={() => setHoveredId(song._id)}
          onMouseLeave={() => setHoveredId(null)}
          className="grid grid-cols-3 sm:grid-cols-[0.5fr_2fr_2fr_0.5fr] gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff26] cursor-pointer"
        >
          <div className="flex items-center">
            {track?._id === song._id && playStatus ? (
              <span className="mr-4">▶</span>
            ) : hoveredId === song._id ? (
              <span className="mr-4 cursor-pointer" onClick={play}>▶</span>
            ) : (
              <b className="mr-4" onClick={() => playWithId(song._id)}>{idx + 1}</b>
            )}
            <img className="w-10 mr-5" src={song.image} alt={song.name} />
          </div>
          <p className="text-[15px] font-bold flex items-center gap-2">
            {song.name}
            {favoriteSongIds.has(song._id) && <span title="Favorite">❤️</span>}
          </p>
          <p className="text-[15px] hidden sm:block">{song.album}</p>
          <p className="text-[15px] text-center">{song.duration}</p>
        </div>
      ))}
    </>
  );
}
