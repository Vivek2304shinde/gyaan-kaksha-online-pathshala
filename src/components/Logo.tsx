
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-saffron to-saffron-dark flex items-center justify-center text-white font-bold overflow-hidden`}>
      <div className="flex flex-col items-center justify-center">
        <span className="text-sm leading-none">गुरुकुल</span>
        <span className="text-xs leading-none mt-0.5">ज्ञान</span>
      </div>
    </div>
  );
};

export default Logo;
