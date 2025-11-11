import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">🎵 Music App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">
                <span className="font-semibold">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome back! 
          </h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Authentication Successful!
            </h3>
            <p className="text-green-700">
              You are now logged in and can access protected features.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">User ID:</span>
                <span className="text-gray-800">{user?.userId}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">Email:</span>
                <span className="text-gray-800">{user?.email}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">Username:</span>
                <span className="text-gray-800">{user?.username}</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}