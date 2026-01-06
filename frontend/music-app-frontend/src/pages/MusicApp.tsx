// MusicApp.tsx - Version moderne avec design coloré
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";
import { useSearchParams, Link } from "react-router-dom";
import Display from "../components/music/Display";
import Player from "../components/music/Player";
import Sidebar from "../components/music/Sidebar";
import { useMusic } from "../context/MusicContext";

export default function MusicApp() {
  const { user, logout } = useAuth();
  const { audioRef, track } = useMusic();
  const [searchParams] = useSearchParams();
  const showVerificationPending = searchParams.get("verification") === "pending";

  const [showSettings, setShowSettings] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  useEffect(() => {
    if (showVerificationPending) {
      setShowVerificationBanner(true);
    }
  }, [showVerificationPending]);

  const deactivateMutation = useMutation({
    mutationFn: authApi.deactivateAccount,
    onSuccess: (data) => {
      setSuccess(data.message);
      setShowDeactivateModal(false);
      setTimeout(() => {
        logout();
      }, 3000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to deactivate account");
    },
  });

  const handleDeactivate = () => {
    setError("");
    setSuccess("");
    deactivateMutation.mutate();
  };

  // Données de démonstration
  const recentActivity = [
    { id: 1, type: "playlist", title: "Morning Vibes", action: "Created", time: "2 hours ago", icon: "🎵", color: "bg-gradient-to-br from-blue-500 to-cyan-400" },
    { id: 2, type: "like", title: "Blinding Lights", action: "Liked", time: "Yesterday", icon: "❤️", color: "bg-gradient-to-br from-pink-500 to-rose-400" },
    { id: 3, type: "share", title: "Summer Hits 2024", action: "Shared", time: "2 days ago", icon: "📤", color: "bg-gradient-to-br from-green-500 to-emerald-400" },
    { id: 4, type: "follow", title: "Artist: The Weeknd", action: "Followed", time: "1 week ago", icon: "👤", color: "bg-gradient-to-br from-purple-500 to-violet-400" },
  ];

  const recommendedPlaylists = [
    { id: 1, title: "Focus Flow", description: "Concentration boosting tracks", count: 24, color: "from-blue-400 to-cyan-300" },
    { id: 2, title: "Chill Vibes", description: "Relax and unwind", count: 18, color: "from-purple-400 to-pink-300" },
    { id: 3, title: "Workout Energy", description: "High intensity beats", count: 32, color: "from-orange-400 to-red-300" },
    { id: 4, title: "Indie Discoveries", description: "Fresh independent artists", count: 28, color: "from-green-400 to-emerald-300" },
  ];

  const topArtists = [
    { id: 1, name: "The Weeknd", genre: "R&B/Pop", listeners: "83M", icon: "👑", bgColor: "bg-gradient-to-br from-red-100 to-pink-100" },
    { id: 2, name: "Taylor Swift", genre: "Pop", listeners: "76M", icon: "🎤", bgColor: "bg-gradient-to-br from-purple-100 to-blue-100" },
    { id: 3, name: "Drake", genre: "Hip Hop", listeners: "68M", icon: "🔥", bgColor: "bg-gradient-to-br from-green-100 to-teal-100" },
    { id: 4, name: "Bad Bunny", genre: "Reggaeton", listeners: "72M", icon: "🐰", bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100" },
  ];

  const stats = [
    { label: "Listening Time", value: "142 hrs", change: "+12%", icon: "⏱️", color: "text-blue-600" },
    { label: "Playlists", value: "24", change: "+3", icon: "📁", color: "text-purple-600" },
    { label: "Liked Songs", value: "312", change: "+28", icon: "❤️", color: "text-pink-600" },
    { label: "Following", value: "48", change: "+5", icon: "👥", color: "text-green-600" },
  ];

  // Navigation entre la page d'accueil et le lecteur
  const NavigationBar = () => (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl text-white">♪</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Music App
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMusicPlayer(false)}
              className={`px-4 py-2 rounded-lg transition-all ${!showMusicPlayer ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🏠 Accueil
            </button>
            <button
              onClick={() => setShowMusicPlayer(true)}
              className={`px-4 py-2 rounded-lg transition-all ${showMusicPlayer ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🎵 Lecteur
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-blue-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.username?.[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-sm font-medium">{user?.username}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Page d'accueil moderne
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <NavigationBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 shadow-xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, <span className="text-yellow-300">{user?.username}</span>! 🎉
                  </h1>
                  <p className="text-white/90 mb-6">Your personalized music journey continues. Discover something new today.</p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowMusicPlayer(true)}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium text-lg transition-all hover:bg-blue-50 hover:shadow-lg flex items-center space-x-2"
                    >
                      <span>🎵 Start Listening</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium text-lg transition-all hover:bg-white/30">
                      ✨ Create Playlist
                    </button>
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-pulse">
                    <span className="text-5xl">🎧</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <span className="text-green-600 font-medium text-sm">↑ {stat.change}</span>
                  </div>
                </div>
                <div className={`text-3xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Playlists */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${playlist.color} rounded-2xl mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl text-white">♪</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {playlist.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{playlist.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{playlist.count} tracks</span>
                      <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Top Artists This Week</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">See All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topArtists.map((artist) => (
                  <div key={artist.id} className="text-center group cursor-pointer">
                    <div className={`w-24 h-24 ${artist.bgColor} rounded-2xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg`}>
                      <span className="text-4xl">{artist.icon}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">{artist.name}</h4>
                    <p className="text-sm text-gray-600">{artist.genre}</p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">{artist.listeners} listeners</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Activity */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-2xl ring-4 ring-blue-500/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl ring-4 ring-blue-500/20 shadow-lg">
                      {user?.username?.[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{user?.username}</h3>
                  <p className="text-blue-600 font-medium">🎵 Premium Member</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Link
                    to="/profile-settings"
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all hover:from-blue-600 hover:to-purple-600 text-center hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium">Edit Profile</span>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-4 bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl transition-all text-center hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm font-medium">Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">See All</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.title}</p>
                        <p className="text-sm text-gray-600">
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-lg text-white">♪</span>
              </div>
              <span className="font-bold text-lg text-gray-800">Music App</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 Melodia Music App. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // Lecteur de musique
  const MusicPlayer = () => (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <NavigationBar />
      <div className="h-[calc(100vh-64px)]">
        <div className="h-full flex flex-col lg:flex-row">
          <Sidebar />
          <Display />
        </div>
        <Player />
      </div>
      <audio ref={audioRef} src={track?.file || ""} preload="auto"></audio>
    </div>
  );

  // Afficher soit la page d'accueil, soit le lecteur
  return showMusicPlayer ? <MusicPlayer /> : <HomePage />;
}