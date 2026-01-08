import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import DisplayFavorites from "./DisplayFavorites";
import { useEffect, useRef } from "react";
import { useMusic } from "../../context/MusicContext";
import DisplayPlaylists from "./DisplayPlaylists";
import DisplayPlaylistDetail from "./DisplayPlaylistDetail";
import DisplayDiscoverPlaylists from "./DisplayDiscoverPlaylists";
import DisplaySharedPlaylist from "./DisplaySharedPlaylist";
import DisplayPublicPlaylist from "./DisplayPublicPlaylist";

export default function Display() {
  const { albums } = useMusic();
  const displayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";
  
  // Find album in the full albums list, not filtered
  const bgColor = isAlbum && albumId
    ? albums.find((a) => a._id === albumId)?.bgColour || "#f2ede6"
    : "#f7f4ef";

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = isAlbum
        ? `linear-gradient(180deg, ${bgColor} 0%, #f1ece4 60%, #f7f4ef 100%)`
        : "linear-gradient(180deg, #ffffff 0%, #f3efe9 100%)";
    }
  }, [isAlbum, bgColor]);

  return (
    <div
      ref={displayRef}
      className="w-[100%] m-2 px-6 pt-4 rounded-3xl border border-slate-200/80 text-slate-900 overflow-auto shadow-lg bg-white/70 backdrop-blur lg:w-[75%] lg:ml-0"
    >
        <Routes>
          <Route path="/" element={<DisplayHome />} />
          <Route path="/album/:id" element={<DisplayAlbum />} />
          <Route path="/favorites" element={<DisplayFavorites />} />
          <Route path="/playlists" element={<DisplayPlaylists />} />
          <Route path="/playlists/:id" element={<DisplayPlaylistDetail />} />
          <Route path="/playlists/shared/:shareCode" element={<DisplaySharedPlaylist />} />
          <Route path="/discover" element={<DisplayDiscoverPlaylists />} />
          <Route path="/discover/:playlistId" element={<DisplayPublicPlaylist />} />
        </Routes>
    </div>
  );
}
