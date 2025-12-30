import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../hooks/useNotification";
import { UI_MESSAGES, QUERY_KEYS } from "../constants/ui.constants";
import NotificationBanner from "../components/ui/NotificationBanner";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AppLogo from "../components/layout/AppLogo";

export default function ProfileSettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { error, success, setError, setSuccess } = useNotification();

  // Editing states
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const {
    data: profile,
    isLoading,
    error: profileError,
  } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: profileApi.getProfile,
    retry: 1,
  });

  // Sync form fields when profile loads
  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username || "");
      setPhotoUrl(profile.profileImageUrl || "");
    }
  }, [profile]);

  // Mutations
  const updateUsernameMutation = useMutation({
    mutationFn: profileApi.updateUsername,
    onSuccess: () => {
      setSuccess(UI_MESSAGES.SUCCESS.USERNAME_UPDATED);
      setEditingUsername(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.USERNAME_UPDATE_FAILED);
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: profileApi.updateProfilePhoto,
    onSuccess: () => {
      setSuccess(UI_MESSAGES.SUCCESS.PHOTO_UPDATED);
      setEditingPhoto(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.PHOTO_UPDATE_FAILED);
    },
  });

  const removePhotoMutation = useMutation({
    mutationFn: profileApi.removeProfilePhoto,
    onSuccess: () => {
      setSuccess(UI_MESSAGES.SUCCESS.PHOTO_REMOVED);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.PHOTO_REMOVE_FAILED);
    },
  });

  const requestVerificationMutation = useMutation({
    mutationFn: profileApi.requestVerification,
    onSuccess: () => {
      setSuccess(UI_MESSAGES.SUCCESS.VERIFICATION_SENT);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.VERIFICATION_FAILED);
    },
  });

  // Handlers
  const handleUpdateUsername = () => {
    const trimmed = newUsername.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      setError(UI_MESSAGES.ERRORS.USERNAME_LENGTH);
      return;
    }
    updateUsernameMutation.mutate(trimmed);
  };

  const handleUpdatePhoto = () => {
    const trimmed = photoUrl.trim();
    if (!trimmed) {
      setError("Please enter a photo URL");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setError(UI_MESSAGES.ERRORS.INVALID_PHOTO_URL);
      return;
    }
    updatePhotoMutation.mutate(trimmed);
  };

  const handleRemovePhoto = () => {
    removePhotoMutation.mutate();
  };

  const handleRequestVerification = () => {
    requestVerificationMutation.mutate();
  };

  const handleCancelUsername = () => {
    setNewUsername(profile?.username || "");
    setEditingUsername(false);
  };

  const handleCancelPhoto = () => {
    setPhotoUrl(profile?.profileImageUrl || "");
    setEditingPhoto(false);
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        message={UI_MESSAGES.LOADING.LOADING_PROFILE}
      />
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {UI_MESSAGES.ERRORS.PROFILE_LOAD_FAILED}
          </h2>
          <p className="text-gray-400 mb-6">Please try again later</p>
          <Button onClick={() => navigate("/")}>
            {UI_MESSAGES.BUTTONS.GO_HOME}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <AppLogo size="sm" showText />
            </Link>
            <Link to="/" className="text-gray-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Notifications */}
        {success && (
          <NotificationBanner
            type="success"
            message={success}
            onDismiss={() => setSuccess("")}
          />
        )}
        {error && (
          <NotificationBanner
            type="error"
            message={error}
            onDismiss={() => setError("")}
          />
        )}

        {/* Email Verification Banner */}
        {!profile?.emailVerified && profile?.provider === "local" && (
          <div className="mb-6">
            <NotificationBanner
              type="warning"
              title="Email not verified"
              message="Verify your email to unlock all features and increase account security."
              action={{
                label: requestVerificationMutation.isPending ? "Sending..." : UI_MESSAGES.BUTTONS.VERIFY_NOW,
                onClick: handleRequestVerification,
              }}
            />
          </div>
        )}

        {/* Profile Photo Section */}
        <div className="bg-neutral-900 rounded-2xl p-6 mb-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-6">Profile Photo</h2>

          <div className="flex items-start gap-8">
            <div className="flex-shrink-0">
              {profile?.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-neutral-800"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="flex-1">
              {!editingPhoto ? (
                <div className="flex gap-3">
                  <Button variant="primary" onClick={() => setEditingPhoto(true)}>
                    {UI_MESSAGES.BUTTONS.CHANGE_PHOTO}
                  </Button>
                  {profile?.profileImageUrl && (
                    <Button
                      variant="danger"
                      onClick={handleRemovePhoto}
                      isLoading={removePhotoMutation.isPending}
                    >
                      {UI_MESSAGES.BUTTONS.REMOVE}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    label="Image URL"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handleUpdatePhoto}
                      isLoading={updatePhotoMutation.isPending}
                    >
                      {UI_MESSAGES.BUTTONS.SAVE}
                    </Button>
                    <Button variant="secondary" onClick={handleCancelPhoto}>
                      {UI_MESSAGES.BUTTONS.CANCEL}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Enter a direct link to a publicly accessible image
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Username Section */}
        <div className="bg-neutral-900 rounded-2xl p-6 mb-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-6">Username</h2>

          {!editingUsername ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-2xl font-medium">{profile?.username}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {UI_MESSAGES.DESCRIPTIONS.USERNAME_DISPLAY}
                </p>
              </div>
              <Button variant="primary" onClick={() => setEditingUsername(true)}>
                {UI_MESSAGES.BUTTONS.EDIT}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                minLength={3}
                maxLength={20}
                placeholder={UI_MESSAGES.PLACEHOLDERS.USERNAME}
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleUpdateUsername}
                  isLoading={updateUsernameMutation.isPending}
                >
                  {UI_MESSAGES.BUTTONS.SAVE}
                </Button>
                <Button variant="secondary" onClick={handleCancelUsername}>
                  {UI_MESSAGES.BUTTONS.CANCEL}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                {UI_MESSAGES.DESCRIPTIONS.USERNAME_HINT}
              </p>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{profile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Account Type</p>
              <p className="text-white font-medium capitalize">
                {profile?.provider === "local" ? "Email & Password" : `${profile?.provider} Account`}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Email Verified</p>
              <div className="flex items-center gap-2 mt-1">
                {profile?.emailVerified ? (
                  <>
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-400 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-400 font-medium">Not verified</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white font-medium">
                {profile?.createdAt && new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {profile?.lastLogin && (
              <div>
                <p className="text-sm text-gray-400">Last Login</p>
                <p className="text-white font-medium">
                  {new Date(profile.lastLogin).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}