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
          <h1 className="my-6 font-bold text-2xl text-slate-900">Daily Discover</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {dailyDiscoverPlaylists.map((playlist) => {
              const coverImage = playlist.songs[0]?.image;
              return (
                <div
                  key={playlist._id}
                  onClick={() => navigate(`/playlists/${playlist._id}`)}
                  className="bg-white/80 border border-slate-200 p-4 rounded-2xl hover:border-slate-300 transition flex flex-col cursor-pointer shadow-md"
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={playlist.name}
                      className="w-full aspect-square rounded-xl mb-3"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-xl mb-3 bg-gradient-to-br from-teal-500/30 to-amber-300/40 flex items-center justify-center text-xl font-semibold text-slate-800">
                      DD
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-slate-900 font-medium truncate">
                        {playlist.name}
                      </p>
                      <p className="text-slate-500 text-sm truncate">
                        {playlist.description || "Daily picks"}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                      Daily
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-2">
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
          <h1 className="my-6 font-bold text-2xl text-slate-900">Today's biggest hits</h1>
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
          <h1 className="my-6 font-bold text-2xl text-slate-900">Featured Charts</h1>
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
