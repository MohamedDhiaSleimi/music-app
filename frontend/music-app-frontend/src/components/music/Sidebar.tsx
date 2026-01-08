import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCompass, faHeart, faHouse, faMusic } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className="w-[25%] h-full p-3 flex-col gap-3 hidden lg:flex">
        <div className="app-surface-soft h-[15%] flex flex-col justify-center px-6">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer text-slate-700 hover:text-slate-900 hover:-translate-y-[1px] transition"
          >
            <FontAwesomeIcon icon={faHouse} className="text-slate-600 text-sm" aria-hidden="true" />
            <p className="font-semibold tracking-tight">Home</p>
          </div>
        </div>
        <div className="app-surface h-[85%] p-4">
          <div className="flex items-center gap-3 mb-5 text-slate-600">
            <FontAwesomeIcon icon={faBookOpen} className="text-slate-600 text-sm" aria-hidden="true" />
            <p className="font-semibold">Your Library</p>
          </div>
          <button
            onClick={() => navigate("/favorites")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-900/5 transition border border-transparent hover:border-slate-200"
          >
            <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-sm" aria-hidden="true" />
            <span className="font-medium text-slate-700">Favorites</span>
          </button>
          <button
            onClick={() => navigate("/playlists")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-900/5 transition border border-transparent hover:border-slate-200"
          >
            <FontAwesomeIcon icon={faMusic} className="text-slate-600 text-sm" aria-hidden="true" />
            <span className="font-medium text-slate-700">Playlists</span>
          </button>
          <button
            onClick={() => navigate("/discover")}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-900/5 transition border border-transparent hover:border-slate-200"
          >
            <FontAwesomeIcon icon={faCompass} className="text-slate-600 text-sm" aria-hidden="true" />
            <span className="font-medium text-slate-700">Discover</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden w-full px-2 py-2 flex items-center gap-2 text-slate-700 bg-white/80 border-b border-slate-200/70 sticky top-0 z-10 backdrop-blur">
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/70 border border-slate-200/80 rounded-xl py-2 text-sm font-semibold hover:border-slate-300 transition"
        >
          <FontAwesomeIcon icon={faHouse} className="text-slate-600 text-sm" aria-hidden="true" />
          Home
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/70 border border-slate-200/80 rounded-xl py-2 text-sm font-semibold hover:border-slate-300 transition"
        >
          <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-sm" aria-hidden="true" />
          Fav
        </button>
        <button
          onClick={() => navigate("/playlists")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/70 border border-slate-200/80 rounded-xl py-2 text-sm font-semibold hover:border-slate-300 transition"
        >
          <FontAwesomeIcon icon={faMusic} className="text-slate-600 text-sm" aria-hidden="true" />
          Lists
        </button>
        <button
          onClick={() => navigate("/discover")}
          className="flex-1 flex items-center justify-center gap-2 bg-white/70 border border-slate-200/80 rounded-xl py-2 text-sm font-semibold hover:border-slate-300 transition"
        >
          <FontAwesomeIcon icon={faCompass} className="text-slate-600 text-sm" aria-hidden="true" />
          Discover
        </button>
      </div>
    </>
  );
}
