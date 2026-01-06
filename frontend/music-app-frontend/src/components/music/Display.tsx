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
    ? albums.find((a) => a._id === albumId)?.bgColour || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = isAlbum 
        ? `linear-gradient(${bgColor}, rgba(255, 255, 255, 0.1))` 
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  }, [isAlbum, bgColor]);

  return (
    <div
      ref={displayRef}
      className="w-[100%] m-2 px-6 pt-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 text-gray-800 overflow-auto shadow-xl lg:w-[75%] lg:ml-0"
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