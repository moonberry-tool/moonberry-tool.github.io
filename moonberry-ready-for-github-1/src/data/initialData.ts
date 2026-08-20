import { GridFormat, PromptCategory, PromptItem, FontPairingPreset } from '../types';

export const INITIAL_PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'all', name: 'All Prompts', nameAr: 'جميع البرومبتات', slug: 'all', count: 24 },
  { id: 'portrait', name: 'Portrait & Character', nameAr: 'بورتريه وشخصيات', slug: 'portrait', count: 6 },
  { id: 'product', name: 'Product & Mockup', nameAr: 'منتجات وموك أب', slug: 'product', count: 5 },
  { id: '3d-abstract', name: '3D & Abstract Art', nameAr: 'ثلاثي الأبعاد وتجريدي', slug: '3d-abstract', count: 4 },
  { id: 'luxury', name: 'Luxury & Fashion', nameAr: 'فخامة وأزياء', slug: 'luxury', count: 3 },
  { id: 'architecture', name: 'Architecture & Interior', nameAr: 'معمار وديكور', slug: 'architecture', count: 3 },
  { id: 'cinematic', name: 'Cinematic & Background', nameAr: 'سينمائي وخلفيات', slug: 'cinematic', count: 3 },
];

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'p-1',
    title: 'Futuristic Studio Portrait with Soft Magenta & Indigo Rim Lighting',
    description: 'إضاءة محيطية سينمائية بلون الماجينتا والنيلي مع تفاصيل فائقة الدقة لملامح الوجه والخلفية المظلمة.',
    prompt: 'Editorial studio portrait of a futuristic fashion model, soft magenta and deep indigo rim lighting, high-fashion styling, hyper-realistic skin texture, 8k resolution, captured on 85mm lens, f/1.4 aperture, cinematic atmosphere, clean deep navy backdrop --ar 4:5 --v 6.0 --style raw',
    categoryId: 'portrait',
    categoryName: 'Portrait & Character',
    previewImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    featured: true,
    createdAt: '2026-08-10',
    tags: ['portrait', 'fashion', 'lighting', 'studio']
  },
  {
    id: 'p-2',
    title: 'Minimalist Matte Ceramic Cosmetic Bottle on Floating Pedestal',
    description: 'موك أب عالي الدقة لعلبة مستحضرات تجميل على منصة رخامية عائمة مع ظلال ناعمة وإضاءة استوديو دافئة.',
    prompt: 'Minimalist luxury cosmetic packaging mockup, matte frosted lilac bottle on a floating stone travertine podium, gentle sunlight casting geometric architectural shadows, studio photography, Hasselblad H6D-100c, clean neutral beige and soft purple aesthetic, photorealistic 8k --ar 1:1 --v 6.0',
    categoryId: 'product',
    categoryName: 'Product & Mockup',
    previewImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    featured: true,
    createdAt: '2026-08-12',
    tags: ['product', 'mockup', 'cosmetics', 'packaging']
  },
  {
    id: 'p-3',
    title: 'Iridescent 3D Fluid Glass Ribbon Floating in Dark Space',
    description: 'أشكال ثلاثية الأبعاد سائلة من الزجاج المتقزح بألوان متدرجة تعكس الضوء في فراغ داكن وأنيق.',
    prompt: 'Abstract 3D iridescent fluid ribbon, chromatic glass refraction, glowing violet and warm peach gradients, floating gracefully in deep space, volumetric soft lighting, Octane render, raytracing, ultra clean smooth surfaces, wallpaper aesthetic --ar 16:9 --v 6.0',
    categoryId: '3d-abstract',
    categoryName: '3D & Abstract Art',
    previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    featured: true,
    createdAt: '2026-08-14',
    tags: ['3d', 'abstract', 'glass', 'iridescent']
  },
  {
    id: 'p-4',
    title: 'Brutalist Concrete Pavilion with Curved Glass & Warm Sunset Rays',
    description: 'تصميم معماري معاصر بكتل خرسانية ونوافذ زجاجية منحنية تتخللها أشعة الشمس الدافئة.',
    prompt: 'Modern brutalist architectural interior with monolithic smooth concrete pillars, oversized floor-to-ceiling curved glass wall overlooking tranquil desert dunes, golden hour sunset rays casting long warm shadows, architectural digest feature, photorealistic --ar 16:9 --v 6.0',
    categoryId: 'architecture',
    categoryName: 'Architecture & Interior',
    previewImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    createdAt: '2026-08-15',
    tags: ['architecture', 'interior', 'sunset', 'minimal']
  },
  {
    id: 'p-5',
    title: 'High Jewelry Diamond Ring in Dark Velvet Spotlight',
    description: 'تصوير احترافي لقطعة مجوهرات فاخرة مع انعكاسات ضوئية على خلفية مخملية داكنة.',
    prompt: 'Macro luxury jewelry photography, exquisite platinum ring with pear-cut purple tanzanite and sparkling diamonds, resting on deep dark velvet, soft circular spotlight, macro focus, crisp diamond fire sparkle, high-end commercial ad look --ar 1:1 --v 6.0',
    categoryId: 'luxury',
    categoryName: 'Luxury & Fashion',
    previewImageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    featured: true,
    createdAt: '2026-08-16',
    tags: ['luxury', 'jewelry', 'commercial', 'macro']
  },
  {
    id: 'p-6',
    title: 'Neon Cyberpunk Urban Alleyway with Rain Puddle Reflections',
    description: 'مشهد سينمائي لشارع مستقبلي بهطول أمطار وانعكاسات أضواء النيون البنفسجية والوردية.',
    prompt: 'Cinematic widescreen shot of a futuristic metropolis alleyway at night, wet asphalt with glowing puddle reflections of purple and pink holographic neon signs, volumetric steam rising from street grates, blade runner mood, 35mm film grain, atmospheric masterpiece --ar 16:9 --v 6.0',
    categoryId: 'cinematic',
    categoryName: 'Cinematic & Background',
    previewImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    featured: false,
    createdAt: '2026-08-17',
    tags: ['cinematic', 'neon', 'cyberpunk', 'background']
  }
];

export const INITIAL_GRID_FORMATS: GridFormat[] = [
  // Social Media
  {
    id: 'ig-post-square',
    category: 'social',
    categoryLabelAr: 'منصات التواصل',
    categoryLabelEn: 'Social Media',
    platform: 'Instagram',
    title: 'Instagram Post (Square)',
    width: 1080,
    height: 1080,
    unit: 'px',
    aspectRatio: '1:1',
    safeAreaMargin: { top: 60, right: 60, bottom: 60, left: 60 },
    description: 'Standard 1:1 square post for Instagram feed.',
    descriptionAr: 'المقاس المربع الكلاسيكي لتغذية إنستغرام بدون أي اقتطاع.'
  },
  {
    id: 'ig-post-portrait',
    category: 'social',
    categoryLabelAr: 'منصات التواصل',
    categoryLabelEn: 'Social Media',
    platform: 'Instagram',
    title: 'Instagram Post (Portrait 4:5)',
    width: 1080,
    height: 1350,
    unit: 'px',
    aspectRatio: '4:5',
    safeAreaMargin: { top: 80, right: 60, bottom: 80, left: 60 },
    description: 'Vertical feed post occupying maximum vertical screen space.',
    descriptionAr: 'المقاس الرأسي الأمثل لأعلى نسبة ظهور وتفاعل في إنستغرام.'
  },
  {
    id: 'ig-story-reels',
    category: 'social',
    categoryLabelAr: 'منصات التواصل',
    categoryLabelEn: 'Social Media',
    platform: 'Instagram / TikTok',
    title: 'Story & Reels / TikTok (9:16)',
    width: 1080,
    height: 1920,
    unit: 'px',
    aspectRatio: '9:16',
    safeAreaMargin: { top: 220, right: 90, bottom: 320, left: 90 },
    description: 'Full screen vertical video and story format with header & footer safe zones.',
    descriptionAr: 'ستوري وريلز وتيك توك مع احتساب مناطق أزرار الواجهة والنصوص السفلية.'
  },
  {
    id: 'yt-thumbnail',
    category: 'social',
    categoryLabelAr: 'منصات التواصل',
    categoryLabelEn: 'Social Media',
    platform: 'YouTube',
    title: 'YouTube Thumbnail (16:9)',
    width: 1280,
    height: 720,
    unit: 'px',
    aspectRatio: '16:9',
    safeAreaMargin: { top: 40, right: 180, bottom: 120, left: 40 },
    description: 'Video cover thumbnail with safe area excluding bottom right duration badge.',
    descriptionAr: 'صورة مصغرة لليوتيوب مع مراعاة منطقة مؤقت الفيديو في الركن السفلي.'
  },
  {
    id: 'x-post',
    category: 'social',
    categoryLabelAr: 'منصات التواصل',
    categoryLabelEn: 'Social Media',
    platform: 'X (Twitter)',
    title: 'X Feed Image (16:9)',
    width: 1200,
    height: 675,
    unit: 'px',
    aspectRatio: '16:9',
    safeAreaMargin: { top: 40, right: 40, bottom: 40, left: 40 },
    description: 'Optimal resolution for in-stream image preview on X timeline.',
    descriptionAr: 'المقاس الموصى به للمنشورات المصورة في منصة إكس.'
  },
  {
    id: 'linkedin-banner',
    category: 'social',
    categoryLabelAr: 'منصات التواصل',
    categoryLabelEn: 'Social Media',
    platform: 'LinkedIn',
    title: 'LinkedIn Company Banner',
    width: 1128,
    height: 191,
    unit: 'px',
    aspectRatio: '5.9:1',
    safeAreaMargin: { top: 20, right: 60, bottom: 20, left: 240 },
    description: 'Cover header banner accounting for left avatar placement.',
    descriptionAr: 'غلاف الحساب أو الصفحة مع ترك مساحة صورة الملف الشخصي.'
  },

  // Print
  {
    id: 'print-a4',
    category: 'print',
    categoryLabelAr: 'المطبوعات',
    categoryLabelEn: 'Print',
    platform: 'International Print',
    title: 'A4 Document / Flyer',
    width: 2480,
    height: 3508,
    unit: 'px',
    aspectRatio: '1:1.414',
    safeAreaMargin: { top: 120, right: 120, bottom: 120, left: 120 },
    description: '210 × 297 mm at 300 DPI with 3mm bleed safe margins.',
    descriptionAr: 'مقاس A4 القياسي للمطبوعات والبروشورات بجودة 300 DPI مع هامش القص.'
  },
  {
    id: 'print-business-card',
    category: 'print',
    categoryLabelAr: 'المطبوعات',
    categoryLabelEn: 'Print',
    platform: 'Stationery',
    title: 'Standard Business Card (85 × 55 mm)',
    width: 1004,
    height: 650,
    unit: 'px',
    aspectRatio: '1.54:1',
    safeAreaMargin: { top: 60, right: 60, bottom: 60, left: 60 },
    description: 'Standard business card at 300 DPI with 3mm safety margin for typography.',
    descriptionAr: 'كارت عمل قياسي بجودة طباعة 300 DPI وهوامش أمان للنصوص.'
  },
  {
    id: 'print-poster-a3',
    category: 'print',
    categoryLabelAr: 'المطبوعات',
    categoryLabelEn: 'Print',
    platform: 'Poster Print',
    title: 'A3 Poster (297 × 420 mm)',
    width: 3508,
    height: 4960,
    unit: 'px',
    aspectRatio: '1:1.414',
    safeAreaMargin: { top: 180, right: 180, bottom: 180, left: 180 },
    description: 'Large format A3 poster for events and advertising displays.',
    descriptionAr: 'بوستر بحجم A3 للمعارض والإعلانات بجودة طباعة كاملة.'
  },

  // Video
  {
    id: 'video-4k-uhd',
    category: 'video',
    categoryLabelAr: 'الفيديو والموشن',
    categoryLabelEn: 'Video & Motion',
    platform: 'Video 4K',
    title: '4K UHD Video (16:9)',
    width: 3840,
    height: 2160,
    unit: 'px',
    aspectRatio: '16:9',
    safeAreaMargin: { top: 216, right: 384, bottom: 216, left: 384 },
    description: '3840 × 2160 with 90% title-safe action zones.',
    descriptionAr: 'دقة 4K فائقة الوضوح مع منطقة أمان النصوص والعناوين 90%.'
  },
  {
    id: 'video-fhd',
    category: 'video',
    categoryLabelAr: 'الفيديو والموشن',
    categoryLabelEn: 'Video & Motion',
    platform: 'Video 1080p',
    title: 'Full HD 1080p (16:9)',
    width: 1920,
    height: 1080,
    unit: 'px',
    aspectRatio: '16:9',
    safeAreaMargin: { top: 108, right: 192, bottom: 108, left: 192 },
    description: '1920 × 1080 broadcast standard safe boundaries.',
    descriptionAr: 'المقاس الأكثر استخداماً في المونتاج والموشن جرافيكس.'
  }
];

export const INITIAL_FONT_PAIRINGS: FontPairingPreset[] = [
  {
    id: 'pair-1',
    name: 'Modern Neo-Arabic & Geometric Sans',
    category: 'Arabic Contemporary',
    languageSupport: 'Bilingual',
    display: 'Alexandria',
    heading: 'Alexandria',
    body: 'Cairo',
    small: 'Cairo'
  },
  {
    id: 'pair-2',
    name: 'Tech Minimalist & Clean Sans',
    category: 'Tech Minimal',
    languageSupport: 'English',
    display: 'Outfit',
    heading: 'Outfit',
    body: 'Plus Jakarta Sans',
    small: 'Plus Jakarta Sans'
  },
  {
    id: 'pair-3',
    name: 'Editorial Luxury & Refined Typography',
    category: 'Editorial',
    languageSupport: 'Bilingual',
    display: 'Alexandria',
    heading: 'Outfit',
    body: 'Cairo',
    small: 'Plus Jakarta Sans'
  }
];

export const INITIAL_PALETTES = [
  {
    name: 'Moonberry Signature',
    colors: [
      { id: 'c1', hex: '#0B0C1A', rgb: 'rgb(11, 12, 26)', hsl: 'hsl(236, 41%, 7%)', locked: false, name: 'Deep Space Navy' },
      { id: 'c2', hex: '#3B0764', rgb: 'rgb(59, 7, 100)', hsl: 'hsl(274, 87%, 21%)', locked: false, name: 'Royal Plum' },
      { id: 'c3', hex: '#7B2CBF', rgb: 'rgb(123, 44, 191)', hsl: 'hsl(272, 63%, 46%)', locked: false, name: 'Moonberry Violet' },
      { id: 'c4', hex: '#F472B6', rgb: 'rgb(244, 114, 182)', hsl: 'hsl(329, 86%, 70%)', locked: false, name: 'Berry Magenta' },
      { id: 'c5', hex: '#FDE047', rgb: 'rgb(253, 224, 71)', hsl: 'hsl(50, 98%, 64%)', locked: false, name: 'Crescent Gold' }
    ]
  },
  {
    name: 'Cyber Lavender',
    colors: [
      { id: 'c1', hex: '#0F172A', rgb: 'rgb(15, 23, 42)', hsl: 'hsl(222, 47%, 11%)', locked: false, name: 'Midnight Slate' },
      { id: 'c2', hex: '#6366F1', rgb: 'rgb(99, 102, 241)', hsl: 'hsl(239, 84%, 67%)', locked: false, name: 'Electric Indigo' },
      { id: 'c3', hex: '#A855F7', rgb: 'rgb(168, 85, 247)', hsl: 'hsl(271, 91%, 65%)', locked: false, name: 'Neon Purple' },
      { id: 'c4', hex: '#C084FC', rgb: 'rgb(192, 132, 252)', hsl: 'hsl(270, 95%, 75%)', locked: false, name: 'Soft Lavender' },
      { id: 'c5', hex: '#FAF5FF', rgb: 'rgb(250, 245, 255)', hsl: 'hsl(270, 100%, 98%)', locked: false, name: 'Pure Lilac Mist' }
    ]
  }
];
