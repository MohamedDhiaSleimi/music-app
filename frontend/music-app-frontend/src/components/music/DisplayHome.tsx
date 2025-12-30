import { useMusic } from "../../context/MusicContext";
import AlbumItem from "./AlbumItem";
import Navbar from "./Navbar";
import SongItem from "./SongItem";

export default function DisplayHome() {
  const { 
    filteredSongsData, 
    filteredAlbumsData, 
    viewFilter 
  } = useMusic();

  return (
    <>
      <Navbar />

      {/* Songs Section */}
      {(viewFilter === "all" || viewFilter === "music") && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Today's biggest hits</h1>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {filteredSongsData.map((item) => (
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
            {filteredAlbumsData.map((item) => (
              <AlbumItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}