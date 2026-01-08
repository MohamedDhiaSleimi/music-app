import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:8080/api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${AUTH_API_BASE_URL}/admin/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.log("error", error);
      toast.error("User list error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mr-5">
        <p>All Users</p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-white border border-black text-sm font-medium drop-shadow-[-4px_4px_#00ff5b]"
        >
          Refresh
        </button>
      </div>
      <hr />
      {isLoading ? (
        <p className="mt-4 text-sm">Loading users...</p>
      ) : (
        <div>
          <div className="sm:grid hidden grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
            <b>Email</b>
            <b>Username</b>
            <b>Status</b>
            <b>Provider</b>
            <b>Created</b>
            <b>Last Login</b>
            <b>Id</b>
          </div>
          {users.length === 0 ? (
            <p className="mt-4 text-sm">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                className="grid grid-cols-[1fr] sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
              >
                <p className="break-all">{user.email || "-"}</p>
                <p>{user.username || "-"}</p>
                <p>{user.status || "-"}</p>
                <p>{user.provider || "local"}</p>
                <p>{formatDate(user.createdAt)}</p>
                <p>{formatDate(user.lastLogin)}</p>
                <p className="text-xs break-all">{user.userId}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ListUsers;
