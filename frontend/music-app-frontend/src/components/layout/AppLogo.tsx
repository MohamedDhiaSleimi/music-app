import React from 'react';
import { Link } from 'react-router-dom';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  linkTo?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showText = false, linkTo = '/' }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', emoji: 'text-xl' },
    md: { container: 'w-12 h-12', emoji: 'text-2xl' },
    lg: { container: 'w-16 h-16', emoji: 'text-3xl' },
  };

  const logo = (
    <div className="flex items-center space-x-3">
      <div
        className={`${sizes[size].container} bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50`}
      >
        <span className={sizes[size].emoji}>🎵</span>
      </div>
      {showText && <h1 className="text-2xl font-bold text-white">Music App</h1>}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{logo}</Link>;
  }

  return logo;
};

export default AppLogo;