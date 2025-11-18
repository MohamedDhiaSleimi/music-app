import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { useForm } from '../hooks/useForm';
import { validate } from '../utils/validation';
import { UI_MESSAGES } from '../constants/ui.constants';
import type { ResetPasswordRequest } from '../types/auth.types';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import NotificationBanner from '../components/ui/NotificationBanner';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      navigate('/login?success=' + encodeURIComponent(UI_MESSAGES.SUCCESS.PASSWORD_RESET));
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.PASSWORD_RESET_FAILED);
    },
  });

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors: any = {};

      const passwordError = validate.password(values.newPassword);
      if (passwordError) errors.newPassword = passwordError;

      const matchError = validate.passwordMatch(values.newPassword, values.confirmPassword);
      if (matchError) errors.confirmPassword = matchError;

      return errors;
    },
    onSubmit: (data) => {
      if (!token) {
        setError(UI_MESSAGES.ERRORS.INVALID_RESET_TOKEN);
        return;
      }
      setError('');
      const payload: ResetPasswordRequest = { token, newPassword: data.newPassword };
      resetPasswordMutation.mutate(payload);
    },
  });

  if (!token) {
    return (
      <AuthPageLayout title={UI_MESSAGES.TITLES.INVALID_LINK} subtitle="" showLogo={false}>
        <div className="text-center">
          <p className="text-gray-400 mb-8">{UI_MESSAGES.NOTIFICATIONS.INVALID_RESET_LINK}</p>
          <Link
            to="/forgot-password"
            className="inline-block bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-full transition"
          >
            {UI_MESSAGES.BUTTONS.REQUEST_NEW_LINK}
          </Link>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      title={UI_MESSAGES.TITLES.CHOOSE_NEW_PASSWORD}
      subtitle={UI_MESSAGES.DESCRIPTIONS.NEW_PASSWORD_SUBTITLE}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <NotificationBanner type="error" message={error} />}

        <PasswordInput
          name="newPassword"
          value={values.newPassword}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.NEW_PASSWORD}
          error={errors.newPassword}
          required
          minLength={6}
        />

        <PasswordInput
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder={UI_MESSAGES.PLACEHOLDERS.CONFIRM_PASSWORD}
          error={errors.confirmPassword}
          required
          minLength={6}
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          {UI_MESSAGES.BUTTONS.RESET_PASSWORD}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">
          {UI_MESSAGES.BUTTONS.BACK_TO_LOGIN}
        </Link>
      </div>
    </AuthPageLayout>
  );
}