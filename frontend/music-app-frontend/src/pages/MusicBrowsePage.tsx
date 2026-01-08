import { useMusic } from '../context/MusicContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function MusicBrowsePage() {
  const {
    sortedSongsData,
    sortedAlbumsData,
    isLoading,
    playTrack,
    sortOption,
    setSortOption,
  } = useMusic();

  if (isLoading) return <LoadingSpinner fullScreen message="Loading music..." />;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto pb-32">
        {/* Albums Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Albums</h2>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-slate-200 text-sm text-slate-600">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Sort
              </span>
              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as typeof sortOption)
                }
                className="bg-transparent text-slate-700 text-sm focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="date">Date</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedAlbumsData.map((album) => (
              <div key={album._id} className="bg-white/80 border border-slate-200 p-4 rounded-2xl hover:border-slate-300 transition shadow-md">
                <img src={album.image} alt={album.name} className="w-full aspect-square rounded-xl mb-3" />
                <p className="text-slate-900 font-medium truncate">{album.name}</p>
                <p className="text-slate-500 text-sm truncate">{album.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Songs Section */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Songs</h2>
          <div className="space-y-2">
            {sortedSongsData.map((song) => (
              <div
                key={song._id}
                onClick={() => playTrack(song)}
                className="bg-white/80 border border-slate-200 p-4 rounded-2xl hover:border-slate-300 transition cursor-pointer flex items-center space-x-4 shadow-md"
              >
                <img src={song.image} alt={song.name} className="w-12 h-12 rounded-xl" />
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{song.name}</p>
                  <p className="text-slate-500 text-sm">{song.album}</p>
                </div>
                <span className="text-slate-500">{song.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
