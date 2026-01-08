import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
        <div className="bg-white/5 border border-white/10 h-[15%] rounded-2xl flex flex-col justify-center px-8 shadow-lg shadow-black/30 backdrop-blur-xl">
          <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer hover:-translate-y-[1px] transition">
            <span className="text-lg">🏠</span>
            <p className="font-bold tracking-tight">Home</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 h-[85%] rounded-2xl p-4 shadow-lg shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">📚</span>
            <p className="font-semibold text-gray-100">Your Library</p>
          </div>
          <button
            onClick={() => navigate("/favorites")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10"
          >
            <span>❤️</span>
            <span className="font-medium">Favorites</span>
          </button>
          <button
            onClick={() => navigate("/playlists")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10"
          >
            <span>🎵</span>
            <span className="font-medium">Playlists</span>
          </button>
          <button
            onClick={() => navigate("/discover")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/10"
          >
            <span>🌍</span>
            <span className="font-medium">Discover</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden w-full px-2 py-2 flex items-center gap-2 text-white bg-gradient-to-r from-[#0b1728] via-[#10121b] to-[#0b1728] border-b border-white/10 sticky top-0 z-10 backdrop-blur">
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/10 rounded-xl py-2 text-sm font-medium hover:bg-white/20 transition"
        >
          🏠 Home
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/10 rounded-xl py-2 text-sm font-medium hover:bg-white/20 transition"
        >
          ❤️ Fav
        </button>
        <button
          onClick={() => navigate("/playlists")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/10 rounded-xl py-2 text-sm font-medium hover:bg-white/20 transition"
        >
          🎵 Lists
        </button>
        <button
          onClick={() => navigate("/discover")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/10 rounded-xl py-2 text-sm font-medium hover:bg-white/20 transition"
        >
          🌍 Discover
        </button>
      </div>
    </>
  );
}
