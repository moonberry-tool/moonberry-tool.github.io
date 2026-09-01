import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ImageIcon,
  Wand2,
  Download,
  RefreshCw,
  Sparkles,
  Lock,
  ChevronDown,
  Loader2,
  AlertCircle,
  LogIn,
} from 'lucide-react';

interface ImageModel {
  id: string;
  labelAr: string;
  labelEn: string;
  isFree: boolean; // Flux = always free & unlimited. Others: limited later by the credit system (Phase 2/3).
  badgeAr: string;
  badgeEn: string;
}

// NOTE for Phase 2/3: once auth + credits ship, gate `!model.isFree` models behind
// a per-user credit check before calling generateImage(). For now (Phase 1, no auth
// yet) every model is callable — the free/limited badges are just a preview of what's coming.
const IMAGE_MODELS: ImageModel[] = [
  { id: 'flux', labelAr: 'Flux', labelEn: 'Flux', isFree: true, badgeAr: 'مجاني وغير محدود', badgeEn: 'Free & Unlimited' },
  { id: 'gpt-image-2', labelAr: 'GPT Image 2.0', labelEn: 'GPT Image 2.0', isFree: false, badgeAr: 'استخدام محدود', badgeEn: 'Limited Use' },
  { id: 'gptimage-large', labelAr: 'GPT Image Large', labelEn: 'GPT Image Large', isFree: false, badgeAr: 'استخدام محدود', badgeEn: 'Limited Use' },
  { id: 'nanobanana', labelAr: 'Nano Banana', labelEn: 'Nano Banana', isFree: false, badgeAr: 'استخدام محدود', badgeEn: 'Limited Use' },
  { id: 'nanobanana-2', labelAr: 'Nano Banana 2', labelEn: 'Nano Banana 2', isFree: false, badgeAr: 'استخدام محدود', badgeEn: 'Limited Use' },
  { id: 'nanobanana-pro', labelAr: 'Nano Banana Pro', labelEn: 'Nano Banana Pro', isFree: false, badgeAr: 'استخدام محدود', badgeEn: 'Limited Use' },
];

const ASPECT_RATIOS = [
  { id: '1:1', labelAr: '1:1', labelEn: '1:1', width: 1024, height: 1024 },
  { id: '16:9', labelAr: '16:9', labelEn: '16:9', width: 1280, height: 720 },
  { id: '9:16', labelAr: '9:16', labelEn: '9:16', width: 720, height: 1280 },
  { id: '4:3', labelAr: '4:3', labelEn: '4:3', width: 1024, height: 768 },
  { id: '3:4', labelAr: '3:4', labelEn: '3:4', width: 768, height: 1024 },
];

// Requests go through our Cloudflare Worker, which holds the Pollinations
// secret key server-side and forwards the request — the key is never exposed
// in the browser.
const IMAGE_PROXY_URL = 'https://moonberry-image-proxy.opaidamazed.workers.dev';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
}

export const ImageGenToolPreview: React.FC = () => {
  const { language, showToast, user, credits, userPlan, openAuthModal, consumeCredit } = useApp();
  const isRtl = language === 'ar';

  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ImageModel>(IMAGE_MODELS[0]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const buildImageRequestUrl = (): string => {
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 1_000_000);
    return `${IMAGE_PROXY_URL}/?prompt=${encodedPrompt}&width=${selectedRatio.width}&height=${selectedRatio.height}&model=${selectedModel.id}&seed=${seed}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast(isRtl ? 'يرجى كتابة وصف للصورة أولاً' : 'Please enter a prompt first');
      return;
    }

    // Flux (and other isFree models) stay open to everyone, logged in or not.
    if (!selectedModel.isFree) {
      if (!user) {
        showToast(isRtl ? 'يرجى تسجيل الدخول لاستخدام هذا الموديل' : 'Please log in to use this model');
        openAuthModal();
        return;
      }
      if (userPlan === 'free' && credits <= 0) {
        showToast(
          isRtl
            ? 'خلصت استخدامك المجاني لهذا الموديل — الترقية للخطة المدفوعة قريبًا'
            : "You've used your free generations for this model — paid upgrade coming soon"
        );
        return;
      }
    }

    setIsGenerating(true);
    setErrorMsg(null);

    const url = buildImageRequestUrl();

    // Preload the image so we only show it (and add to history) once it's actually ready
    const img = new Image();
    img.onload = async () => {
      // Only deduct a credit after the image actually succeeded
      if (!selectedModel.isFree) {
        const allowed = await consumeCredit();
        if (!allowed) {
          setIsGenerating(false);
          showToast(isRtl ? 'تعذر تأكيد الكريدت، حاول تاني' : 'Could not confirm credit, please try again');
          return;
        }
      }

      const newImage: GeneratedImage = {
        id: 'img-' + Date.now(),
        url,
        prompt: prompt.trim(),
        model: selectedModel.id,
      };
      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 8));
      setIsGenerating(false);
    };
    img.onerror = () => {
      setIsGenerating(false);
      setErrorMsg(
        isRtl
          ? 'حدث خطأ أثناء توليد الصورة، جرب موديل تاني أو حاول مرة أخرى'
          : 'Something went wrong generating the image — try another model or try again'
      );
    };
    img.src = url;
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `moonberry-${image.model}-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      showToast(isRtl ? 'تعذر تحميل الصورة' : 'Could not download image');
    }
  };

  return (
    <div className="space-y-6" id="image-gen-tool-root">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-6 h-6 text-[#34D399]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl ? 'توليد الصور بالذكاء الاصطناعي' : 'AI Image Generator'}
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-xl">
            {isRtl
              ? 'حوّل وصفك النصي لصورة فورًا. موديل Flux مجاني واستخدامه غير محدود.'
              : 'Turn a text prompt into an image instantly. The Flux model is free with unlimited use.'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: prompt + controls */}
        <div className="lg:col-span-1 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              {isRtl ? 'وصف الصورة' : 'Prompt'}
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              placeholder={
                isRtl
                  ? 'مثال: بوستر تسويقي بألوان بنفسجية لمنتج عطور فاخر...'
                  : 'e.g. A vibrant purple marketing poster for a luxury perfume brand...'
              }
              className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#34D399] resize-none text-sm"
            />
          </div>

          {/* Model selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-400">
                {isRtl ? 'الموديل' : 'Model'}
              </label>
              {user && userPlan === 'free' && (
                <span className="text-[10px] font-bold text-amber-300">
                  {isRtl ? `متبقي ${credits} استخدام مجاني` : `${credits} free uses left`}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {IMAGE_MODELS.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${
                    selectedModel.id === model.id
                      ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] border-transparent text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  <span>{isRtl ? model.labelAr : model.labelEn}</span>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      model.isFree
                        ? 'bg-emerald-400/20 text-emerald-300'
                        : 'bg-amber-400/20 text-amber-300'
                    }`}
                  >
                    {!model.isFree && <Lock className="w-2.5 h-2.5" />}
                    {isRtl ? model.badgeAr : model.badgeEn}
                  </span>
                </button>
              ))}
            </div>
            {!user && (
              <button
                onClick={openAuthModal}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-white/10 hover:border-[#8b5cf6]/50 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isRtl ? 'سجل دخولك لفتح باقي الموديلات' : 'Log in to unlock other models'}</span>
              </button>
            )}
          </div>

          {/* Aspect ratio selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              {isRtl ? 'نسبة الأبعاد' : 'Aspect Ratio'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedRatio.id === ratio.id
                      ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                  }`}
                >
                  {isRtl ? ratio.labelAr : ratio.labelEn}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all shadow-lg disabled:opacity-60 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isRtl ? 'جاري التوليد...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>{isRtl ? 'توليد الصورة' : 'Generate Image'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: preview */}
        <div className="lg:col-span-2">
          <div className="relative rounded-3xl bg-black/40 border border-white/10 overflow-hidden aspect-square flex items-center justify-center">
            {isGenerating && (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
                <span className="text-sm">{isRtl ? 'جاري رسم الصورة...' : 'Painting your image...'}</span>
              </div>
            )}

            {!isGenerating && errorMsg && (
              <div className="flex flex-col items-center gap-3 text-center px-6 text-slate-400">
                <AlertCircle className="w-8 h-8 text-[#f43f5e]" />
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            {!isGenerating && !errorMsg && !currentImage && (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <Sparkles className="w-10 h-10" />
                <span className="text-sm">{isRtl ? 'الصورة اللي هتولدها هتظهر هنا' : 'Your generated image will appear here'}</span>
              </div>
            )}

            {!isGenerating && currentImage && (
              <>
                <img
                  src={currentImage.url}
                  alt={currentImage.prompt}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDownload(currentImage)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isRtl ? 'تحميل' : 'Download'}
                </button>
              </>
            )}
          </div>

          {/* History strip */}
          {history.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {history.map(img => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(img)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImage?.id === img.id ? 'border-[#f43f5e]' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
