import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoonberryLogo } from '../common/MoonberryLogo';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  const { language, openTool } = useApp();
  const isRtl = language === 'ar';

  return (
    <section 
      id="moonberry-final-cta-section"
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#090A15] via-[#0E1026] to-[#090A15] dark:from-[#090A15] dark:via-[#0E1026] dark:to-[#090A15] light:from-[#F9FAFB] light:via-[#F3E8FF]/30 light:to-[#FFFFFF] border-b border-[#1A1D3D] dark:border-[#1A1D3D] light:border-[#E5E7EB]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-[#7B2CBF]/25 via-[#EC4899]/20 to-[#38BDF8]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <MoonberryLogo size="lg" variant="icon" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white dark:text-white light:text-[#111827] tracking-tight mb-5">
          {isRtl ? 'جاهز لتصميم أسرع وأذكى مع Moonberry؟' : 'Ready to design smarter with Moonberry?'}
        </h2>

        <p className="text-base sm:text-lg text-[#94A3B8] dark:text-[#94A3B8] light:text-[#4B5563] max-w-xl mx-auto mb-10 leading-relaxed">
          {isRtl
            ? 'انضم الآن إلى مساحة العمل المتخصصة التي تمنحك الألوان، الخطوط، المقاسات، والبرومبتات بدون أي تشتيت.'
            : 'Step into the dedicated workspace built to accelerate your daily design workflow.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openTool('colors')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-[#7B2CBF] via-[#9333EA] to-[#EC4899] shadow-purple-950/60 hover:shadow-purple-700/60"
            id="cta-open-moonberry-button"
          >
            <Sparkles className="w-5 h-5 text-[#FDE047]" />
            <span>{isRtl ? 'افتح Moonberry الآن' : 'Open Moonberry'}</span>
            {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </section>
  );
};
