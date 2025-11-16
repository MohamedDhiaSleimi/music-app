import { useState, useEffect } from 'react';

interface UseNotificationReturn {
  error: string;
  success: string;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  clearNotifications: () => void;
}

export const useNotification = (autoDismissMs: number = 5000): UseNotificationReturn => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [error, success, autoDismissMs]);

  const clearNotifications = () => {
    setError('');
    setSuccess('');
  };

  return {
    error,
    success,
    setError,
    setSuccess,
    clearNotifications,
  };
};