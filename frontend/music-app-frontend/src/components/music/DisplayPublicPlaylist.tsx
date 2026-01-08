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
        <p className="text-white mt-6">Loading playlist...</p>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <Navbar />
        <div className="text-white mt-6">
          <p>Playlist not found or not public.</p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-4 px-4 py-2 bg-white text-black rounded font-semibold"
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
      <div className="mt-6 flex flex-col gap-6 text-white">
        <div className="bg-[#121212] p-4 rounded">
          <p className="text-sm text-gray-400">Public playlist</p>
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-gray-400">
            {playlist.description || "No description"}
          </p>
        </div>

        <div className="bg-[#121212] p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          {playlist.songs.length === 0 ? (
            <p className="text-gray-400">No songs in this playlist yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between bg-[#1f1f1f] rounded p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{song.name}</p>
                      <p className="text-sm text-gray-400">{song.album}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => playWithId(song._id)}
                    className="px-3 py-2 rounded bg-[#2d2d2d] text-white text-sm font-semibold hover:bg-[#3d3d3d]"
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
