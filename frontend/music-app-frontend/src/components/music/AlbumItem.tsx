import { useNavigate } from "react-router-dom";

interface AlbumItemProps {
  _id: string;
  image: string;
  name: string;
  desc: string;
}

export default function AlbumItem({ _id, image, name, desc }: AlbumItemProps) {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(`/album/${_id}`)}
      className="min-w-[190px] p-3 rounded-2xl cursor-pointer bg-white/80 border border-slate-200 hover:border-slate-300 hover:-translate-y-1 transition shadow-md"
    >
      <img className="rounded-xl" src={image} alt={name} />
      <p className="font-bold mt-3 mb-1 text-slate-900 truncate">{name}</p>
      <p className="text-slate-600 text-sm truncate">{desc}</p>
    </div>
  );
}
