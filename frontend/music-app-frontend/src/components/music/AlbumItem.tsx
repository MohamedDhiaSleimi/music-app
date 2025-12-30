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
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img className="rounded" src={image} alt={name} />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
}