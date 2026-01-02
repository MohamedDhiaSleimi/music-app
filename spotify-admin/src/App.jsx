import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSong from './pages/AddSong';
import AddAlbum from './pages/AddAlbum';
import ListSong from './pages/ListSong';
import ListAlbum from './pages/ListAlbum';
import ManagePlaylists from './pages/ManagePlaylists';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import { useAuth } from './context/AuthContext';

export const url = "http://localhost:3000";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/add-album" element={<AddAlbum />} />
            <Route path="/list-song" element={<ListSong />} />
            <Route path="/list-album" element={<ListAlbum />} />
            <Route path="/playlists" element={<ManagePlaylists />} />
            <Route path="/" element={<Navigate to="/add-song" replace />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/add-song" replace />
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          }
        />
      </Routes>
    </>
  )
}

export default App
