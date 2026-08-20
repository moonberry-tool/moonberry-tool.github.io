import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTool } from '../../types';
import { 
  Palette, 
  Type, 
  Grid3X3, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sliders, 
  Eye, 
  Lock, 
  Maximize2 
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const { language, openTool } = useApp();
  const isRtl = language === 'ar';

  const tools = [
    {
      id: 'colors' as ActiveTool,
      titleAr: 'أداة الألوان والباليتات',
      titleEn: 'Harmonic Colors & Extraction',
      badgeAr: 'توليد واستخراج',
      badgeEn: 'Palette & Extractor',
      descAr: 'توليد باليتات ألوان متناغمة بنسب علمية دقيقة، قفل الألوان المفضلة، واستخراج باليت كامل من أي صورة تقوم برفعها مع دعم نسخ HEX/RGB/HSL.',
      descEn: 'Generate harmonious color palettes with lock controls, extract exact tones from reference images, and export seamless design systems.',
      icon: <Palette className="w-6 h-6 text-[#EC4899]" />,
      accentColor: 'from-[#EC4899] to-[#7B2CBF]',
      previewType: 'colors',
    },
    {
      id: 'fonts' as ActiveTool,
      titleAr: 'أداة تناغم الخطوط (Fonts)',
      titleEn: 'Typography Pairing Engine',
      badgeAr: 'عربي + إنجليزي',
      badgeEn: 'Arabic + Latin',
      descAr: 'نظام تايبوغرافي رباعي المستويات (العرض، العناوين، النصوص، والملاحظات) مع اقتراحات ذكية لتوافق الخطوط العربية واللاتينية معاً.',
      descEn: 'A 4-tier typography system (Display, Heading, Body, Small) tailored for Arabic and Latin pairing harmony and hierarchy.',
      icon: <Type className="w-6 h-6 text-[#A78BFA]" />,
      accentColor: 'from-[#A78BFA] to-[#6366F1]',
      previewType: 'fonts',
    },
    {
      id: 'grid' as ActiveTool,
      titleAr: 'أداة المقاسات ومناطق الأمان',
      titleEn: 'Design Grids & Safe Areas',
      badgeAr: 'سوشيال + مطبوعات + فيديو',
      badgeEn: 'Social / Print / Video',
      descAr: 'مكتبة مقاسات دقيقة لجميع المنصات مع محاكي تفاعلي لتجربة أبعاد تصميمك ومناطق الأمان لمنع اقتطاع العناصر، مع تصدير PNG شفاف.',
      descEn: 'Exact canvas specs and safe-margin overlays for social feeds, stories, print formats, and broadcast video with live simulation.',
      icon: <Grid3X3 className="w-6 h-6 text-[#38BDF8]" />,
      accentColor: 'from-[#38BDF8] to-[#0284C7]',
      previewType: 'grid',
    },
    {
      id: 'prompts' as ActiveTool,
      titleAr: 'مكتبة البرومبتات للمصممين',
      titleEn: 'Curated Prompt Library',
      badgeAr: 'منتقاة يدوياً',
      badgeEn: 'Curated for Designers',
      descAr: 'مكتبة متجددة ومصنفة بعناية لأوامر توليد الصور الاحترافية (موك آب، إضاءات سينمائية، مجوهرات، ديكور، منتجات) بنسخ مباشر بنقرة واحدة.',
      descEn: 'Curated, high-fidelity prompts organized into designer-focused categories: studio portraits, 3D packaging, brutalism, and editorial scenes.',
      icon: <Sparkles className="w-6 h-6 text-[#FDE047]" />,
      accentColor: 'from-[#FDE047] to-[#F59E0B]',
      previewType: 'prompts',
    },
  ];

  return (
    <section 
      id="moonberry-features-grid-section"
      className="py-16 md:py-28 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0f0714] dark:bg-[#0f0714] light:bg-[#FAFAFC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-xs font-bold text-[#f43f5e] mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isRtl ? 'الأدوات الأساسية' : 'Core Toolbox'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900">
              {isRtl ? 'أربعة مرافق جوهرية في سير عملك' : 'Four Core Utilities for Daily Design'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-md">
            {isRtl
              ? 'كل أداة مصممة لتكون مستقلة وسريعة وتعطيك نتائج بصرية وفنية فورية يمكنك نسخها لبرامجك.'
              : 'Engineered for instant utility, visual clarity, and zero friction in your creative pipeline.'}
          </p>
        </div>

        {/* 4 Large Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group flex flex-col justify-between rounded-[32px] border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white p-6 sm:p-8 shadow-2xl backdrop-blur-xl hover:border-[#f43f5e]/60 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden"
              id={`feature-card-${tool.id}`}
            >
              {/* Subtle top gradient accent */}
              <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${tool.accentColor} opacity-80`} />

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200">
                    {tool.icon}
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/5 dark:bg-white/5 light:bg-slate-100 text-[#f43f5e] border border-[#f43f5e]/30">
                    {isRtl ? tool.badgeAr : tool.badgeEn}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 mb-3">
                  {isRtl ? tool.titleAr : tool.titleEn}
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed mb-6">
                  {isRtl ? tool.descAr : tool.descEn}
                </p>

                {/* Visual Tool Mockup Preview */}
                <div className="mb-6 rounded-2xl bg-[#0f0714] dark:bg-[#0f0714] light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 p-4">
                  {tool.previewType === 'colors' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono">
                        <span>#7B2CBF</span>
                        <span>#f43f5e</span>
                        <span>#FDE047</span>
                        <span>#38BDF8</span>
                      </div>
                      <div className="grid grid-cols-4 h-16 rounded-xl overflow-hidden shadow-inner">
                        <div className="bg-[#7B2CBF] flex items-center justify-center text-white text-xs font-bold">
                          <Lock className="w-3.5 h-3.5 opacity-60" />
                        </div>
                        <div className="bg-[#f43f5e]" />
                        <div className="bg-[#FDE047]" />
                        <div className="bg-[#38BDF8]" />
                      </div>
                    </div>
                  )}

                  {tool.previewType === 'fonts' && (
                    <div className="space-y-2 text-right">
                      <div className="flex items-center justify-between text-xs text-[#8b5cf6] font-medium border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-2">
                        <span className="font-english">Display: Alexandria 800</span>
                        <span className="font-english">Body: Cairo 400</span>
                      </div>
                      <div className="pt-1">
                        <p className="font-display font-extrabold text-base text-white dark:text-white light:text-slate-900 leading-tight">
                          إلهام بصري يصنع الفارق في كل مشروع
                        </p>
                        <p className="font-body text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
                          تنسيق مثالي بين العناوين الضخمة والنصوص المقروءة بسلاسة.
                        </p>
                      </div>
                    </div>
                  )}

                  {tool.previewType === 'grid' && (
                    <div className="relative h-20 rounded-xl border border-dashed border-[#38BDF8]/40 bg-[#38BDF8]/5 flex items-center justify-center">
                      <div className="absolute inset-3 border border-[#38BDF8]/60 rounded-lg flex items-center justify-between px-3 text-[11px] text-[#38BDF8] font-mono">
                        <span>Safe Margin: 60px</span>
                        <span className="font-bold">1080 × 1080 px</span>
                      </div>
                    </div>
                  )}

                  {tool.previewType === 'prompts' && (
                    <div className="flex gap-3 items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                        alt="Prompt thumbnail" 
                        className="w-12 h-12 rounded-lg object-cover border border-[#f43f5e]/40 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-[#f43f5e] bg-[#f43f5e]/10 px-2 py-0.5 rounded">
                            Portrait
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 truncate mt-1">
                          Editorial studio portrait, soft magenta rim lighting...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <button
                onClick={() => openTool(tool.id)}
                className="flex items-center justify-between w-full pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 text-sm font-bold text-slate-200 hover:text-white dark:hover:text-white transition-colors"
                id={`feature-open-button-${tool.id}`}
              >
                <span>{isRtl ? `فتح أداة ${tool.titleAr}` : `Launch ${tool.titleEn}`}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#f43f5e]" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#f43f5e]" />
                )}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
