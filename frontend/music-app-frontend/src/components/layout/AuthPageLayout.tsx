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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-10">
            <Link to="/" className="inline-block">
              <AppLogo size="lg" />
            </Link>
          </div>
        )}
        <div className="bg-[#181818] rounded-lg p-8 border border-neutral-800">
          <h1 className="text-3xl font-bold text-white text-center mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400 text-center mb-8">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthPageLayout;