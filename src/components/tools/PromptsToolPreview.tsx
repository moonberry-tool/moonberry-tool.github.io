import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';

type GenMode = 'form' | 'ai';

const SUBJECT_STYLES = [
  { id: 'photorealistic', labelAr: 'واقعي فوتوغرافي', labelEn: 'photorealistic photography' },
  { id: 'cinematic', labelAr: 'سينمائي', labelEn: 'cinematic film still' },
  { id: '3d-render', labelAr: 'رندر ثلاثي الأبعاد', labelEn: '3D render' },
  { id: 'illustration', labelAr: 'رسم توضيحي', labelEn: 'digital illustration' },
  { id: 'anime', labelAr: 'أنمي', labelEn: 'anime style' },
  { id: 'watercolor', labelAr: 'ألوان مائية', labelEn: 'watercolor painting' },
  { id: 'minimal', labelAr: 'بسيط ونظيف', labelEn: 'minimal clean design' },
];

const LIGHTING_OPTIONS = [
  { id: 'golden-hour', labelAr: 'ساعة ذهبية', labelEn: 'golden hour lighting' },
  { id: 'studio', labelAr: 'إضاءة استوديو', labelEn: 'studio lighting' },
  { id: 'natural', labelAr: 'إضاءة طبيعية', labelEn: 'soft natural light' },
  { id: 'dramatic', labelAr: 'إضاءة درامية', labelEn: 'dramatic high-contrast lighting' },
  { id: 'neon', labelAr: 'إضاءة نيون', labelEn: 'neon glow lighting' },
  { id: 'moody', labelAr: 'إضاءة داكنة هادئة', labelEn: 'moody low-key lighting' },
];

const COMPOSITION_OPTIONS = [
  { id: 'close-up', labelAr: 'لقطة قريبة', labelEn: 'close-up shot' },
  { id: 'wide-shot', labelAr: 'لقطة واسعة', labelEn: 'wide establishing shot' },
  { id: 'aerial', labelAr: 'لقطة علوية', labelEn: 'aerial top-down view' },
  { id: 'portrait-comp', labelAr: 'تكوين بورتريه', labelEn: 'portrait composition' },
  { id: 'macro', labelAr: 'تصوير ماكرو', labelEn: 'macro detail shot' },
];

const DETAIL_LEVELS = [
  { id: 'standard', labelAr: 'عادي', labelEn: 'detailed' },
  { id: 'high', labelAr: 'عالي التفاصيل', labelEn: 'highly detailed, intricate' },
  { id: 'ultra', labelAr: 'فائق الجودة', labelEn: 'ultra-detailed, 8k, professional quality' },
];

export const PromptsToolPreview: React.FC = () => {
  const { language, showToast } = useApp();
  const isRtl = language === 'ar';

  const [mode, setMode] = useState<GenMode>('form');
  const [copied, setCopied] = useState(false);

  // Form builder state
  const [subjectText, setSubjectText] = useState('');
  const [style, setStyle] = useState(SUBJECT_STYLES[0]);
  const [lighting, setLighting] = useState(LIGHTING_OPTIONS[0]);
  const [composition, setComposition] = useState(COMPOSITION_OPTIONS[0]);
  const [detail, setDetail] = useState(DETAIL_LEVELS[1]);
  const [formPrompt, setFormPrompt] = useState('');

  // AI generation state
  const [aiIdea, setAiIdea] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const buildFormPrompt = () => {
    if (!subjectText.trim()) {
      showToast(isRtl ? 'يرجى كتابة موضوع الصورة أولاً' : 'Please describe the subject first');
      return;
    }
    const assembled = `${subjectText.trim()}, ${style.labelEn}, ${composition.labelEn}, ${lighting.labelEn}, ${detail.labelEn}`;
    setFormPrompt(assembled);
  };

  const handleAiGenerate = async () => {
    if (!aiIdea.trim()) {
      showToast(isRtl ? 'يرجى كتابة فكرتك أولاً' : 'Please write your idea first');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const instruction = `You are an expert AI image-generation prompt engineer. Turn the following idea into ONE single, vivid, professional prompt in English for AI image generation, including style, lighting, and composition details. Return ONLY the prompt text itself — no explanations, no quotes, no markdown, no labels.\n\nIdea: ${aiIdea.trim()}`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(instruction)}?model=openai`
      );

      if (!response.ok) throw new Error('Request failed');
      const generated = (await response.text()).trim();

      if (!generated) throw new Error('Empty response');
      setAiPrompt(generated);
    } catch (err) {
      showToast(isRtl ? 'حدث خطأ أثناء التوليد، حاول مرة أخرى' : 'Something went wrong, please try again');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const activePrompt = mode === 'form' ? formPrompt : aiPrompt;

  const handleCopy = () => {
    if (!activePrompt) return;
    navigator.clipboard.writeText(activePrompt);
    setCopied(true);
    showToast(isRtl ? 'تم نسخ البرومبت' : 'Prompt copied');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6" id="prompts-tool-root">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#c026d3]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isRtl ? 'مولّد البرومبتات' : 'Prompt Generator'}
          </h1>
        </div>
        <p className="text-sm text-slate-400 max-w-xl">
          {isRtl
            ? 'ركّب برومبت احترافي بنفسك، أو خلي الذكاء الاصطناعي يحوّل فكرتك البسيطة لبرومبت جاهز.'
            : 'Build a professional prompt yourself, or let AI turn your simple idea into a ready one.'}
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full w-fit text-sm font-bold">
        <button
          onClick={() => setMode('form')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
            mode === 'form' ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white' : 'text-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {isRtl ? 'بناء بالفورم' : 'Form Builder'}
        </button>
        <button
          onClick={() => setMode('ai')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
            mode === 'ai' ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white' : 'text-slate-400'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          {isRtl ? 'توليد بالذكاء الاصطناعي' : 'AI Generate'}
        </button>
      </div>

      {mode === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form controls */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">
                {isRtl ? 'موضوع الصورة' : 'Subject'}
              </label>
              <textarea
                value={subjectText}
                onChange={e => setSubjectText(e.target.value)}
                rows={2}
                placeholder={isRtl ? 'مثال: زجاجة عطر فاخرة فوق قاعدة رخامية' : 'e.g. a luxury perfume bottle on a marble pedestal'}
                className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c026d3] resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'الستايل' : 'Style'}</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUBJECT_STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl border text-right transition-all ${
                        style.id === s.id
                          ? 'bg-[#c026d3]/20 border-[#c026d3] text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                      }`}
                    >
                      {isRtl ? s.labelAr : s.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'الإضاءة' : 'Lighting'}</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {LIGHTING_OPTIONS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLighting(l)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl border text-right transition-all ${
                        lighting.id === l.id
                          ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                      }`}
                    >
                      {isRtl ? l.labelAr : l.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'التكوين' : 'Composition'}</label>
                <select
                  value={composition.id}
                  onChange={e => setComposition(COMPOSITION_OPTIONS.find(c => c.id === e.target.value) || COMPOSITION_OPTIONS[0])}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#f43f5e]"
                >
                  {COMPOSITION_OPTIONS.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#0f0714]">
                      {isRtl ? c.labelAr : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'مستوى التفاصيل' : 'Detail Level'}</label>
                <select
                  value={detail.id}
                  onChange={e => setDetail(DETAIL_LEVELS.find(d => d.id === e.target.value) || DETAIL_LEVELS[0])}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#f43f5e]"
                >
                  {DETAIL_LEVELS.map(d => (
                    <option key={d.id} value={d.id} className="bg-[#0f0714]">
                      {isRtl ? d.labelAr : d.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={buildFormPrompt}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all shadow-lg"
            >
              <Layers className="w-4 h-4" />
              {isRtl ? 'تركيب البرومبت' : 'Build Prompt'}
            </button>
          </div>

          {/* Output */}
          <PromptOutput prompt={formPrompt} isRtl={isRtl} copied={copied} onCopy={handleCopy} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <label className="block text-xs font-bold text-slate-400 mb-2">
              {isRtl ? 'اكتب فكرتك ببساطة' : 'Describe your idea simply'}
            </label>
            <textarea
              value={aiIdea}
              onChange={e => setAiIdea(e.target.value)}
              rows={4}
              placeholder={
                isRtl
                  ? 'مثال: بوستر لعرض خصومات على منتجات تجميل بألوان بنفسجية'
                  : 'e.g. a discount poster for cosmetics products in purple tones'
              }
              className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c026d3] resize-none text-sm"
            />
            <button
              onClick={handleAiGenerate}
              disabled={isGeneratingAi}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all shadow-lg disabled:opacity-60 disabled:hover:scale-100"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'جاري التوليد...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{isRtl ? 'توليد برومبت احترافي' : 'Generate Professional Prompt'}</span>
                </>
              )}
            </button>
          </div>

          <PromptOutput prompt={aiPrompt} isRtl={isRtl} copied={copied} onCopy={handleCopy} />
        </div>
      )}
    </div>
  );
};

interface PromptOutputProps {
  prompt: string;
  isRtl: boolean;
  copied: boolean;
  onCopy: () => void;
}

const PromptOutput: React.FC<PromptOutputProps> = ({ prompt, isRtl, copied, onCopy }) => (
  <div className="lg:col-span-1">
    <label className="block text-xs font-bold text-slate-400 mb-2">{isRtl ? 'البرومبت الناتج' : 'Generated Prompt'}</label>
    <div className="relative p-4 rounded-2xl bg-black/40 border border-white/10 min-h-[180px] flex flex-col">
      {prompt ? (
        <p dir="ltr" className="text-sm text-slate-200 leading-relaxed flex-1">
          {prompt}
        </p>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center text-slate-500 text-sm">
          {isRtl ? 'البرومبت اللي هتولده هيظهر هنا' : 'Your generated prompt will appear here'}
        </div>
      )}
      {prompt && (
        <button
          onClick={onCopy}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ البرومبت' : 'Copy Prompt')}
        </button>
      )}
    </div>
  </div>
);
