import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";

export default function DisplaySharedPlaylist() {
  const { shareCode } = useParams();
  const { sharedPlaylist, fetchSharedPlaylist, playWithId, sortSongs } =
    useMusic();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!shareCode) return;
      setIsLoading(true);
      await fetchSharedPlaylist(shareCode);
      setIsLoading(false);
    };
    load();
  }, [fetchSharedPlaylist, shareCode]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <p className="text-white mt-6">Loading shared playlist...</p>
      </>
    );
  }

  if (!sharedPlaylist) {
    return (
      <>
        <Navbar />
        <div className="text-white mt-6">
          <p>Shared playlist not found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-white text-black rounded font-semibold"
          >
            Back home
          </button>
        </div>
      </>
    );
  }

  const sortedSongs = sortSongs(sharedPlaylist.songs);

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6 text-white">
        <div className="bg-[#121212] p-4 rounded">
          <p className="text-sm text-gray-400">Shared playlist</p>
          <h1 className="text-3xl font-bold">{sharedPlaylist.name}</h1>
          <p className="text-gray-400">
            {sharedPlaylist.description || "No description"}
          </p>
        </div>

        <div className="bg-[#121212] p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          {sharedPlaylist.songs.length === 0 ? (
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
