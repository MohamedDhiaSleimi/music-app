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
    ? albums.find((a) => a._id === albumId)?.bgColour || "#121212"
    : "#121212";

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = isAlbum 
        ? `linear-gradient(${bgColor},#121212)` 
        : "#121212";
    }
  }, [isAlbum, bgColor]);

  return (
    <div
      ref={displayRef}
      className="w-[100%] m-2 px-6 pt-4 rounded-3xl bg-[#0c0c12]/80 backdrop-blur-xl border border-white/5 text-white overflow-auto shadow-[0_20px_60px_-24px_rgba(0,0,0,0.75)] lg:w-[75%] lg:ml-0"
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
