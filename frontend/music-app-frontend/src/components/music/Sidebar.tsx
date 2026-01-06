import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className="w-[25%] h-full p-4 flex-col gap-4 text-gray-800 hidden lg:flex">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 h-[15%] rounded-2xl flex flex-col justify-center px-8 shadow-lg backdrop-blur-sm">
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-4 cursor-pointer hover:-translate-y-[1px] transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
              <span className="text-xl text-white">🏠</span>
            </div>
            <div>
              <p className="font-bold text-lg tracking-tight">Home</p>
              <p className="text-sm text-gray-600">Welcome back</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 h-[85%] rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-lg text-white">📚</span>
            </div>
            <p className="font-bold text-gray-800">Your Library</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate("/favorites")}
              className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border border-gray-200 hover:border-blue-300 hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all">
                <span className="text-lg">❤️</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Favorites</span>
                <p className="text-xs text-gray-600">Your liked songs</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/playlists")}
              className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border border-gray-200 hover:border-blue-300 hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all">
                <span className="text-lg">🎵</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Playlists</span>
                <p className="text-xs text-gray-600">Your collections</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/discover")}
              className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border border-gray-200 hover:border-blue-300 hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all">
                <span className="text-lg">🌍</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Discover</span>
                <p className="text-xs text-gray-600">Find new music</p>
              </div>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Now Playing</p>
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-white text-lg">♪</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden w-full px-4 py-3 flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 sticky top-0 z-10 shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 text-sm font-medium hover:bg-white/30 transition-all"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 text-sm font-medium hover:bg-white/30 transition-all"
        >
          <span className="text-lg">❤️</span>
          <span className="text-xs">Favorites</span>
        </button>
        <button
          onClick={() => navigate("/playlists")}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 text-sm font-medium hover:bg-white/30 transition-all"
        >
          <span className="text-lg">🎵</span>
          <span className="text-xs">Playlists</span>
        </button>
        <button
          onClick={() => navigate("/discover")}
          className="flex-1 flex flex-col items-center justify-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 text-sm font-medium hover:bg-white/30 transition-all"
        >
          <span className="text-lg">🌍</span>
          <span className="text-xs">Discover</span>
        </button>
      </div>
    </>
  );
}