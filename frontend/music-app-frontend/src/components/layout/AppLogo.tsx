import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  linkTo?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showText = false, linkTo = '/' }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 'text-xl' },
    lg: { container: 'w-16 h-16', icon: 'text-2xl' },
  };

  const logo = (
    <div className="flex items-center space-x-3">
      <div
        className={`${sizes[size].container} bg-gradient-to-br from-teal-600 to-amber-400 rounded-full flex items-center justify-center shadow-lg`}
      >
        <FontAwesomeIcon icon={faMusic} className={`${sizes[size].icon} text-white`} />
      </div>
      {showText && <h1 className="text-2xl font-bold text-slate-900">Music App</h1>}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{logo}</Link>;
  }

  return logo;
};

export default AppLogo;
