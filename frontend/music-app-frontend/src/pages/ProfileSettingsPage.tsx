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

  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username);
      setPhotoUrl(profile.profileImageUrl || "");
    }
  }, [profile]);

  const updateUsernameMutation = useMutation({
    mutationFn: profileApi.updateUsername,
    onSuccess: () => {
      setSuccess(UI_MESSAGES.SUCCESS.USERNAME_UPDATED);
      setEditingUsername(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          UI_MESSAGES.ERRORS.USERNAME_UPDATE_FAILED
      );
    },
  });

  // Add after updateUsernameMutation:
  const updatePhotoMutation = useMutation({
    mutationFn: profileApi.updateProfilePhoto,
    onSuccess: () => {
      setSuccess(UI_MESSAGES.SUCCESS.PHOTO_UPDATED);
      setEditingPhoto(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || UI_MESSAGES.ERRORS.PHOTO_UPDATE_FAILED
      );
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
      setError(
        error.response?.data?.message || UI_MESSAGES.ERRORS.PHOTO_REMOVE_FAILED
      );
    },
  });

  // Add handlers:
  const handleUpdatePhoto = () => {
    if (!photoUrl.trim()) {
      setError("Please enter a photo URL");
      return;
    }
    try {
      new URL(photoUrl);
    } catch {
      setError(UI_MESSAGES.ERRORS.INVALID_PHOTO_URL);
      return;
    }
    updatePhotoMutation.mutate(photoUrl.trim());
  };

  const handleRemovePhoto = () => {
    removePhotoMutation.mutate();
  };

  const handleUpdateUsername = () => {
    if (newUsername.trim().length < 3 || newUsername.trim().length > 20) {
      setError(UI_MESSAGES.ERRORS.USERNAME_LENGTH);
      return;
    }
    updateUsernameMutation.mutate(newUsername.trim());
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
            <svg
              className="w-8 h-8 text-red-400"
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
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                label: UI_MESSAGES.BUTTONS.VERIFY_NOW,
                onClick: () => {
                  /* handle verification */
                },
              }}
            />
          </div>
        )}

        {/* Username Section */}
        <div className="bg-neutral-900 rounded-2xl p-6 mb-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-4">Username</h2>

          {!editingUsername ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-lg font-medium">
                  {profile?.username}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {UI_MESSAGES.DESCRIPTIONS.USERNAME_DISPLAY}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setEditingUsername(true)}
              >
                {UI_MESSAGES.BUTTONS.EDIT}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                minLength={3}
                maxLength={20}
                placeholder={UI_MESSAGES.PLACEHOLDERS.USERNAME}
              />
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  onClick={handleUpdateUsername}
                  isLoading={updateUsernameMutation.isPending}
                >
                  {UI_MESSAGES.BUTTONS.SAVE}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(profile?.username || "");
                  }}
                >
                  {UI_MESSAGES.BUTTONS.CANCEL}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                {UI_MESSAGES.DESCRIPTIONS.USERNAME_HINT}
              </p>
            </div>
          )}
        </div>

        {/* Remaining sections would follow similar pattern... */}
      </div>
    </div>
  );
}
