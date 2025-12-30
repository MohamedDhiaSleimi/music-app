import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  
  return (
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
      </div>
    </div>
  );
}
