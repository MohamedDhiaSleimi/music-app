import { useMusic } from "../../context/MusicContext";
import AlbumItem from "./AlbumItem";
import Navbar from "./Navbar";
import SongItem from "./SongItem";
import { Skeleton } from "../ui/Skeleton";
import { RecommendationCard } from "./RecommendationCard";

export default function DisplayHome() {
  const { 
    filteredSongsData, 
    filteredAlbumsData, 
    viewFilter,
    isLoading,
    recommendations,
    recommendedAlbums,
    isRecommendationLoading,
  } = useMusic();

  const hits = recommendations.slice(0, 10);
  const featuredAlbums = recommendedAlbums.slice(0, 6);

  return (
    <>
      <Navbar />

      {/* Songs Section */}
      {(viewFilter === "all" || viewFilter === "music") && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Today's biggest hits</h1>
          {isLoading || isRecommendationLoading ? (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="w-48 shrink-0">
                  <Skeleton className="w-full h-44" />
                  <Skeleton className="h-4 w-3/4 mt-3" />
                  <Skeleton className="h-3 w-5/6 mt-2" />
                </div>
              ))}
            </div>
          ) : hits.length > 0 ? (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {hits.map((item, idx) => (
                <RecommendationCard
                  key={item.id || idx}
                  item={item}
                  accent={`linear-gradient(135deg, hsl(${(idx * 35) % 360},75%,70%), hsl(${(idx * 35 + 20) % 360},65%,60%))`}
                />
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {filteredSongsData.map((item) => (
                <SongItem key={item._id} {...item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Albums Section */}
      {viewFilter === "all" && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Recommended Albums</h1>
          {isLoading || isRecommendationLoading ? (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-44 shrink-0">
                  <Skeleton className="w-full h-44 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mt-3" />
                  <Skeleton className="h-3 w-5/6 mt-2" />
                </div>
              ))}
            </div>
          ) : featuredAlbums.length > 0 ? (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {featuredAlbums.map((item) => (
                <AlbumItem key={item._id} {...item} />
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {filteredAlbumsData.map((item) => (
                <AlbumItem key={item._id} {...item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Charts fallback */}
      {viewFilter === "all" && (
        <div className="mb-8">
          <h1 className="my-6 font-bold text-2xl">Featured Charts</h1>
          {isLoading ? (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-44 shrink-0">
                  <Skeleton className="w-full h-44 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mt-3" />
                  <Skeleton className="h-3 w-5/6 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {filteredAlbumsData.slice(0, 6).map((item) => (
                <AlbumItem key={item._id} {...item} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
