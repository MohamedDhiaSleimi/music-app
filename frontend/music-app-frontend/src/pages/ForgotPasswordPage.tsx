import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api';
import { useForm } from '../hooks/useForm';
import { validate } from '../utils/validation';
import { UI_MESSAGES } from '../constants/ui.constants';
import AuthPageLayout from '../components/layout/AuthPageLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import NotificationBanner from '../components/ui/NotificationBanner';

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email), 
    onSuccess: () => {
      setSuccess(true);
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.RESET_EMAIL_FAILED);
      setSuccess(false);
    },
  });

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<{ email: string }>({
    initialValues: { email: '' },
    validate: (values) => {
      const emailError = validate.email(values.email);
      return emailError ? { email: emailError } : {};
    },
    onSubmit: (data) => {
      setError('');
      setSuccess(false);
      forgotPasswordMutation.mutate(data.email); // ✓ Now passes correctly to wrapper
    },
  });

  return (
    <AuthPageLayout
      title={UI_MESSAGES.TITLES.RESET_PASSWORD}
      subtitle={UI_MESSAGES.DESCRIPTIONS.RESET_SUBTITLE}
    >
      {success ? (
        <NotificationBanner
          type="success"
          title={UI_MESSAGES.SUCCESS.EMAIL_SENT}
          message={UI_MESSAGES.NOTIFICATIONS.PASSWORD_RESET_1H}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <NotificationBanner type="error" message={error} />}

          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder={UI_MESSAGES.PLACEHOLDERS.EMAIL}
            error={errors.email}
            required
          />

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            {UI_MESSAGES.BUTTONS.SEND_RESET_LINK}
          </Button>
      </form>
      )}

      <div className="mt-8 text-center">
        <Link to="/login" className="text-slate-500 hover:text-teal-700 text-sm transition">
          {UI_MESSAGES.BUTTONS.BACK_TO_LOGIN}
        </Link>
      </div>
    </AuthPageLayout>
  );
}
