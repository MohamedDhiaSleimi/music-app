import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
        <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
          <div onClick={() => navigate("/")} className="flex items-center gap-3 pl-8 cursor-pointer">
            <span>🏠</span>
            <p className="font-bold">Home</p>
          </div>
        </div>
        <div className="bg-[#121212] h-[85%] rounded p-4">
          <div className="flex items-center gap-3 mb-4">
            <span>📚</span>
            <p className="font-semibold">Your Library</p>
          </div>
          <button
            onClick={() => navigate("/favorites")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded hover:bg-[#1f1f1f] transition"
          >
            <span>❤️</span>
            <span className="font-medium">Favorites</span>
          </button>
          <button
            onClick={() => navigate("/playlists")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded hover:bg-[#1f1f1f] transition"
          >
            <span>🎵</span>
            <span className="font-medium">Playlists</span>
          </button>
          <button
            onClick={() => navigate("/discover")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded hover:bg-[#1f1f1f] transition"
          >
            <span>🌍</span>
            <span className="font-medium">Discover</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden w-full px-2 py-2 flex items-center gap-2 text-white bg-[#121212] sticky top-0 z-10">
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] rounded py-2 text-sm font-medium"
        >
          🏠 Home
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] rounded py-2 text-sm font-medium"
        >
          ❤️ Fav
        </button>
        <button
          onClick={() => navigate("/playlists")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] rounded py-2 text-sm font-medium"
        >
          🎵 Lists
        </button>
        <button
          onClick={() => navigate("/discover")}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] rounded py-2 text-sm font-medium"
        >
          🌍 Discover
        </button>
      </div>
    </>
  );
}
