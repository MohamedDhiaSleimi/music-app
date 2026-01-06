import React from 'react';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';

interface AuthPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showLogo?: boolean;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  subtitle,
  children,
  showLogo = true,
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-gradient-to-r from-pink-400/20 to-rose-400/20 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 h-60 w-60 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-10">
            <Link to="/" className="inline-block hover:scale-105 transition-transform">
              <AppLogo size="lg" />
            </Link>
          </div>
        )}
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-blue-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-sm">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-purple-400' : 'bg-pink-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;