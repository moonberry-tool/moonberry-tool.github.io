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
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      id={`moonberry-icon-svg-${idSuffix}`}
    >
      <defs>
        {/* Crescent Moon Gradient: Top warm gold/peach -> middle magenta -> bottom vibrant violet */}
        <linearGradient id={`moonGrad-${idSuffix}`} x1="70" y1="20" x2="160" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="25%" stopColor="#FDBA74" />
          <stop offset="55%" stopColor="#F472B6" />
          <stop offset="85%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Berry Gradient: Deep rich purple to vibrant magenta */}
        <radialGradient id={`berryGrad-${idSuffix}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="45%" stopColor="#A855F7" />
          <stop offset="85%" stopColor="#6B21A8" />
          <stop offset="100%" stopColor="#3B0764" />
        </radialGradient>

        {/* Leaf 1 Gradient */}
        <linearGradient id={`leaf1Grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Leaf 2 Gradient */}
        <linearGradient id={`leaf2Grad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="60%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>

        {/* Star Gradient */}
        <linearGradient id={`starGrad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* Soft Glow Filter */}
        <filter id={`softGlow-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Soft Ambient Light */}
      <circle cx="100" cy="100" r="70" fill="url(#berryGrad)" opacity="0.15" filter={`url(#softGlow-${idSuffix})`} />

      {/* Crescent Moon */}
      <path
        d="M102 18 C 50 26, 12 72, 14 128 C 16 172, 54 194, 106 186 C 146 180, 182 144, 188 122 C 164 150, 122 162, 86 150 C 44 136, 36 94, 52 56 C 64 28, 86 20, 102 18 Z"
        fill={monochrome ? 'currentColor' : `url(#moonGrad-${idSuffix})`}
      />

      {/* Inner Crescent Shadow / Depth Curve */}
      <path
        d="M102 18 C 88 20, 68 28, 56 56 C 42 88, 50 126, 82 146 C 70 136, 58 108, 66 76 C 74 46, 92 26, 102 18 Z"
        fill="#FFFFFF"
        opacity="0.25"
      />

      {/* Berry Leaves */}
      {/* Left Leaf */}
      <path
        d="M96 92 C 86 70, 92 56, 104 56 C 114 56, 116 72, 108 90 Z"
        fill={monochrome ? 'currentColor' : `url(#leaf1Grad-${idSuffix})`}
      />
      <ellipse cx="101" cy="68" rx="4" ry="10" transform="rotate(-15 101 68)" fill="#FFFFFF" opacity="0.3" />

      {/* Right Leaf */}
      <path
        d="M106 90 C 118 72, 134 74, 144 86 C 146 98, 132 104, 112 94 Z"
        fill={monochrome ? 'currentColor' : `url(#leaf2Grad-${idSuffix})`}
      />
      <ellipse cx="128" cy="85" rx="9" ry="3" transform="rotate(10 128 85)" fill="#FFFFFF" opacity="0.3" />

      {/* Berry Body */}
      <circle
        cx="108"
        cy="120"
        r="38"
        fill={monochrome ? 'currentColor' : `url(#berryGrad-${idSuffix})`}
      />

      {/* Berry Highlight (Gloss Shine) */}
      <ellipse
        cx="120"
        cy="106"
        rx="10"
        ry="6"
        transform="rotate(-25 120 106)"
        fill="#FFFFFF"
        opacity="0.65"
      />
      <circle cx="126" cy="116" r="3" fill="#FFFFFF" opacity="0.45" />

      {/* Stars / Sparkles */}
      {/* Top Star */}
      <path
        d="M136 28 Q136 34 142 34 Q136 34 136 40 Q136 34 130 34 Q136 34 136 28 Z"
        fill={monochrome ? 'currentColor' : `url(#starGrad-${idSuffix})`}
      />
      {/* Middle Star */}
      <path
        d="M160 52 Q160 62 170 62 Q160 62 160 72 Q160 62 150 62 Q160 62 160 52 Z"
        fill={monochrome ? 'currentColor' : `url(#starGrad-${idSuffix})`}
      />
      {/* Lower Star */}
      <path
        d="M172 90 Q172 95 177 95 Q172 95 172 100 Q172 95 167 95 Q172 95 172 90 Z"
        fill={monochrome ? 'currentColor' : '#FDBA74'}
      />
    </svg>
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
