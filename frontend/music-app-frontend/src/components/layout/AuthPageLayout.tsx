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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-teal-200/60 blur-3xl" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.08),_transparent_45%)]" />

      <div className="relative z-10 w-full max-w-md">
        {showLogo && (
          <div className="text-center mb-10">
            <Link to="/" className="inline-block hover:scale-105 transition-transform">
              <AppLogo size="lg" />
            </Link>
          </div>
        )}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-slate-200 shadow-2xl">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2 leading-tight">{title}</h1>
          {subtitle && <p className="text-slate-600 text-center mb-8">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthPageLayout;
