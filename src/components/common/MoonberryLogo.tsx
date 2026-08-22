import React from 'react';

interface MoonberryLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'full' | 'icon' | 'wordmark';
  showTagline?: boolean;
  monochrome?: boolean;
  className?: string;
}

export const MoonberryLogo: React.FC<MoonberryLogoProps> = ({
  size = 'md',
  variant = 'full',
  showTagline = true,
  monochrome = false,
  className = '',
}) => {
  let iconSize = 40;
  if (typeof size === 'number') {
    iconSize = size;
  } else {
    switch (size) {
      case 'sm':
        iconSize = 28;
        break;
      case 'md':
        iconSize = 38;
        break;
      case 'lg':
        iconSize = 52;
        break;
      case 'xl':
        iconSize = 84;
        break;
    }
  }

  const idSuffix = React.useId().replace(/:/g, '');

  const iconElement = (
    <img
      src="/assets/favicon-512.png"
      alt="Moonberry"
      width={iconSize}
      height={iconSize}
      style={{
        width: iconSize,
        height: iconSize,
        filter: monochrome ? 'grayscale(1) brightness(1.4)' : undefined,
      }}
      className="shrink-0 object-contain transition-transform duration-300 hover:scale-105"
      id={`moonberry-icon-img-${idSuffix}`}
    />
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} id="moonberry-logo-icon-wrap">
        {iconElement}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} id="moonberry-logo-component">
      {iconElement}
      {variant === 'full' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-english font-bold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-white via-[#E9D5FF] to-[#F472B6] bg-clip-text text-transparent dark:from-white dark:via-[#DDD6FE] dark:to-[#F472B6] light:from-[#1E1B4B] light:via-[#581C87] light:to-[#9333EA]">
              Moonberry
            </span>
          </div>
          {showTagline && (
            <span className="text-[9px] md:text-[10px] uppercase font-semibold tracking-[0.22em] text-[#A78BFA] dark:text-[#A78BFA] light:text-[#7C3AED] leading-none">
              Creative Tools for Designers
            </span>
          )}
        </div>
      )}
    </div>
  );
};
