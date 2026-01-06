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
  const [backendErrors, setBackendErrors] = useState<string[]>([]);
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
      const message = error.response?.data?.message;

      if (message) {
        const errorsArray = message.split(';').map((err: string) => err.trim());
        setBackendErrors(errorsArray);
      } else {
        setBackendErrors([UI_MESSAGES.ERRORS.REGISTRATION_FAILED]);
      }
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
      setBackendErrors([]);
      registerMutation.mutate(data);
    },
  });

  return (
    <AuthPageLayout
      title={UI_MESSAGES.TITLES.SIGN_UP_FREE}
      subtitle={UI_MESSAGES.DESCRIPTIONS.SIGN_UP_SUBTITLE}
      showLogo={true}
    >
      {/* Welcome Message */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <span className="text-2xl text-white">🎵</span>
        </div>
        <p className="text-gray-600 text-sm">
          Join thousands of music lovers and start your personalized journey
        </p>
      </div>

      {/* Social Sign Up */}
      <div className="space-y-4 mb-6">
        <GoogleOAuthButton 
          text={`${UI_MESSAGES.BUTTONS.SIGN_UP} with Google`} 
          className="w-full"
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with email</span>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Backend validation errors */}
        {backendErrors.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700 space-y-1">
                  {backendErrors.map((err, index) => (
                    <div key={index}>{err}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={UI_MESSAGES.PLACEHOLDERS.EMAIL}
              error={errors.email}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <Input
              name="username"
              value={values.username}
              onChange={handleChange}
              placeholder={UI_MESSAGES.PLACEHOLDERS.USERNAME}
              error={errors.username}
              className="pl-10"
              required
              minLength={3}
              maxLength={20}
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
              placeholder={UI_MESSAGES.PLACEHOLDERS.PASSWORD_MIN_6}
              error={errors.password}
              className="pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isSubmitting || registerMutation.isPending}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {UI_MESSAGES.BUTTONS.SIGN_UP}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:underline"
          >
            {UI_MESSAGES.BUTTONS.SIGN_IN}
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}