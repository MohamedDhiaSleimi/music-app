import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic, type Playlist } from "../../context/MusicContext";

export default function DisplayPublicPlaylist() {
  const { playlistId } = useParams();
  const { getPublicPlaylist, playWithId, sortSongs } = useMusic();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!playlistId) return;
      setIsLoading(true);
      const data = await getPublicPlaylist(playlistId);
      setPlaylist(data);
      setIsLoading(false);
    };
    load();
  }, [getPublicPlaylist, playlistId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <p className="text-slate-500 mt-6">Loading playlist...</p>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <Navbar />
        <div className="text-slate-700 mt-6">
          <p>Playlist not found or not public.</p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-4 app-button app-button-primary"
          >
            Back to discover
          </button>
        </div>
      </>
    );
  }

  const sortedSongs = sortSongs(playlist.songs);

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6 text-slate-900">
        <div className="app-surface p-5">
          <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">Public playlist</p>
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-slate-600">
            {playlist.description || "No description"}
          </p>
        </div>

        <div className="app-surface p-5">
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          {playlist.songs.length === 0 ? (
            <p className="text-slate-500">No songs in this playlist yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between bg-white/80 border border-slate-200 rounded-2xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{song.name}</p>
                      <p className="text-sm text-slate-500">{song.album}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => playWithId(song._id)}
                    className="px-3 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
