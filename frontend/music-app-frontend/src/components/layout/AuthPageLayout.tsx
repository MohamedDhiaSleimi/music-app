import React from 'react';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showLogo?: boolean;
  logoLink?: string;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  subtitle,
  children,
  showLogo = true,
  logoLink = '/login',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-8">
            <Link to={logoLink} className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50">
                <span className="text-3xl">🎵</span>
              </div>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthPageLayout;