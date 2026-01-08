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
          <div>
            <p>{errorMessage}</p>
            <Link to="/resend-verification" className="block mt-2 text-green-400 hover:text-green-300 underline">
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
    <AuthPageLayout title={UI_MESSAGES.TITLES.WELCOME_BACK} subtitle={UI_MESSAGES.DESCRIPTIONS.SIGN_IN_SUBTITLE}>
      {urlSuccess && <NotificationBanner type="success" message={urlSuccess}  />}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          name="emailOrUsername"
          value={values.emailOrUsername}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.EMAIL_OR_USERNAME}
          required
        />

        <PasswordInput
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.PASSWORD}
          required
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-green-400 transition">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          {UI_MESSAGES.BUTTONS.SIGN_IN}
        </Button>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-neutral-800"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-neutral-800"></div>
      </div>

      <GoogleOAuthButton />

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-400 hover:text-green-300 font-semibold transition">
            {UI_MESSAGES.BUTTONS.SIGN_UP}
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}