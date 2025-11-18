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

export default function ResendVerificationPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const resendMutation = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      setSuccess(true);
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || UI_MESSAGES.ERRORS.VERIFICATION_FAILED);
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
      resendMutation.mutate(data.email);
    },
  });

  return (
    <AuthPageLayout
      title={UI_MESSAGES.TITLES.RESEND_VERIFICATION}
      subtitle={UI_MESSAGES.DESCRIPTIONS.RESEND_SUBTITLE}
    >
      {success ? (
        <NotificationBanner
          type="success"
          title={UI_MESSAGES.SUCCESS.VERIFICATION_SENT}
          message={UI_MESSAGES.NOTIFICATIONS.EMAIL_VERIFIED_24H}
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
            {UI_MESSAGES.BUTTONS.RESEND_VERIFICATION}
          </Button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">
          {UI_MESSAGES.BUTTONS.BACK_TO_LOGIN}
        </Link>
      </div>
    </AuthPageLayout>
  );
}