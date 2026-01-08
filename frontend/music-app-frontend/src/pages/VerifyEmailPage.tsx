import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FontAwesomeIcon icon={faMusic} className="text-white text-xl" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Email Verification</h1>
        </div>

        {verifyMutation.isPending && (
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-8 text-center shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Verifying your email...</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-emerald-700 mb-2 text-center">Email Verified!</h2>
            <p className="text-emerald-700 text-center mb-4">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-rose-700 mb-2 text-center">Verification Failed</h2>
            <p className="text-rose-700 text-center mb-6">{error}</p>
            <div className="text-center">
              <Link
                to="/resend-verification"
                className="inline-block app-button app-button-primary"
              >
                Request new verification link
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-slate-500 hover:text-teal-700 text-sm transition">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
