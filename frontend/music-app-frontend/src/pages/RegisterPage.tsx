import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validate } from '../utils/validation';
import { UI_MESSAGES } from '../constants/ui.constants';
import type { RegisterRequest } from '../types/auth.types';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import GoogleOAuthButton from '../components/ui/GoogleOAuthButton';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data);
      setTimeout(() => {
        navigate('/?verification=pending');
      }, 5000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.REGISTRATION_FAILED);
    },
  });

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<RegisterRequest>({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof RegisterRequest, string>> = {};
      
      const emailError = validate.email(values.email);
      if (emailError) errors.email = emailError;
      
      const usernameError = validate.username(values.username);
      if (usernameError) errors.username = usernameError;
      
      const passwordError = validate.password(values.password);
      if (passwordError) errors.password = passwordError;
      
      return errors;
    },
    onSubmit: (data) => {
      setError('');
      registerMutation.mutate(data);
    },
  });

  return (
    <AuthPageLayout
      title={UI_MESSAGES.TITLES.SIGN_UP_FREE}
      subtitle={UI_MESSAGES.DESCRIPTIONS.SIGN_UP_SUBTITLE}
      logoLink="/register"
    >
      <GoogleOAuthButton text={`${UI_MESSAGES.BUTTONS.SIGN_UP} with Google`} className="mb-6" />

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-neutral-800"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-neutral-800"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.EMAIL}
          error={errors.email}
          required
        />

        <Input
          name="username"
          value={values.username}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.USERNAME}
          error={errors.username}
          required
          minLength={3}
          maxLength={20}
        />

        <PasswordInput
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.PASSWORD_MIN_6}
          error={errors.password}
          required
          minLength={6}
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          {UI_MESSAGES.BUTTONS.SIGN_UP}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
            {UI_MESSAGES.BUTTONS.SIGN_IN}
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}