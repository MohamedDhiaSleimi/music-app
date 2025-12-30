import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import DisplayFavorites from "./DisplayFavorites";
import { useEffect, useRef } from "react";
import { useMusic } from "../../context/MusicContext";

export default function Display() {
  const { albumsData } = useMusic();
  const displayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";
  
  // Find album in the full albums list, not filtered
  const bgColor = isAlbum && albumId
    ? albumsData.find((a) => a._id === albumId)?.bgColour || "#121212"
    : "#121212";

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = isAlbum 
        ? `linear-gradient(${bgColor},#121212)` 
        : "#121212";
    }
  }, [isAlbum, bgColor]);

  return (
    <div ref={displayRef} className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
        <Routes>
          <Route path="/" element={<DisplayHome />} />
          <Route path="/album/:id" element={<DisplayAlbum />} />
          <Route path="/favorites" element={<DisplayFavorites />} />
        </Routes>
    </div>
  );
}
