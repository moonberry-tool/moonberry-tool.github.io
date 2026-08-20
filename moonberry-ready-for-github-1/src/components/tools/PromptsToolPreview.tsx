import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_PROMPTS, INITIAL_PROMPT_CATEGORIES } from '../../data/initialData';
import { PromptItem } from '../../types';
import { 
  Sparkles, 
  Search, 
  Copy, 
  Check, 
  Tag, 
  Heart,
  Sliders,
  Plus,
  X,
  Layers,
  Wand2,
  Bookmark
} from 'lucide-react';

export const PromptsToolPreview: React.FC = () => {
  const { language, showToast } = useApp();
  const isRtl = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'builder' | 'favorites'>('library');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('--ar 16:9');
  
  // Prompt Builder State
  const [builderSubject, setBuilderSubject] = useState<string>('Luxury perfume bottle on dark reflective glass');
  const [builderLighting, setBuilderLighting] = useState<string>('soft magenta & cyan rim lighting, volumetric soft studio glows');
  const [builderCamera, setBuilderCamera] = useState<string>('85mm prime lens, f/1.4 shallow depth of field');
  const [builderEngine, setBuilderEngine] = useState<string>('Octane Render, photorealistic 8k, raytracing');
  const [builderStyle, setBuilderStyle] = useState<string>('Editorial luxury advertisement style, ultra-detailed texture');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('moonberry_prompt_favorites');
      return stored ? JSON.parse(stored) : ['p-1', 'p-2'];
    } catch {
      return ['p-1', 'p-2'];
    }
  });

  // Custom User Prompts
  const [userPrompts, setUserPrompts] = useState<PromptItem[]>(() => {
    try {
      const stored = localStorage.getItem('moonberry_custom_prompts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal for adding a new prompt
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newCategory, setNewCategory] = useState('product');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('moonberry_prompt_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('moonberry_custom_prompts', JSON.stringify(userPrompts));
    } catch {
      // ignore
    }
  }, [userPrompts]);

  const allPromptsList = [...userPrompts, ...INITIAL_PROMPTS];

  const filteredPrompts = allPromptsList.filter(item => {
    if (activeTab === 'favorites') {
      if (!favorites.includes(item.id)) return false;
    }
    const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(f => f !== id) : [...prev, id];
      showToast(exists ? (isRtl ? 'تمت الإزالة من المفضلة' : 'Removed from favorites') : (isRtl ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites'));
      return updated;
    });
  };

  const handleCopyPrompt = (basePrompt: string, id: string) => {
    // Append or replace aspect ratio if selected
    const fullPrompt = `${basePrompt.replace(/--ar\s+\d+:\d+/g, '')} ${selectedAspectRatio}`.trim();
    navigator.clipboard.writeText(fullPrompt);
    setCopiedId(id);
    showToast(isRtl ? `تم نسخ البرومبت مع نسبة (${selectedAspectRatio})` : `Copied prompt with ${selectedAspectRatio}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCreateCustomPrompt = () => {
    if (!newTitle.trim() || !newPromptText.trim()) {
      showToast(isRtl ? 'يرجى إدخال العنوان ونص البرومبت' : 'Please provide title and prompt');
      return;
    }

    const newPrompt: PromptItem = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim() || 'برومبت مخصص بواسطة المستخدم',
      prompt: newPromptText.trim(),
      categoryId: newCategory,
      categoryName: INITIAL_PROMPT_CATEGORIES.find(c => c.id === newCategory)?.name || 'Custom',
      previewImageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };

    setUserPrompts(prev => [newPrompt, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewPromptText('');
    setNewImageUrl('');
    showToast(isRtl ? 'تمت إضافة البرومبت إلى مكتبتك بنجاح' : 'Custom prompt added to your library');
  };

  const compiledBuilderPrompt = `${builderSubject}, ${builderLighting}, ${builderCamera}, ${builderStyle}, ${builderEngine} ${selectedAspectRatio} --v 6.0 --style raw`;

  return (
    <div className="space-y-8" id="prompts-tool-view">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-2xl bg-[#f43f5e]/20 text-[#f43f5e] shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl ? 'استوديو ومكتبة البرومبتات للمصممين' : 'Curated Prompts & AI Studio'}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {isRtl
              ? 'مكتبة أوامر إبداعية ومولد برومبتات ذكي لإنتاج عناصر بصرية، موك آب منتجات، وإضاءات سينمائية.'
              : 'Curated high-yield Midjourney & Flux prompts formatted specifically for graphic designers with studio builder.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 px-2 hidden sm:inline">AR:</span>
            {['--ar 1:1', '--ar 16:9', '--ar 9:16', '--ar 4:5'].map(ar => (
              <button
                key={ar}
                onClick={() => setSelectedAspectRatio(ar)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  selectedAspectRatio === ar ? 'bg-white text-[#0f0714] shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ar.replace('--ar ', '')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة برومبت' : 'Add Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Library, Studio Builder, Favorites */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المكتبة الشاملة' : 'Prompt Library'}</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'builder'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المولد الذكي (Builder)' : 'Studio Builder'}</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>
              {isRtl ? 'المفضلة' : 'Favorites'} ({favorites.length})
            </span>
          </button>
        </div>

        {/* Search Field (when in library/favorites) */}
        {activeTab !== 'builder' && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث في البرومبتات...' : 'Search prompts...'}
              className="w-full pl-4 pr-11 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#f43f5e]"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: PROMPT STUDIO BUILDER */}
      {activeTab === 'builder' && (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#f43f5e]" />
              <span>{isRtl ? 'مولد ومعدل الأوامر الاحترافي (Prompt Formula Studio)' : 'Prompt Formula Studio'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl ? 'قم بتركيب عناصر الإضاءة، الكاميرا، ونوع الريندر بضغطة زر واحدة لتوليد نتيجة سينمائية خالية من العشوائية.' : 'Combine lighting formulas, focal lenses, and render engines to construct production-ready Midjourney & Flux prompts.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? '1. الموضوع الرئيسي (Subject):' : '1. Core Subject:'}
              </label>
              <input
                type="text"
                value={builderSubject}
                onChange={e => setBuilderSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#f43f5e]"
              />
            </div>

            {/* Lighting Formula */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? '2. الإضاءة والأجواء (Lighting & Atmosphere):' : '2. Lighting Formula:'}
              </label>
              <select
                value={builderLighting}
                onChange={e => setBuilderLighting(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f0714] border border-white/10 text-white text-xs focus:outline-none focus:border-[#f43f5e]"
              >
                <option value="soft magenta & cyan rim lighting, volumetric soft studio glows">
                  Neon Cyberpunk / Violet Glow
                </option>
                <option value="warm golden hour sunbeams, soft geometric travertine shadows">
                  Warm Golden Hour & Travertine Shadows
                </option>
                <option value="circular dark velvet spotlight, moody chiaroscuro lighting">
                  Dark Velvet Luxury Spotlight
                </option>
                <option value="diffused softbox studio lighting, clean neutral shadows">
                  Clean Neutral Commercial Studio
                </option>
              </select>
            </div>

            {/* Camera & Lens */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? '3. الكاميرا والعدسة (Camera & Focal Lens):' : '3. Camera & Lens:'}
              </label>
              <select
                value={builderCamera}
                onChange={e => setBuilderCamera(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f0714] border border-white/10 text-white text-xs focus:outline-none focus:border-[#f43f5e]"
              >
                <option value="85mm prime lens, f/1.4 shallow depth of field">
                  85mm f/1.4 (Shallow Depth of Field / Portrait)
                </option>
                <option value="Hasselblad H6D-100c medium format, macro crisp focus">
                  Hasselblad Macro (Commercial Ultra-Sharp)
                </option>
                <option value="35mm cinematic anamorphic lens, subtle film grain">
                  35mm Anamorphic (Cinematic Movie Frame)
                </option>
              </select>
            </div>

            {/* Render Engine & Quality */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isRtl ? '4. محرك الريندر والأسلوب (Engine & Style):' : '4. Render Engine:'}
              </label>
              <select
                value={builderEngine}
                onChange={e => setBuilderEngine(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f0714] border border-white/10 text-white text-xs focus:outline-none focus:border-[#f43f5e]"
              >
                <option value="Octane Render, photorealistic 8k, raytracing">
                  Octane Render (Glass & 3D Lighting)
                </option>
                <option value="Unreal Engine 5 lumen lighting, photorealistic materials">
                  Unreal Engine 5 (Atmospheric Architecture)
                </option>
                <option value="High-end editorial photoshoot, natural raw textures">
                  Editorial Photography (Raw Authentic Look)
                </option>
              </select>
            </div>
          </div>

          {/* Compiled Output Box */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>{isRtl ? 'البرومبت المولد الجاهز للنسخ:' : 'Compiled Final Prompt Formula:'}</span>
              <span className="font-mono text-[#f43f5e]">{selectedAspectRatio}</span>
            </div>

            <p className="font-mono text-xs text-slate-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5" dir="ltr">
              {compiledBuilderPrompt}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(compiledBuilderPrompt);
                  showToast(isRtl ? 'تم نسخ البرومبت المركب' : 'Copied compiled formula prompt');
                }}
                className="flex-1 py-3 rounded-full font-bold text-xs bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                {isRtl ? 'نسخ البرومبت بالكامل' : 'Copy Compiled Prompt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CATEGORY FILTER PILLS (For Library & Favorites) */}
      {activeTab !== 'builder' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INITIAL_PROMPT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-md'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{isRtl ? cat.nameAr : cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* VIEW 3: PROMPTS GRID (Library / Favorites) */}
      {activeTab !== 'builder' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map(item => {
            const isFavorited = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-[28px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:border-[#f43f5e]/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] transition-all duration-200 group"
                id={`prompt-card-${item.id}`}
              >
                <div>
                  {/* Card Preview Image */}
                  <div className="relative h-56 w-full bg-black overflow-hidden">
                    <img
                      src={item.previewImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Top Category Badge */}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/60 text-[#f43f5e] backdrop-blur-md border border-white/10">
                      {item.categoryName}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={e => toggleFavorite(item.id, e)}
                      className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isFavorited ? 'bg-[#f43f5e] text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 text-right">
                    <h3 className="font-bold text-sm text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* English Prompt Snippet */}
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-left" dir="ltr">
                      <p className="font-mono text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Copy Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleCopyPrompt(item.prompt, item.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-xs bg-white text-[#0f0714] hover:bg-[#f43f5e] hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    id={`copy-prompt-${item.id}`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isRtl ? `نسخ البرومبت (${selectedAspectRatio})` : `Copy (${selectedAspectRatio})`}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADD CUSTOM PROMPT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0f0714] p-6 sm:p-8 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {isRtl ? 'إضافة برومبت مخصص جديد' : 'Add Custom Designer Prompt'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'العنوان:' : 'Title:'}</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Minimal Matte Cosmetic Bottle Mockup"
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#f43f5e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'الوصف بالعربية:' : 'Arabic Description:'}</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="وصف مختصر للنتيجة البصرية..."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#f43f5e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'نص البرومبت بالإنجليزية:' : 'English Prompt Text:'}</label>
                <textarea
                  rows={3}
                  value={newPromptText}
                  onChange={e => setNewPromptText(e.target.value)}
                  placeholder="Editorial lighting, 8k resolution, photorealistic..."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#f43f5e]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'رابط صورة المعاينة (اختياري):' : 'Image URL (optional):'}</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#f43f5e]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateCustomPrompt}
                className="w-full py-3 rounded-full font-bold text-xs bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-105 transition-all shadow-lg"
              >
                {isRtl ? 'حفظ البرومبت في مكتبتي' : 'Save Custom Prompt'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
