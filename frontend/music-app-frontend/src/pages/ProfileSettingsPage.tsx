import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: profile, isLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    retry: 1,
  });

  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username);
      setPhotoUrl(profile.profileImageUrl || '');
    }
  }, [profile]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const updateUsernameMutation = useMutation({
    mutationFn: profileApi.updateUsername,
    onSuccess: () => {
      setSuccess('Username updated successfully');
      setEditingUsername(false);
      setError('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Also update auth context if needed
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update username');
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: profileApi.updateProfilePhoto,
    onSuccess: () => {
      setSuccess('Profile photo updated successfully');
      setEditingPhoto(false);
      setError('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update profile photo');
    },
  });

  const removePhotoMutation = useMutation({
    mutationFn: profileApi.removeProfilePhoto,
    onSuccess: () => {
      setSuccess('Profile photo removed');
      setPhotoUrl('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to remove profile photo');
    },
  });

  const requestVerificationMutation = useMutation({
    mutationFn: profileApi.requestVerification,
    onSuccess: () => {
      setSuccess('Verification email sent! Check your inbox.');
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to send verification email');
    },
  });

  const handleUpdateUsername = () => {
    if (newUsername.trim().length < 3 || newUsername.trim().length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }
    setError('');
    setSuccess('');
    updateUsernameMutation.mutate(newUsername.trim());
  };

  const handleUpdatePhoto = () => {
    if (!photoUrl.trim()) {
      setError('Please enter a valid photo URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(photoUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    
    setError('');
    setSuccess('');
    updatePhotoMutation.mutate(photoUrl.trim());
  };

  const handleRemovePhoto = () => {
    setError('');
    setSuccess('');
    removePhotoMutation.mutate();
  };

  const handleRequestVerification = () => {
    setError('');
    setSuccess('');
    requestVerificationMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
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
          <h2 className="text-2xl font-bold text-white mb-2">Failed to load profile</h2>
          <p className="text-gray-400 mb-6">Please try again later</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded-lg transition font-medium"
          >
            Go to Home
          </button>
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🎵</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Email Verification Status */}
        {!profile?.emailVerified && profile?.provider === 'local' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-400">Email not verified</h3>
                  <p className="mt-2 text-sm text-yellow-300">
                    Verify your email to unlock all features and increase account security.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRequestVerification}
                disabled={requestVerificationMutation.isPending}
                className="ml-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition text-sm font-medium disabled:opacity-50 whitespace-nowrap"
              >
                {requestVerificationMutation.isPending ? 'Sending...' : 'Verify now'}
              </button>
            </div>
          </div>
        )}

        {/* Profile Photo Section */}
        <div className="bg-neutral-900 rounded-2xl p-6 mb-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-4">Profile Photo</h2>
          
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {profile?.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {!editingPhoto ? (
              <div className="flex-1">
                <button
                  onClick={() => setEditingPhoto(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-lg transition font-medium mr-2"
                >
                  Change photo
                </button>
                {profile?.profileImageUrl && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={removePhotoMutation.isPending}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition font-medium disabled:opacity-50"
                  >
                    {removePhotoMutation.isPending ? 'Removing...' : 'Remove'}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 space-y-3">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/photo.jpg)"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdatePhoto}
                    disabled={updatePhotoMutation.isPending}
                    className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-lg transition font-medium disabled:opacity-50"
                  >
                    {updatePhotoMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingPhoto(false);
                      setPhotoUrl(profile?.profileImageUrl || '');
                    }}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Enter a direct link to an image (must be publicly accessible)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Username Section */}
        <div className="bg-neutral-900 rounded-2xl p-6 mb-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-4">Username</h2>
          
          {!editingUsername ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-lg font-medium">{profile?.username}</p>
                <p className="text-gray-400 text-sm mt-1">This is how others will see you</p>
              </div>
              <button
                onClick={() => setEditingUsername(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-lg transition font-medium"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateUsername}
                  disabled={updateUsernameMutation.isPending}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-lg transition font-medium disabled:opacity-50"
                >
                  {updateUsernameMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(profile?.username || '');
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Username must be between 3 and 20 characters
              </p>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{profile?.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Account Type</p>
              <p className="text-white font-medium capitalize">
                {profile?.provider === 'local' ? 'Email & Password' : `${profile?.provider} OAuth`}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Email Verified</p>
              <div className="flex items-center space-x-2">
                {profile?.emailVerified ? (
                  <>
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-400 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-400 font-medium">Not verified</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white font-medium">
                {new Date(profile?.createdAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {profile?.lastLogin && (
              <div>
                <p className="text-sm text-gray-400">Last Login</p>
                <p className="text-white font-medium">
                  {new Date(profile.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
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