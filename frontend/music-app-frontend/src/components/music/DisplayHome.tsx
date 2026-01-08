import { useNavigate } from "react-router-dom";
import { useMusic } from "../../context/MusicContext";
import AlbumItem from "./AlbumItem";
import Navbar from "./Navbar";
import SongItem from "./SongItem";

export default function DisplayHome() {
  const { 
    sortedSongsData,
    sortedAlbumsData,
    dailyDiscoverPlaylists,
    viewFilter 
  } = useMusic();
  const navigate = useNavigate();

  const isMusicOnly = viewFilter === "music";

  return (
    <>
      <Navbar />

      {viewFilter === "all" && dailyDiscoverPlaylists.length > 0 && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Daily Discover</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {dailyDiscoverPlaylists.map((playlist) => {
              const coverImage = playlist.songs[0]?.image;
              return (
                <div
                  key={playlist._id}
                  onClick={() => navigate(`/playlists/${playlist._id}`)}
                  className="bg-neutral-900 p-4 rounded-lg hover:bg-neutral-800 transition flex flex-col cursor-pointer"
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={playlist.name}
                      className="w-full aspect-square rounded mb-3"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded mb-3 bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-xl font-semibold text-white">
                      DD
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {playlist.name}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {playlist.description || "Daily picks"}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                      Daily
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {playlist.songs.length} song
                    {playlist.songs.length === 1 ? "" : "s"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Songs Section */}
      {(viewFilter === "all" || viewFilter === "music") && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Today's biggest hits</h1>
          <div
            className={
              isMusicOnly
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6"
                : "flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
            }
          >
            {sortedSongsData.map((item) => (
              <SongItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Albums Section */}
      {viewFilter === "all" && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Featured Charts</h1>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {sortedAlbumsData.map((item) => (
              <AlbumItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
