import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Layers, Sliders, Zap, ShieldCheck, Cpu } from 'lucide-react';

export const ProductOverview: React.FC = () => {
  const { language } = useApp();
  const isRtl = language === 'ar';

  const highlights = [
    {
      icon: <Zap className="w-5 h-5 text-[#FDE047]" />,
      titleAr: 'سرعة وإنتاجية مضاعفة',
      titleEn: 'Accelerated Workflow',
      descAr: 'توفير الوقت المهدور في البحث عن المقاسات، تحويل الأكواد، وتجربة الخطوط في مكان واحد.',
      descEn: 'Eliminate friction in finding safe dimensions, converting color values, and testing font pairs.'
    },
    {
      icon: <Layers className="w-5 h-5 text-[#EC4899]" />,
      titleAr: 'مصمم خصيصاً للمصممين',
      titleEn: 'Built for Graphic Designers',
      descAr: 'أدوات عملية ومصممة بدقة لترافق برامجك المفضلة كـ Photoshop و Illustrator و Figma.',
      descEn: 'Tactical, high-utility tools built to seamlessly accompany Photoshop, Figma, and Illustrator.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#A78BFA]" />,
      titleAr: 'قرارات تصميمية مدروسة',
      titleEn: 'Precise Design Decisions',
      descAr: 'تناغم ألوان علمي، مناطق أمان مضمونة للطباعة والسوشيال، واقتراحات تايبوغرافي متوازنة.',
      descEn: 'Strict geometric safe areas, mathematical color harmonies, and balanced typographic pairings.'
    },
  ];

  return (
    <section 
      id="moonberry-overview-section"
      className="py-16 md:py-24 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0f0714] dark:bg-[#0f0714] light:bg-[#FAFAFC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-xs font-bold text-[#f43f5e] mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>{isRtl ? 'فلسفة مونبيري' : 'The Moonberry Philosophy'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-5 text-white dark:text-white light:text-slate-900">
            {isRtl
              ? 'كل ما تحتاجه لاتخاذ قرارات تصميم أفضل، في مساحة عمل واحدة'
              : 'Everything you need to make better design decisions, in one workspace'}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
            {isRtl
              ? 'لا نحاول استبدال المصمم أو توليد تصاميم عشوائية. هدفنا هو تمكينك من اتخاذ قرارات بصرية دقيقة وسريعة عبر مرافق احترافية مبنية خصيصاً لاحتياجاتك اليومية.'
              : 'Moonberry is not an AI that replaces your craft. It is a precision toolbox that removes friction and gives you the exact parameters, harmonies, and safe zones you need.'}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-[28px] border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white shadow-xl hover:border-[#f43f5e]/50 hover:bg-slate-900/60 transition-all duration-200"
              id={`overview-highlight-card-${idx}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 flex items-center justify-center mb-6 border border-white/10 dark:border-white/10 light:border-slate-200">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-3">
                {isRtl ? item.titleAr : item.titleEn}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                {isRtl ? item.descAr : item.descEn}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
