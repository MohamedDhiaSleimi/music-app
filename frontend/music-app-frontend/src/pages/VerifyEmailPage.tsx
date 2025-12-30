import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const verifyMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login?success=Email verified! You can now sign in.');
      }, 3000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Verification failed');
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    } else {
      setError('Invalid verification link');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
            <span className="text-3xl">🎵</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Email Verification</h1>
        </div>

        {verifyMutation.isPending && (
          <div className="bg-neutral-900 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Verifying your email...</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2 text-center">Email Verified!</h2>
            <p className="text-green-300 text-center mb-4">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2 text-center">Verification Failed</h2>
            <p className="text-red-300 text-center mb-6">{error}</p>
            <div className="text-center">
              <Link
                to="/resend-verification"
                className="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-full transition transform hover:scale-105"
              >
                Request new verification link
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}