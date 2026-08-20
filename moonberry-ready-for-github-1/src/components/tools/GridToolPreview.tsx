import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_GRID_FORMATS } from '../../data/initialData';
import { GridFormat } from '../../types';
import { 
  Grid3X3, 
  Upload, 
  Download, 
  Maximize2, 
  Layers, 
  Sparkles,
  Info,
  Check,
  Eye,
  Sliders,
  Smartphone,
  Tv,
  Printer,
  ShieldCheck
} from 'lucide-react';

export const GridToolPreview: React.FC = () => {
  const { language, showToast } = useApp();
  const isRtl = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<'all' | 'social' | 'print' | 'video'>('social');
  const [selectedFormat, setSelectedFormat] = useState<GridFormat>(INITIAL_GRID_FORMATS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [showPlatformOverlay, setShowPlatformOverlay] = useState<boolean>(true);
  const [customMargins, setCustomMargins] = useState<{ top: number; right: number; bottom: number; left: number }>(
    INITIAL_GRID_FORMATS[0].safeAreaMargin
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredFormats = activeCategory === 'all'
    ? INITIAL_GRID_FORMATS
    : INITIAL_GRID_FORMATS.filter(f => f.category === activeCategory);

  const handleSelectFormat = (fmt: GridFormat) => {
    setSelectedFormat(fmt);
    setCustomMargins(fmt.safeAreaMargin);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        showToast(isRtl ? 'تم تحميل التصميم داخل المحاكي بنجاح' : 'Design loaded into canvas simulator');
      };
      reader.readAsDataURL(file);
    }
  };

  // Real Canvas Download for Transparent Safe Area PNG
  const handleExportTransparentPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = selectedFormat.width;
    canvas.height = selectedFormat.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw transparent background (do not fill)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate safe box bounds
    const top = customMargins.top;
    const right = customMargins.right;
    const bottom = customMargins.bottom;
    const left = customMargins.left;
    const safeW = canvas.width - left - right;
    const safeH = canvas.height - top - bottom;

    // Semi-transparent safe zone fill
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.fillRect(left, top, safeW, safeH);

    // Dashed guide border
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = Math.max(3, Math.round(canvas.width / 400));
    ctx.setLineDash([20, 15]);
    ctx.strokeRect(left, top, safeW, safeH);

    // Outer Boundary
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = Math.max(2, Math.round(canvas.width / 600));
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Badge label in corner
    ctx.fillStyle = '#F43F5E';
    ctx.font = `bold ${Math.round(canvas.width / 35)}px sans-serif`;
    ctx.fillText(`SAFE AREA (${safeW}x${safeH}px) - Moonberry`, left + 20, top + 40);

    const link = document.createElement('a');
    link.download = `moonberry-grid-${selectedFormat.id}-${selectedFormat.width}x${selectedFormat.height}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(isRtl ? 'تم تنزيل شبكة الأمان الشفافة بدقة 100% PNG' : 'Downloaded 100% True-Resolution Transparent Guide PNG');
  };

  return (
    <div className="space-y-8" id="grid-tool-view">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-2xl bg-[#38BDF8]/20 text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl ? 'استوديو مقاسات وشبكات الأمان (Canvas & Safe Area)' : 'Canvas Grids & Safe Area Simulator'}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {isRtl
              ? 'مقاسات قياسية ومناطق أمان لمنصات التواصل، المطبوعات، والفيديو مع تصدير شفاف وتجربة محاكاة مباشرة.'
              : 'Exact dimensions & safe-margin simulation for social feeds, print artwork, and video with transparent PNG export.'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExportTransparentPng}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:scale-105 active:scale-95 transition-all"
          id="grid-export-guide-btn"
        >
          <Download className="w-4 h-4" />
          <span>{isRtl ? 'تصدير شبكة الأمان (PNG شفاف)' : 'Download Transparent PNG Guide'}</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Selector */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveCategory('social')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === 'social' ? 'bg-[#38BDF8] text-[#0f0714] font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'سوشيال ميديا' : 'Social'}
            </button>
            <button
              onClick={() => setActiveCategory('print')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === 'print' ? 'bg-[#38BDF8] text-[#0f0714] font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'مطبوعات' : 'Print'}
            </button>
            <button
              onClick={() => setActiveCategory('video')}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === 'video' ? 'bg-[#38BDF8] text-[#0f0714] font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'فيديو' : 'Video'}
            </button>
          </div>

          {/* Formats Scroll List */}
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredFormats.map(fmt => {
              const isSelected = selectedFormat.id === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => handleSelectFormat(fmt)}
                  className={`p-4 rounded-[22px] cursor-pointer border transition-all text-right group ${
                    isSelected
                      ? 'border-[#38BDF8] bg-white/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white group-hover:text-[#38BDF8] transition-colors">
                      {fmt.title}
                    </span>
                    <span className="font-mono text-xs text-[#38BDF8] font-bold">
                      {fmt.width} × {fmt.height} {fmt.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isRtl ? fmt.descriptionAr : fmt.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High-Tech Canvas Stage & Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            
            {/* Header / Upload Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-bold text-lg text-white">
                  {selectedFormat.title}
                </h3>
                <span className="text-xs font-mono text-[#38BDF8]">
                  {selectedFormat.width} × {selectedFormat.height} px ({selectedFormat.aspectRatio})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Platform overlay toggle */}
                {selectedFormat.id === 'ig-story-reels' && (
                  <button
                    onClick={() => setShowPlatformOverlay(!showPlatformOverlay)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      showPlatformOverlay ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {isRtl ? 'واجهة التطبيق' : 'UI Overlay'}
                  </button>
                )}

                {/* Upload design button */}
                <label className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-slate-200 hover:border-[#38BDF8] transition-all">
                  <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{isRtl ? 'رفع تصميم' : 'Upload Design'}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {uploadedImage && (
                  <button
                    onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-slate-300"
                  >
                    Fit: {fitMode}
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Stage Box */}
            <div className="relative w-full h-80 sm:h-[400px] rounded-[24px] bg-[#08030b] border border-white/10 flex items-center justify-center p-6 overflow-hidden">
              
              {/* Aspect Ratio Bounding Canvas */}
              <div 
                className="relative max-w-full max-h-full aspect-square border-2 border-[#38BDF8]/50 bg-black/60 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden"
                style={{
                  aspectRatio: selectedFormat.aspectRatio.replace(':', '/')
                }}
              >
                {/* Uploaded Artwork image */}
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Design Preview Simulation"
                    className={`w-full h-full object-${fitMode}`}
                  />
                )}

                {/* Dotted Safe Area Box */}
                <div 
                  className="absolute border border-dashed border-[#F43F5E] rounded-lg bg-[#F43F5E]/5 flex flex-col items-center justify-center pointer-events-none"
                  style={{
                    top: `${(customMargins.top / selectedFormat.height) * 100}%`,
                    bottom: `${(customMargins.bottom / selectedFormat.height) * 100}%`,
                    left: `${(customMargins.left / selectedFormat.width) * 100}%`,
                    right: `${(customMargins.right / selectedFormat.width) * 100}%`,
                  }}
                >
                  <div className="px-2.5 py-0.5 rounded-full bg-black/70 text-[#F43F5E] font-bold text-[10px] backdrop-blur-md shadow">
                    {isRtl ? 'منطقة الأمان (Safe Zone)' : 'Safe Action Area'}
                  </div>
                </div>

                {/* Simulated Reels / TikTok UI overlays if selected */}
                {selectedFormat.id === 'ig-story-reels' && showPlatformOverlay && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                    {/* Top stories progress bar & sound */}
                    <div className="w-full flex items-center justify-between opacity-70">
                      <div className="h-1 bg-white/60 rounded-full flex-1 mr-2" />
                      <span className="text-[10px] text-white font-bold bg-black/40 px-2 py-0.5 rounded-full">Audio</span>
                    </div>

                    {/* Right side interaction buttons */}
                    <div className="self-end space-y-3 opacity-80 mr-1">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">❤️</div>
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">💬</div>
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">✈️</div>
                    </div>

                    {/* Bottom caption zone */}
                    <div className="w-3/4 p-2 rounded-lg bg-black/50 backdrop-blur-sm text-[9px] text-white/80 opacity-70">
                      @designer_account • Caption area and music title...
                    </div>
                  </div>
                )}

                {/* Dimension label */}
                <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 text-white px-2 py-0.5 rounded-md backdrop-blur-md">
                  {selectedFormat.width} × {selectedFormat.height} px
                </span>
              </div>
            </div>

            {/* Margin Fine-Tuner Sliders */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{isRtl ? 'تعديل هوامش الأمان يدوياً (بالبكسل):' : 'Custom Safe Margins (px):'}</span>
                </span>
                <span className="font-mono text-[#38BDF8]">
                  T:{customMargins.top} R:{customMargins.right} B:{customMargins.bottom} L:{customMargins.left}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400">Top ({customMargins.top}px)</label>
                  <input
                    type="range"
                    min="0"
                    max={selectedFormat.height / 3}
                    value={customMargins.top}
                    onChange={e => setCustomMargins({ ...customMargins, top: Number(e.target.value) })}
                    className="w-full accent-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Bottom ({customMargins.bottom}px)</label>
                  <input
                    type="range"
                    min="0"
                    max={selectedFormat.height / 3}
                    value={customMargins.bottom}
                    onChange={e => setCustomMargins({ ...customMargins, bottom: Number(e.target.value) })}
                    className="w-full accent-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Left ({customMargins.left}px)</label>
                  <input
                    type="range"
                    min="0"
                    max={selectedFormat.width / 3}
                    value={customMargins.left}
                    onChange={e => setCustomMargins({ ...customMargins, left: Number(e.target.value) })}
                    className="w-full accent-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Right ({customMargins.right}px)</label>
                  <input
                    type="range"
                    min="0"
                    max={selectedFormat.width / 3}
                    value={customMargins.right}
                    onChange={e => setCustomMargins({ ...customMargins, right: Number(e.target.value) })}
                    className="w-full accent-[#38BDF8]"
                  />
                </div>
              </div>
            </div>

            {/* Info helper */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>
                {isRtl
                  ? 'منطقة الأمان باللون الأحمر المتقطع تضمن عدم اختفاء أو اقتطاع النصوص والعناصر المهمة عند عرض التصميم على الهواتف والشاشات.'
                  : 'The red dashed bounding box ensures essential text and brand logos remain fully visible across all device screen cutouts.'}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
