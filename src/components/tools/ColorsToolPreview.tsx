import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ColorItem, ColorHarmonyType, SavedPalette } from '../../types';
import { INITIAL_PALETTES } from '../../data/initialData';
import { 
  Palette, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Download, 
  Image as ImageIcon,
  Sparkles,
  Layers,
  Sliders,
  Bookmark,
  Trash2,
  Share2,
  FileCode,
  Eye,
  CheckCircle2,
  X,
  Upload,
  Contrast
} from 'lucide-react';

export const ColorsToolPreview: React.FC = () => {
  const { language, showToast } = useApp();
  const isRtl = language === 'ar';

  const [harmony, setHarmony] = useState<ColorHarmonyType>('triadic');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'extract' | 'saved'>('generator');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'json' | 'png'>('css');
  const [paletteName, setPaletteName] = useState('Moonberry Palette');
  
  // Image extraction state
  const [extractedImageUrl, setExtractedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active palette
  const [colors, setColors] = useState<ColorItem[]>([
    { id: '1', hex: '#0F0714', rgb: '15, 7, 20', hsl: '277°, 48%, 5%', locked: true, name: 'Deep Space Navy' },
    { id: '2', hex: '#3B0764', rgb: '59, 7, 100', hsl: '274°, 87%, 21%', locked: false, name: 'Royal Plum' },
    { id: '3', hex: '#7B2CBF', rgb: '123, 44, 191', hsl: '272°, 63%, 46%', locked: true, name: 'Moonberry Violet' },
    { id: '4', hex: '#F43F5E', rgb: '244, 63, 94', hsl: '350°, 89%, 60%', locked: false, name: 'Berry Rose' },
    { id: '5', hex: '#8B5CF6', rgb: '139, 92, 246', hsl: '258°, 90%, 66%', locked: false, name: 'Cyber Lavender' },
  ]);

  // Saved Palettes in LocalStorage
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    try {
      const stored = localStorage.getItem('moonberry_saved_palettes');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-1',
        name: 'Vibrant Berry Neon',
        createdAt: '2026-08-19',
        colors: [
          { id: 'c1', hex: '#0F0714', rgb: '15, 7, 20', hsl: '277°, 48%, 5%', locked: false, name: 'Void' },
          { id: 'c2', hex: '#8B5CF6', rgb: '139, 92, 246', hsl: '258°, 90%, 66%', locked: false, name: 'Lavender' },
          { id: 'c3', hex: '#F43F5E', rgb: '244, 63, 94', hsl: '350°, 89%, 60%', locked: false, name: 'Rose' },
          { id: 'c4', hex: '#C084FC', rgb: '192, 132, 252', hsl: '270°, 95%, 75%', locked: false, name: 'Lilac' },
          { id: 'c5', hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0°, 0%, 100%', locked: false, name: 'Pure White' },
        ]
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('moonberry_saved_palettes', JSON.stringify(savedPalettes));
    } catch {
      // ignore
    }
  }, [savedPalettes]);

  const harmoniesList = [
    { id: 'monochromatic', labelAr: 'أحادي (Monochromatic)', labelEn: 'Monochromatic' },
    { id: 'analogous', labelAr: 'متجاور (Analogous)', labelEn: 'Analogous' },
    { id: 'complementary', labelAr: 'مكمل (Complementary)', labelEn: 'Complementary' },
    { id: 'split-complementary', labelAr: 'مكمل منقسم (Split)', labelEn: 'Split Complementary' },
    { id: 'triadic', labelAr: 'ثلاثي متوازن (Triadic)', labelEn: 'Triadic' },
    { id: 'tetradic', labelAr: 'رباعي (Tetradic)', labelEn: 'Tetradic' },
  ];

  // Helper color functions
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
  };

  const hexToHsl = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = (parseInt(clean.substring(0, 2), 16) || 0) / 255;
    const g = (parseInt(clean.substring(2, 4), 16) || 0) / 255;
    const b = (parseInt(clean.substring(4, 6), 16) || 0) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  // Calculate contrast ratio against white and black
  const getLuminance = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(1);
  };

  // Color generator
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const generateHarmoniousPalette = (type: ColorHarmonyType) => {
    const baseHue = Math.floor(Math.random() * 360);
    let hues: number[] = [];

    switch (type) {
      case 'monochromatic':
        return [
          hslToHex(baseHue, 35, 12),
          hslToHex(baseHue, 60, 30),
          hslToHex(baseHue, 75, 48),
          hslToHex(baseHue, 85, 68),
          hslToHex(baseHue, 95, 88),
        ];
      case 'analogous':
        hues = [
          (baseHue - 40 + 360) % 360,
          (baseHue - 20 + 360) % 360,
          baseHue,
          (baseHue + 20) % 360,
          (baseHue + 40) % 360,
        ];
        break;
      case 'complementary':
        hues = [
          baseHue,
          (baseHue + 15) % 360,
          (baseHue + 180) % 360,
          (baseHue + 195) % 360,
          (baseHue + 210) % 360,
        ];
        break;
      case 'split-complementary':
        hues = [
          baseHue,
          (baseHue + 30) % 360,
          (baseHue + 150) % 360,
          (baseHue + 210) % 360,
          (baseHue + 180) % 360,
        ];
        break;
      case 'tetradic':
        hues = [
          baseHue,
          (baseHue + 90) % 360,
          (baseHue + 180) % 360,
          (baseHue + 270) % 360,
          (baseHue + 45) % 360,
        ];
        break;
      case 'triadic':
      default:
        hues = [
          baseHue,
          (baseHue + 120) % 360,
          (baseHue + 240) % 360,
          (baseHue + 60) % 360,
          (baseHue + 300) % 360,
        ];
        break;
    }

    return hues.map((h, i) => {
      const s = 65 + (i % 3) * 10;
      const l = i === 0 ? 10 : i === 4 ? 85 : 30 + i * 15;
      return hslToHex(h, s, l);
    });
  };

  const handleRegenerate = () => {
    const newHexes = generateHarmoniousPalette(harmony);
    setColors(prev =>
      prev.map((item, idx) => {
        if (item.locked) return item;
        const newHex = newHexes[idx];
        return {
          ...item,
          hex: newHex,
          rgb: hexToRgb(newHex),
          hsl: hexToHsl(newHex),
        };
      })
    );
    showToast(isRtl ? 'تم توليد باليت متناسقة جديدة' : 'Harmonious palette generated');
  };

  const handleColorEdit = (id: string, newHex: string) => {
    if (!newHex.startsWith('#') || newHex.length !== 7) return;
    setColors(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              hex: newHex.toUpperCase(),
              rgb: hexToRgb(newHex),
              hsl: hexToHsl(newHex),
            }
          : c
      )
    );
  };

  const toggleLock = (id: string) => {
    setColors(prev =>
      prev.map(col => (col.id === id ? { ...col, locked: !col.locked } : col))
    );
  };

  const handleCopy = (hex: string, id: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedId(id);
    showToast(isRtl ? `تم نسخ الكود ${hex}` : `Copied ${hex}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = () => {
    const allHex = colors.map(c => c.hex).join(', ');
    navigator.clipboard.writeText(allHex);
    showToast(isRtl ? 'تم نسخ جميع الأكواد بنجاح' : 'Copied all hex codes');
  };

  const handleSaveCurrentPalette = () => {
    const newSaved: SavedPalette = {
      id: 'pal-' + Date.now(),
      name: paletteName.trim() || 'Custom Palette',
      colors: [...colors],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSavedPalettes(prev => [newSaved, ...prev]);
    showToast(isRtl ? 'تم حفظ الباليت في مكتبتك المحلية' : 'Palette saved to library');
  };

  const handleLoadSaved = (pal: SavedPalette) => {
    setColors(pal.colors);
    setPaletteName(pal.name);
    setActiveTab('generator');
    showToast(isRtl ? `تم تحميل باليت: ${pal.name}` : `Loaded ${pal.name}`);
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPalettes(prev => prev.filter(p => p.id !== id));
    showToast(isRtl ? 'تم حذف الباليت' : 'Palette deleted');
  };

  // Image color extraction
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const imgUrl = event.target?.result as string;
      setExtractedImageUrl(imgUrl);

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imgData = ctx.getImageData(0, 0, 100, 100).data;
        const colorSamples: { r: number; g: number; b: number }[] = [];

        // Sample every 40th pixel to find dominant diverse tones
        for (let i = 0; i < imgData.length; i += 160) {
          colorSamples.push({
            r: imgData[i],
            g: imgData[i + 1],
            b: imgData[i + 2],
          });
        }

        // Sort by luminance and pick 5 representative slices
        colorSamples.sort((a, b) => {
          const lumA = a.r * 0.299 + a.g * 0.587 + a.b * 0.114;
          const lumB = b.r * 0.299 + b.g * 0.587 + b.b * 0.114;
          return lumA - lumB;
        });

        const step = Math.floor(colorSamples.length / 5);
        const extracted = [0, 1, 2, 3, 4].map(idx => {
          const c = colorSamples[Math.min(idx * step + Math.floor(step / 2), colorSamples.length - 1)];
          const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
          const hex = `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
          return {
            id: String(idx + 1),
            hex,
            rgb: `${c.r}, ${c.g}, ${c.b}`,
            hsl: hexToHsl(hex),
            locked: false,
            name: `Extracted Tone ${idx + 1}`,
          };
        });

        setColors(extracted);
        showToast(isRtl ? 'تم استخراج 5 ألوان مهيمنة من الصورة بنجاح' : 'Extracted 5 dominant colors from image');
      };
      img.src = imgUrl;
    };
    reader.readAsDataURL(file);
  };

  // Download high-res PNG swatch card
  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark canvas background
    ctx.fillStyle = '#0F0714';
    ctx.fillRect(0, 0, 1200, 630);

    // Header Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Moonberry', 60, 80);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px sans-serif';
    ctx.fillText(paletteName || 'Design Palette Specs', 60, 120);

    // 5 Swatch Columns
    const swatchWidth = 200;
    const startX = 60;
    const startY = 160;
    const swatchHeight = 360;

    colors.forEach((col, i) => {
      const x = startX + i * 215;
      
      // Card container
      ctx.fillStyle = col.hex;
      ctx.beginPath();
      ctx.roundRect(x, startY, swatchWidth, swatchHeight - 80, 16);
      ctx.fill();

      // Info box below
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(col.hex, x + 10, startY + swatchHeight - 40);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px monospace';
      ctx.fillText(`RGB(${col.rgb})`, x + 10, startY + swatchHeight - 15);
    });

    const link = document.createElement('a');
    link.download = `${paletteName.toLowerCase().replace(/\s+/g, '-')}-moonberry.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(isRtl ? 'تم تنزيل بطاقة الباليت بصيغة PNG بدقة عالية' : 'Downloaded High-Res Palette Card PNG');
  };

  // Generate code export text
  const getExportCode = () => {
    if (exportFormat === 'css') {
      return `:root {\n${colors
        .map((c, i) => `  --color-${c.name?.toLowerCase().replace(/\s+/g, '-') || i + 1}: ${c.hex}; /* rgb(${c.rgb}) */`)
        .join('\n')}\n}`;
    }
    if (exportFormat === 'tailwind') {
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors
        .map((c, i) => `        '${c.name?.toLowerCase().replace(/\s+/g, '-') || `brand-${i + 1}`}': '${c.hex}',`)
        .join('\n')}\n      }\n    }\n  }\n}`;
    }
    if (exportFormat === 'json') {
      return JSON.stringify(
        {
          name: paletteName,
          generatedBy: 'Moonberry Design Studio',
          colors: colors.map(c => ({ name: c.name, hex: c.hex, rgb: c.rgb, hsl: c.hsl })),
        },
        null,
        2
      );
    }
    return '';
  };

  return (
    <div className="space-y-8" id="colors-tool-view">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-2xl bg-[#f43f5e]/20 text-[#f43f5e] shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Palette className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl ? 'أداة الألوان والباليتات الاحترافية' : 'Pro Color Studio & Palette Generator'}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {isRtl
              ? 'توليد باليتات بصرية متناسقة، استخراج درجات الألوان من الصور، فحص التباين، وتصدير الأكواد بجميع الصيغ.'
              : 'Generate harmonic color schemes, extract tones from uploaded images, test accessibility contrast, and export code.'}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-white/10 bg-white/5 text-slate-200 hover:border-[#f43f5e] hover:text-white transition-all"
            id="colors-export-btn"
          >
            <Download className="w-4 h-4 text-[#f43f5e]" />
            <span>{isRtl ? 'تصدير الأكواد والبطاقة' : 'Export & Download'}</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-white/10 bg-white/5 text-slate-200 hover:border-[#8b5cf6] transition-all"
            id="colors-copy-all-btn"
          >
            <Copy className="w-4 h-4 text-[#8b5cf6]" />
            <span>{isRtl ? 'نسخ الأكواد' : 'Copy All'}</span>
          </button>

          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] hover:scale-105 active:scale-95 transition-all"
            id="colors-regenerate-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isRtl ? 'توليد درجات متناسقة' : 'Generate Palette'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Generator, Image Extract, Saved Library */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المولد الرياضي' : 'Harmony Generator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('extract')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'extract'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استخراج من صورة' : 'Image Extractor'}</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>
              {isRtl ? 'المحفوظات' : 'Saved'} ({savedPalettes.length})
            </span>
          </button>
        </div>

        {/* Harmony Mode Selector (when in generator tab) */}
        {activeTab === 'generator' && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
            {harmoniesList.map(h => (
              <button
                key={h.id}
                onClick={() => {
                  setHarmony(h.id as ColorHarmonyType);
                  const newHexes = generateHarmoniousPalette(h.id as ColorHarmonyType);
                  setColors(prev =>
                    prev.map((item, idx) => (item.locked ? item : { ...item, hex: newHexes[idx], rgb: hexToRgb(newHexes[idx]), hsl: hexToHsl(newHexes[idx]) }))
                  );
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  harmony === h.id ? 'bg-white text-[#0f0714] font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isRtl ? h.labelAr : h.labelEn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: IMAGE EXTRACTOR PANEL */}
      {activeTab === 'extract' && (
        <div className="p-6 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">
                {isRtl ? 'استخراج الألوان الذكي من الصور' : 'Smart Image Palette Extraction'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'ارفع أي صورة، تصميم، أو ملصق لسحب أكثر 5 درجات لونية مهيمنة بدقة بكسل متناهية.' : 'Upload any visual artwork to extract 5 dominant harmonized tones instantly.'}
              </p>
            </div>

            <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow hover:scale-105 transition-all">
              <Upload className="w-4 h-4" />
              <span>{isRtl ? 'اختيار صورة من جهازك' : 'Upload Image'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {extractedImageUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 h-48 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={extractedImageUrl}
                  alt="Extracted preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isRtl ? 'تم استخراج الألوان بنجاح في الأعمدة أدناه' : 'Extracted palette successfully into the main columns'}
                </span>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'يمكنك قفل أي لون يعجبك والضغط على توليد لتوليد درجات متوافقة معه، أو حفظ الباليت مباشرة.' : 'You can lock specific tones and hit regenerate to blend them, or save directly to your library.'}
                </p>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-40 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#f43f5e] bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all gap-2 text-slate-400 hover:text-white"
            >
              <Upload className="w-6 h-6 text-[#f43f5e]" />
              <span className="text-xs font-bold">
                {isRtl ? 'اسحب وأفلت صورة هنا أو اضغط للاستعراض' : 'Drag & drop image here or click to browse'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SAVED PALETTES LIBRARY */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {isRtl ? 'مكتبة الباليتات المحفوظة محلياً' : 'Saved Palettes Library'}
            </h3>
            <span className="text-xs text-slate-400">
              {savedPalettes.length} {isRtl ? 'باليت محفوظة' : 'saved palettes'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPalettes.map(item => (
              <div
                key={item.id}
                onClick={() => handleLoadSaved(item)}
                className="p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-[#f43f5e] cursor-pointer transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#f43f5e] transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                  </div>
                  <button
                    onClick={e => handleDeleteSaved(item.id, e)}
                    className="p-2 rounded-full text-slate-500 hover:text-rose-400 hover:bg-white/10 transition-colors"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Swatches preview bar */}
                <div className="flex h-12 rounded-xl overflow-hidden border border-white/10 shadow">
                  {item.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 transition-transform hover:scale-105"
                      style={{ backgroundColor: c.hex }}
                      title={c.hex}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">{item.colors[0].hex} → {item.colors[4].hex}</span>
                  <span className="text-[#8b5cf6] font-bold text-xs group-hover:underline">
                    {isRtl ? 'تحميل في المحرر ←' : 'Load in Studio →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN 5 PALETTE COLUMNS (Interactive Studio) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {colors.map((col, idx) => {
          const contrastWhite = getContrastRatio(col.hex, '#FFFFFF');
          const contrastBlack = getContrastRatio(col.hex, '#000000');
          const isWhiteAccessible = Number(contrastWhite) >= 4.5;

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-[24px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all hover:border-[#f43f5e]/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] group"
              id={`palette-card-${idx}`}
            >
              {/* Swatch Block */}
              <div
                className="h-48 sm:h-60 p-4 flex flex-col justify-between transition-colors duration-300 relative"
                style={{ backgroundColor: col.hex }}
              >
                {/* Top: Name & Lock Toggle */}
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-md">
                    {col.name || `Tone ${idx + 1}`}
                  </span>

                  <button
                    onClick={() => toggleLock(col.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      col.locked
                        ? 'bg-[#f43f5e] text-white shadow-lg shadow-rose-950/40'
                        : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                    title={col.locked ? (isRtl ? 'اللون مقفل' : 'Locked') : (isRtl ? 'قفل اللون' : 'Lock')}
                  >
                    {col.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Center / Color Picker Trigger */}
                <div className="self-center flex flex-col items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs font-mono font-bold backdrop-blur-md transition-all shadow-md">
                    <input
                      type="color"
                      value={col.hex}
                      onChange={e => handleColorEdit(col.id, e.target.value)}
                      className="w-0 h-0 opacity-0 absolute"
                    />
                    <Sliders className="w-3 h-3 text-[#f43f5e]" />
                    <span>{col.hex}</span>
                  </label>
                </div>

                {/* Quick Copy */}
                <button
                  onClick={() => handleCopy(col.hex, col.id)}
                  className="self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 hover:bg-black/60 text-white text-[11px] font-bold backdrop-blur-md transition-all"
                >
                  {copiedId === col.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === col.id ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ HEX' : 'Copy')}</span>
                </button>
              </div>

              {/* Specs & WCAG Accessibility Stats */}
              <div className="p-4 space-y-2.5 bg-black/30 text-right">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-bold text-white font-mono">{col.hex}</span>
                  <span className="text-[10px] uppercase font-mono text-slate-500">HEX</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>RGB({col.rgb})</span>
                </div>

                {/* Contrast Badge */}
                <div className="pt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Contrast className="w-3 h-3 text-[#8b5cf6]" />
                    <span>{isRtl ? 'التباين (أبيض)' : 'White Contrast'}</span>
                  </span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      isWhiteAccessible ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
                    }`}
                  >
                    {contrastWhite}:1 {isWhiteAccessible ? 'AA' : 'Fail'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save to Library & Palette Naming Bar */}
      <div className="p-5 rounded-[24px] border border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Bookmark className="w-5 h-5 text-[#f43f5e]" />
          <input
            type="text"
            value={paletteName}
            onChange={e => setPaletteName(e.target.value)}
            placeholder={isRtl ? 'اسم الباليت...' : 'Palette Name...'}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-[#f43f5e] w-full sm:w-64"
          />
        </div>

        <button
          onClick={handleSaveCurrentPalette}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[#0f0714] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
        >
          <Bookmark className="w-4 h-4 text-[#f43f5e]" />
          <span>{isRtl ? 'حفظ في مكتبة الألوان' : 'Save to Palette Library'}</span>
        </button>
      </div>

      {/* LIVE UI CONTEXT SIMULATOR */}
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'محاكي الواجهات المباشر (UI Context Preview)' : 'Live UI Palette Context Preview'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRtl ? 'اختبر كيف تتناغم هذه الألوان كخلفيات، نصوص، أزرار دعوة للإجراء، وبطاقات تفاعلية.' : 'Test how these tones behave as real interactive UI components and typography.'}
            </p>
          </div>
        </div>

        {/* Rendered simulated component */}
        <div
          className="rounded-[24px] p-6 sm:p-10 border transition-all duration-300 shadow-2xl"
          style={{
            backgroundColor: colors[0].hex,
            borderColor: colors[1].hex + '80',
            color: '#FFFFFF',
          }}
        >
          <div className="max-w-xl space-y-4">
            <span
              className="inline-block px-3.5 py-1 rounded-full text-xs font-bold shadow"
              style={{ backgroundColor: colors[3].hex, color: '#FFFFFF' }}
            >
              Creative UI Preview
            </span>
            <h4
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ color: colors[4].hex }}
            >
              {isRtl ? 'تناغم بصري دقيق يرفع قيمة علامتك التجارية' : 'Harmonized visual balance for modern design systems'}
            </h4>
            <p className="text-sm opacity-80 leading-relaxed">
              {isRtl
                ? 'استشعر درجات التباين والعمق بين العناصر الفاتحة والداكنة لتتأكد من ملاءمتها لتجربة المستخدم قبل التصدير.'
                : 'Preview how typography, accent chips, and action buttons look against your base tones.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="px-6 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105"
                style={{ backgroundColor: colors[3].hex, color: '#FFFFFF' }}
              >
                {isRtl ? 'الزر الرئيسي (Primary)' : 'Primary Action'}
              </button>
              <button
                className="px-5 py-2.5 rounded-full font-semibold text-sm border transition-all hover:bg-white/10"
                style={{ borderColor: colors[2].hex, color: '#FFFFFF' }}
              >
                {isRtl ? 'زر ثانوي (Secondary)' : 'Secondary Action'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT MODAL SUITE */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0f0714] p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#f43f5e]" />
                <h3 className="text-lg font-bold text-white">
                  {isRtl ? 'تصدير الباليت' : 'Export Palette'}
                </h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Export format switcher */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setExportFormat('css')}
                className={`py-2 rounded-full text-xs font-bold transition-all ${
                  exportFormat === 'css' ? 'bg-[#f43f5e] text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                CSS Variables
              </button>
              <button
                onClick={() => setExportFormat('tailwind')}
                className={`py-2 rounded-full text-xs font-bold transition-all ${
                  exportFormat === 'tailwind' ? 'bg-[#f43f5e] text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Tailwind CSS
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`py-2 rounded-full text-xs font-bold transition-all ${
                  exportFormat === 'json' ? 'bg-[#f43f5e] text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                JSON Data
              </button>
              <button
                onClick={() => setExportFormat('png')}
                className={`py-2 rounded-full text-xs font-bold transition-all ${
                  exportFormat === 'png' ? 'bg-[#8b5cf6] text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                PNG Card
              </button>
            </div>

            {/* Export Content */}
            {exportFormat !== 'png' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200 max-h-56 overflow-y-auto whitespace-pre">
                  {getExportCode()}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getExportCode());
                      showToast(isRtl ? 'تم نسخ كود التصدير' : 'Export code copied to clipboard');
                    }}
                    className="flex-1 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all"
                  >
                    {isRtl ? 'نسخ الكود' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <p className="text-xs text-slate-400">
                  {isRtl
                    ? 'توليد بطاقة صورة عالية الجودة (1200x630px) تتضمن أسماء الألوان وأكواد HEX و RGB جاهزة للعروض والمشاركة.'
                    : 'Generates a 1200x630px presentation PNG swatch card with exact HEX and RGB specs.'}
                </p>
                <button
                  onClick={handleDownloadPng}
                  className="px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all shadow-lg"
                >
                  {isRtl ? 'تنزيل بطاقة PNG الآن' : 'Download High-Res PNG Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
