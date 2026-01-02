import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../App";

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState("");

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/playlist/all`);
      if (response.data.success) {
        setPlaylists(response.data.playlists);
      }
    } catch (error) {
      console.error("Failed to load playlists", error);
      toast.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const toggleVisibility = async (playlist) => {
    setWorkingId(playlist._id);
    try {
      const nextValue = !playlist.isPublic;
      const response = await axios.patch(
        `${url}/api/playlist/${playlist._id}/visibility`,
        { isPublic: nextValue, userId: playlist.ownerId }
      );
      if (response.data.success) {
        toast.success(
          `Playlist is now ${nextValue ? "public" : "private"}`
        );
        await fetchPlaylists();
      }
    } catch (error) {
      console.error("Failed to update playlist visibility", error);
      toast.error("Visibility update failed");
    } finally {
      setWorkingId("");
    }
  };

  const deletePlaylist = async (playlist) => {
    setWorkingId(playlist._id);
    try {
      const response = await axios.delete(`${url}/api/playlist/${playlist._id}`, {
        data: { userId: playlist.ownerId },
      });
      if (response.data.success) {
        toast.success("Playlist deleted");
        await fetchPlaylists();
      }
    } catch (error) {
      console.error("Failed to delete playlist", error);
      toast.error("Delete failed");
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="pr-5">
      <h1 className="text-xl font-semibold mb-2">All User Playlists</h1>
      <p className="text-gray-500 mb-4">
        Manage public visibility and remove playlists created by users.
      </p>

      {loading ? (
        <div className="grid place-items-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-800 rounded-full animate-spin" />
        </div>
      ) : playlists.length === 0 ? (
        <p className="text-gray-600">No playlists found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Owner</th>
                <th className="py-3 px-4 border-b">Visibility</th>
                <th className="py-3 px-4 border-b">Songs</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {playlists.map((playlist) => (
                <tr key={playlist._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <div className="flex flex-col">
                      <span className="font-semibold">{playlist.name}</span>
                      <span className="text-gray-500">
                        {playlist.description || "No description"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {playlist.ownerId}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        playlist.isPublic
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {playlist.isPublic ? "Public" : "Private"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {playlist.songs?.length || 0}
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button
                      onClick={() => toggleVisibility(playlist)}
                      disabled={workingId === playlist._id}
                      className="px-3 py-1 rounded bg-gray-900 text-white text-xs disabled:opacity-60"
                    >
                      {workingId === playlist._id
                        ? "Working..."
                        : playlist.isPublic
                        ? "Make Private"
                        : "Make Public"}
                    </button>
                    <button
                      onClick={() => deletePlaylist(playlist)}
                      disabled={workingId === playlist._id}
                      className="px-3 py-1 rounded bg-red-600 text-white text-xs disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManagePlaylists;
