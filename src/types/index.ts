export type ThemeMode = 'dark' | 'light';
export type Language = 'ar' | 'en';
export type ActiveTool = 'colors' | 'fonts' | 'grid' | 'prompts' | 'settings' | 'admin';
export type ViewMode = 'landing' | 'app';

export interface ColorItem {
  id: string;
  hex: string;
  rgb: string;
  hsl: string;
  locked: boolean;
  name?: string;
}

export type ColorHarmonyType = 
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic';

export interface FontLevel {
  role: 'display' | 'heading' | 'body' | 'small';
  roleNameAr: string;
  roleNameEn: string;
  fontName: string;
  weight: string;
  fontSize: string;
  lineHeight: string;
  sampleTextAr: string;
  sampleTextEn: string;
  locked?: boolean;
}

export interface FontPairingPreset {
  id: string;
  name: string;
  category: 'Modern' | 'Classic' | 'Arabic Contemporary' | 'Editorial' | 'Tech Minimal';
  languageSupport: 'Arabic' | 'English' | 'Bilingual';
  display: string;
  heading: string;
  body: string;
  small: string;
}

export interface GridFormat {
  id: string;
  category: 'social' | 'print' | 'video';
  categoryLabelAr: string;
  categoryLabelEn: string;
  platform: string;
  title: string;
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'in';
  aspectRatio: string;
  safeAreaMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  description: string;
  descriptionAr: string;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: ColorItem[];
  createdAt: string;
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  prompt: string;
  categoryId: string;
  categoryName: string;
  previewImageUrl: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  isCustom?: boolean;
}

export interface PromptCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  count: number;
}
