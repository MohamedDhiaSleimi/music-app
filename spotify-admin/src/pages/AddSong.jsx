import { assets } from "../assets/admin-assets/assets"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from "../App";
import { toast } from "react-toastify";

const fakerUrl = import.meta.env.VITE_FAKER_URL || "http://localhost:4002";

function AddSong() {

    const [image, setImage] = useState(false);
    const [song, setSong] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [albumData, setAlbumData] = useState([]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('album', album);

            const response = await axios.post(`${url}/api/song/add`, formData);

            if (response.data.success) {
                toast.success("Song Added");
                setName("");
                setDesc("");
                setAlbum("none");
                setImage(false);
                setSong(false);
            } else {
                toast.error("Something went wrong.");
            }

        } catch (error) {
            console.log('error', error)
            toast.error("Song Add Error");
        }
        setLoading(false);
    }

    const loadAlbumData = async () => {
        try {

            const response = await axios.get(`${url}/api/album/list`);

            if (response.data.success) {
                setAlbumData(response.data.albums)
            }

        } catch (error) {
            console.log('error', error)
            toast.error("loadAlbumData Error");
        }
    }

    useEffect(() => {
        loadAlbumData();
    }, [])

    const runFaker = async () => {
        setSeeding(true);
        try {
            const response = await axios.post(`${fakerUrl}/api/faker/seed`, { userCount: 12 });
            if (response.data?.success) {
                toast.success(`Faker seeded: ${response.data.songsCreated || 0} songs`);
                loadAlbumData();
            } else {
                toast.error("Faker seed failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Faker seed error");
        }
        setSeeding(false);
    };

    return loading ? (
        <div className="grid place-items-center min-h-[80vh]">
            <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin">

            </div>
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={runFaker}
                    disabled={seeding}
                    className="text-base bg-gray-800 text-white py-2.5 px-6 cursor-pointer rounded"
                >
                    {seeding ? "Seeding..." : "Run Faker Seeder"}
                </button>
                <p className="text-sm text-gray-500">Generates sample users/songs/playlists from local /home/mds/Music</p>
            </div>
            <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                    <p>Upload Song</p>
                    <input onChange={(e) => setSong(e.target.files[0])} type="file" id="song" accept="audio/*" hidden />
                    <label htmlFor="song">
                        <img src={song ? assets.upload_added : assets.upload_song} className="w-24 cursor-pointer" alt="upload_song" />
                    </label>
                </div>
                <div className="flex flex-col gap-4">
                    <p>Upload Image</p>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} className="w-24 cursor-pointer" alt="upload_area" />
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Song Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" placeholder="Type Here" required />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Song Description</p>
                <input onChange={(e) => setDesc(e.target.value)} value={desc} type="text" className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" placeholder="Type Here" required />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Album</p>
                <select onChange={(e) => setAlbum(e.target.value)} defaultValue={album} className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[250px]">
                    <option value="none">None</option>
                    {albumData.map((item, index) => (
                        <option key={index} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>

            <button type="submit" className="text-base bg-black text-white py-2.5 px-14 cursor-pointer">Add</button>

        </form>
    )
}

export default AddSong
