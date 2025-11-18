import React from 'react';

interface AvatarProps {
  imageUrl?: string;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, username, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${username}'s avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold ${className}`}
    >
      {username?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

export default Avatar;