import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { UI_MESSAGES } from '../constants/ui.constants';
import type { LoginRequest } from '../types/auth.types';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import GoogleOAuthButton from '../components/ui/GoogleOAuthButton';
import NotificationBanner from '../components/ui/NotificationBanner';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const urlError = searchParams.get('error');
  const urlSuccess = searchParams.get('success');

  const [error, setError] = useState<string | React.ReactNode>(urlError || '');

  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data);
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || UI_MESSAGES.ERRORS.LOGIN_FAILED;

      if (errorMessage.includes('verify your email')) {
        setError(
          <div className="space-y-2">
            <p className="font-medium">{errorMessage}</p>
            <Link 
              to="/resend-verification" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {UI_MESSAGES.BUTTONS.RESEND_VERIFICATION}
            </Link>
          </div>
        );
      } else {
        setError(errorMessage);
      }
    },
  });

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<LoginRequest>({
    initialValues: {
      emailOrUsername: '',
      password: '',
    },
    onSubmit: (data) => {
      setError('');
      loginMutation.mutate(data);
    },
  });

  return (
    <AuthPageLayout 
      title={UI_MESSAGES.TITLES.WELCOME_BACK} 
      subtitle={UI_MESSAGES.DESCRIPTIONS.SIGN_IN_SUBTITLE}
    >
      {urlSuccess && (
        <div className="mb-4">
          <NotificationBanner 
            type="success" 
            message={urlSuccess}
          />
        </div>
      )}

      {/* Social Login */}
      <div className="space-y-4">
        <GoogleOAuthButton />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <Input
              name="emailOrUsername"
              value={values.emailOrUsername}
              onChange={handleChange}
              placeholder={UI_MESSAGES.PLACEHOLDERS.EMAIL_OR_USERNAME}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <PasswordInput
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder={UI_MESSAGES.PLACEHOLDERS.PASSWORD}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isSubmitting || loginMutation.isPending}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {UI_MESSAGES.BUTTONS.SIGN_IN}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:underline"
          >
            {UI_MESSAGES.BUTTONS.SIGN_UP}
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}