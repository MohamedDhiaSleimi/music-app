import React from 'react';

interface NotificationBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  title,
  message,
  onDismiss,
  action,
}) => {
  const colors = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
    },
  };

  const icons = {
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  const style = colors[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-6`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className={`w-6 h-6 ${style.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[type]}
          </svg>
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${style.text}`}>{title}</h3>}
          <p className={`${title ? 'mt-2' : ''} text-sm ${style.text}`}>{message}</p>
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`text-sm ${style.text} hover:opacity-80 underline font-medium`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className={`ml-3 ${style.text} hover:opacity-80`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;