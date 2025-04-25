
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-saffron to-saffron-dark relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9')] bg-cover bg-center opacity-10" />
      <div className="relative flex flex-col items-center justify-center h-full">
        <span className="text-sm leading-none font-bold text-white drop-shadow-lg">गुरुकुल</span>
        <div className="w-6 h-0.5 bg-white/50 my-1" />
        <span className="text-xs leading-none text-white/90 drop-shadow-lg">ज्ञान</span>
      </div>
    </div>
  );
};

export default Logo;
