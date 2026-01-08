import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMusic } from "../../context/MusicContext";
import Navbar from "./Navbar";
import type { Album } from "../../types/music.types";

export default function DisplayAlbum() {
  const { id } = useParams();
  const {
    albums,
    songs,
    sortSongs,
    playWithId,
    track,
    playStatus,
    play,
    pause,
    playAlbum,
  } = useMusic();
  const [album, setAlbum] = useState<Album | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const found = albums.find((item) => item._id === id) || null;
    setAlbum(found);
  }, [albums, id]);

  if (!album) return null;

  const albumSongs = sortSongs(songs.filter((s) => s.album === album.name));

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded-2xl shadow-md" src={album.image} alt={album.name} />
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Playlist</p>
          <h2 className="text-5xl font-bold mb-2 md:text-7xl text-slate-900">{album.name}</h2>
          <h4 className="text-slate-600">{album.desc}</h4>
          <div className="flex gap-3">
            <button
              onClick={() => playAlbum(album._id)}
              className="app-button app-button-primary"
            >
              Play album
            </button>
            <button
              onClick={() => albumSongs[0] && playWithId(albumSongs[0]._id)}
              className="app-button app-button-ghost"
            >
              Play first track
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-[0.5fr_2fr_2fr_0.5fr] mt-10 mb-4 pl-2 text-slate-500 text-sm">
        <p><b className="mr-4">#</b>Title</p>
        <p>Name</p>
        <p className="hidden sm:block">Album</p>
        <p className="text-center">Duration</p>
      </div>
      <hr className="border-slate-200" />
      {albumSongs.map((song, idx) => (
        <div
          key={song._id}
          onClick={() => (hoveredId === song._id && playStatus ? pause() : playWithId(song._id))}
          onMouseEnter={() => setHoveredId(song._id)}
          onMouseLeave={() => setHoveredId(null)}
          className="grid grid-cols-3 sm:grid-cols-[0.5fr_2fr_2fr_0.5fr] gap-2 p-2 items-center text-slate-600 hover:bg-slate-900/5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center">
            {track?._id === song._id && playStatus ? (
              <span className="mr-4 text-teal-700">▶</span>
            ) : hoveredId === song._id ? (
              <span className="mr-4 cursor-pointer text-teal-700" onClick={play}>▶</span>
            ) : (
              <b className="mr-4">{idx + 1}</b>
            )}
            <img className="w-10 mr-5 rounded-lg" src={song.image} alt={song.name} />
          </div>
          <p className="text-[15px] font-semibold text-slate-900">{song.name}</p>
          <p className="text-[15px] hidden sm:block">{song.album}</p>
          <p className="text-[15px] text-center">{song.duration}</p>
        </div>
      ))}
    </>
  );
}
