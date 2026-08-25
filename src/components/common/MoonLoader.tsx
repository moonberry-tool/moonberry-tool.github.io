import React from 'react';

export const MoonLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24" id="moon-loader-root">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div
          className="absolute -inset-3 rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.45), transparent 70%)',
            animation: 'mb-pulse 1.8s ease-in-out infinite',
          }}
        />
        <div
          className="relative w-11 h-11 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, #FEF08A 0%, #FDBA74 25%, #F472B6 55%, #8B5CF6 85%, #6366F1 100%)',
            boxShadow: '-12px 0 0 -2px #0f0714 inset',
            animation: 'mb-spin 2.4s linear infinite',
          }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c026d3] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      <style>{`
        @keyframes mb-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes mb-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
