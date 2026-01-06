import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";
import type { Playlist } from "../../../src/types/music.types";

export default function DisplayPublicPlaylist() {
  const { playlistId } = useParams();
  const { getPublicPlaylist, playWithId } = useMusic();
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
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading public playlist...</p>
          </div>
        </div>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <Navbar />
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Playlist Not Available</h2>
          <p className="text-gray-600 mb-6">This playlist is either private or doesn't exist.</p>
          <button
            onClick={() => navigate("/discover")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
          >
            Back to Discover
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6">
        {/* Playlist Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">🌍</span>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Public Playlist
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{playlist.name}</h1>
          <p className="text-gray-600 mb-4">
            {playlist.description || "No description provided"}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span>🎵</span>
              <span>{playlist.songs.length} songs</span>
            </span>
            <span>•</span>
            <span>👤 Shared by community</span>
          </div>
        </div>

        {/* Songs Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Playlist Tracks</h2>
              <p className="text-gray-600">Discover songs from this public playlist</p>
            </div>
            <button
              onClick={() => navigate("/discover")}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              ← Back to Discover
            </button>
          </div>
          
          {playlist.songs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <p className="text-gray-600">No songs in this playlist yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for updates!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {playlist.songs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                      <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 truncate">{song.name}</p>
                      <p className="text-sm text-gray-600 truncate">{song.album}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => playWithId(song._id)}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md flex items-center gap-2"
                  >
                    <span>▶️</span>
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