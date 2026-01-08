import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";
import { useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import MusicBrowsePage from "./MusicBrowsePage";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const showVerificationPending =
    searchParams.get("verification") === "pending";

  const [showSettings, setShowSettings] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/80 border-b border-slate-200 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-amber-400 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faMusic} className="text-white text-sm" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Music App</h1>
              <Link
                to="/browse"
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition flex items-center space-x-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Browse music</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/80 border border-slate-200 px-4 py-2 rounded-full">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.username?.[0].toUpperCase()}
                  </div>
                )}
                <span className="text-slate-700 font-medium">{user?.username}</span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-500 hover:text-slate-700 transition rounded-full hover:bg-slate-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Sidebar */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-50"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white/95 border-l border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <Link
                  to="/profile-settings"
                  onClick={() => setShowSettings(false)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl transition flex items-center space-x-3"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Profile Settings</span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition flex items-center space-x-3"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Log out</span>
                </button>

                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowDeactivateModal(true);
                  }}
                  className="w-full px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl transition flex items-center space-x-3 border border-rose-100"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Deactivate account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-rose-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Deactivate Account?
              </h2>
              <p className="text-slate-600">
                Your account will be scheduled for permanent deactivation in 7
                days. You can cancel this by logging in within that period.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 app-button app-button-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={deactivateMutation.isPending}
                className="flex-1 app-button bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deactivateMutation.isPending ? "Processing..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Email Verification Banner */}
        {showVerificationBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-700">
                  Verify your email
                </h3>
                <p className="mt-2 text-sm text-amber-700">
                  Please check your inbox and verify your email address to
                  access all features.
                </p>
                <div className="mt-3">
                  <Link
                    to="/resend-verification"
                    className="text-sm text-amber-700 hover:text-amber-600 underline"
                  >
                    Resend verification email
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationBanner(false)}
                className="ml-3 text-amber-700 hover:text-amber-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl mb-6">
            {success}
          </div>
        )}

        <div className="bg-white/80 rounded-2xl p-8 mb-8 border border-slate-200 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Welcome back, {user?.username}!
            <FontAwesomeIcon
              icon={faMusic}
              className="ml-2 text-slate-700 text-base align-text-bottom"
              aria-hidden="true"
            />
          </h2>
          <p className="text-slate-600 text-lg">
            You're successfully authenticated and ready to explore.
          </p>
        </div>

        <div className="bg-white/80 rounded-2xl p-8 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Your Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.username?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-slate-500">Username</p>
                <p className="text-slate-900 font-medium">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-slate-900 font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">User ID</p>
                <p className="text-slate-900 font-medium font-mono text-sm">
                  {user?.userId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
