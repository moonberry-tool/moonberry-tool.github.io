import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTool } from '../../types';
import { 
  Palette, 
  Type, 
  Grid3X3, 
  Sparkles, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  Maximize2,
  ExternalLink,
  Layers
} from 'lucide-react';

export const ToolShowcase: React.FC = () => {
  const { language, openTool, showToast } = useApp();
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<ActiveTool>('colors');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(isRtl ? 'تم النسخ للحافظة بنجاح' : 'Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section 
      id="moonberry-showcase-section"
      className="py-16 md:py-28 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0f0714] dark:bg-[#0f0714] light:bg-[#F9FAFB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-xs font-bold text-[#f43f5e] mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'معاينة حية وتفاعلية' : 'Interactive Workspace Preview'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 mb-4">
            {isRtl ? 'تجربة سريعة للأدوات كما تظهر في بيئة العمل' : 'Real In-Tool Previews & Interactions'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600">
            {isRtl
              ? 'جرّب التفاعل المباشر مع واجهة كل أداة قبل الانتقال إلى لوحة العمل الكاملة.'
              : 'Interact directly with real tool modules before launching the workspace.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-300">
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'colors'
                  ? 'bg-white text-[#0f0714] shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="showcase-tab-colors"
            >
              <Palette className="w-4 h-4 text-[#f43f5e]" />
              <span>{isRtl ? 'الألوان والتوليد' : 'Colors'}</span>
            </button>

            <button
              onClick={() => setActiveTab('fonts')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'fonts'
                  ? 'bg-white text-[#0f0714] shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="showcase-tab-fonts"
            >
              <Type className="w-4 h-4 text-[#8b5cf6]" />
              <span>{isRtl ? 'الخطوط والتايبوغرافي' : 'Fonts'}</span>
            </button>

            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'grid'
                  ? 'bg-white text-[#0f0714] shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="showcase-tab-grid"
            >
              <Grid3X3 className="w-4 h-4 text-[#38BDF8]" />
              <span>{isRtl ? 'الشبكات والمقاسات' : 'Grids'}</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'prompts'
                  ? 'bg-white text-[#0f0714] shadow-[0_0_20px_rgba(253,224,71,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="showcase-tab-prompts"
            >
              <Sparkles className="w-4 h-4 text-[#c026d3]" />
              <span>{isRtl ? 'البرومبتات' : 'Prompts'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Workspace Container */}
        <div className="rounded-[32px] border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-white shadow-2xl backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden">
          
          {/* Top Window Chrome Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 dark:border-white/10 light:border-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f43f5e]" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span className="text-xs font-mono text-slate-500 ml-2">moonberry.app/{activeTab}</span>
            </div>

            <button
              onClick={() => openTool(activeTab)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#f43f5e] hover:text-white transition-colors"
            >
              <span>{isRtl ? 'فتح في مساحة العمل الكاملة' : 'Open in Full App'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TAB 1: Colors Showcase */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    {isRtl ? 'باليت "Moonberry Twilight" المتناغم' : 'Harmonic "Moonberry Twilight" Palette'}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                    {isRtl ? 'معلومات التناغم: Triadic & Complementary مع قفل اللون الأساسي' : 'Harmony: Triadic & Complementary with Base Locked'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { hex: '#0B0C1A', rgb: '11, 12, 26', hsl: '236°, 41%, 7%', role: 'Background', locked: true },
                  { hex: '#3B0764', rgb: '59, 7, 100', hsl: '274°, 87%, 21%', role: 'Surface', locked: false },
                  { hex: '#7B2CBF', rgb: '123, 44, 191', hsl: '272°, 63%, 46%', role: 'Primary Brand', locked: true },
                  { hex: '#f43f5e', rgb: '244, 63, 94', hsl: '349°, 89%, 60%', role: 'Vibrant Berry', locked: false },
                  { hex: '#FDE047', rgb: '253, 224, 71', hsl: '50°, 98%, 64%', role: 'Highlight Gold', locked: false },
                ].map((col, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 shadow-md"
                  >
                    <div 
                      className="h-32 p-3 flex flex-col justify-between"
                      style={{ backgroundColor: col.hex }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/40 text-white backdrop-blur-md">
                          {col.role}
                        </span>
                        <div className="p-1 rounded bg-black/30 text-white">
                          {col.locked ? <Lock className="w-3 h-3 text-[#FDE047]" /> : <Unlock className="w-3 h-3 opacity-60" />}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-right">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-white dark:text-white light:text-slate-900">{col.hex}</span>
                        <button
                          onClick={() => handleCopyText(col.hex, `hex-${idx}`)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#f43f5e] text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === `hex-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>RGB:</span>
                        <span>{col.rgb}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>HSL:</span>
                        <span>{col.hsl}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Fonts Showcase */}
          {activeTab === 'fonts' && (
            <div className="space-y-6 text-right">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    {isRtl ? 'نظام التايبوغرافي رباعي المستويات (4-Level System)' : '4-Tier Font Hierarchy System'}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                    {isRtl ? 'تناسق كامل بين الخط العربي والمعاصر واللاتيني' : 'Harmonized Arabic Display & Latin Sans'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Level 1: Display */}
                <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50">
                  <div className="flex items-center justify-between text-xs text-[#8b5cf6] font-semibold mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#f43f5e]/20 text-[#f43f5e]">DISPLAY (العرض الكبير)</span>
                    <span className="font-mono">Alexandria 900 • 36px</span>
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white dark:text-white light:text-slate-900 leading-tight mb-2">
                    الإبداع البصري بدون تعقيد
                  </h3>
                  <p className="font-english text-xs text-slate-400">
                    Display title for hero and major campaigns
                  </p>
                </div>

                {/* Level 2: Heading */}
                <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50">
                  <div className="flex items-center justify-between text-xs text-[#8b5cf6] font-semibold mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6]">HEADING (العناوين الفرعية)</span>
                    <span className="font-mono">Outfit Bold • 22px</span>
                  </div>
                  <h4 className="font-english font-bold text-xl text-white dark:text-white light:text-slate-900 leading-tight mb-2">
                    Precision Engineered Architecture
                  </h4>
                  <p className="font-body text-xs text-slate-400">
                    عناوين فرعية واضحة تمنح المتلقي تسلسلاً بصرياً مريحاً.
                  </p>
                </div>

                {/* Level 3: Body */}
                <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50">
                  <div className="flex items-center justify-between text-xs text-[#38BDF8] font-semibold mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8]">BODY (النصوص المقروءة)</span>
                    <span className="font-mono">Cairo Regular • 16px</span>
                  </div>
                  <p className="font-body text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
                    النصوص الطويلة والمقالات تحتاج خطاً عالي المقروئية مثل Cairo الذي يحافظ على سلاسة العين عند القراءة الطويلة في الشاشات والمطبوعات.
                  </p>
                </div>

                {/* Level 4: Small */}
                <div className="p-5 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50">
                  <div className="flex items-center justify-between text-xs text-[#FDE047] font-semibold mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#FDE047]/20 text-[#FDE047]">SMALL (الملاحظات والحواشي)</span>
                    <span className="font-mono">Plus Jakarta Sans • 12px</span>
                  </div>
                  <p className="font-english text-xs text-slate-400 leading-relaxed">
                    Captions, tags, metadata, copyrights and precise interface labeling designed for maximum micro-legibility.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Grid Showcase */}
          {activeTab === 'grid' && (
            <div className="space-y-6 text-right">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    {isRtl ? 'Instagram Post & Story Safe Area Guides' : 'Instagram Safe Area Canvas Preview'}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                    1080 × 1080 px • 1:1 Aspect Ratio • 60px Safe Margin
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
                <div className="relative w-72 h-72 rounded-2xl bg-[#0f0714] border-2 border-[#f43f5e]/40 p-4 shadow-xl flex items-center justify-center">
                  {/* Outer Canvas Label */}
                  <span className="absolute top-2 right-3 text-[10px] font-mono text-slate-400">1080 × 1080 px</span>

                  {/* Safe Area Inner Box */}
                  <div className="w-full h-full border border-dashed border-[#f43f5e] rounded-xl flex flex-col items-center justify-center p-4 bg-[#f43f5e]/5 text-center">
                    <span className="px-2.5 py-1 rounded-md bg-[#f43f5e]/20 text-[#f43f5e] text-xs font-bold mb-2">
                      {isRtl ? 'منطقة الأمان (Safe Zone)' : 'Safe Zone'}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {isRtl ? 'ضع هنا النصوص والشعارات لتضمن عدم اقتطاعها' : 'Place critical logos and typography inside'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-w-sm">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white">
                    <span className="font-bold text-[#38BDF8] block mb-1">📐 {isRtl ? 'هوامش الأمان' : 'Safe Margins'}:</span>
                    {isRtl ? '60px من جميع الاتجاهات لتفادي حدود الشاشات وقوائم التطبيقات.' : '60px padding on all sides to avoid viewport clipping.'}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white">
                    <span className="font-bold text-[#f43f5e] block mb-1">🖼️ {isRtl ? 'محاكي رفع الصور' : 'Design Simulator'}:</span>
                    {isRtl ? 'ارفع أي تصميم لتتأكد فوراً من ملاءمته وتطابقه قبل التصدير.' : 'Upload your artwork to test overlay & safe margins instantly.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Prompts Showcase */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    {isRtl ? 'برومبت استوديو احترافي منتقى للمصممين' : 'Curated Studio Prompt for Designers'}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                    Category: Portrait & Character • Midjourney v6.0 Ready
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center p-5 rounded-2xl bg-white/5 border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                  alt="Curated preview" 
                  className="w-full md:w-56 h-48 rounded-xl object-cover border border-[#f43f5e]/40 shadow-lg shrink-0"
                />
                <div className="flex-1 space-y-3 text-right">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#f43f5e]/15 text-[#f43f5e] uppercase">
                      Portrait & Lighting
                    </span>
                    <button
                      onClick={() => handleCopyText('Editorial studio portrait of a futuristic fashion model, soft magenta and deep indigo rim lighting, 8k --ar 4:5 --v 6.0', 'prompt-demo')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#0f0714] text-xs font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    >
                      {copiedKey === 'prompt-demo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#f43f5e]" />}
                      <span>{isRtl ? 'نسخ البرومبت' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <h5 className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                    Futuristic Studio Portrait with Soft Magenta & Indigo Rim Lighting
                  </h5>
                  <p className="font-mono text-xs text-slate-300 bg-[#0f0714] p-3 rounded-xl border border-white/10 leading-relaxed text-left" dir="ltr">
                    Editorial studio portrait of a futuristic fashion model, soft magenta and deep indigo rim lighting, high-fashion styling, hyper-realistic skin texture, 8k resolution --ar 4:5 --v 6.0
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
