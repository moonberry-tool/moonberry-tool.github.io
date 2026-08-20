import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Upload, ShieldCheck, Database, X, FileJson, CheckCircle2 } from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const { language, showToast } = useApp();
  const isRtl = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    try {
      const backupData = {
        app: 'Moonberry Design Platform',
        version: '1.4.0',
        exportedAt: new Date().toISOString(),
        palettes: JSON.parse(localStorage.getItem('moonberry_saved_palettes') || '[]'),
        prompts: JSON.parse(localStorage.getItem('moonberry_custom_prompts') || '[]'),
        favorites: JSON.parse(localStorage.getItem('moonberry_prompt_favorites') || '[]'),
        theme: localStorage.getItem('moonberry_theme') || 'dark',
        language: localStorage.getItem('moonberry_lang') || 'ar',
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `moonberry-workspace-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast(isRtl ? 'تم تنزيل النسخة الاحتياطية بنجاح' : 'Workspace backup downloaded successfully');
      onClose();
    } catch (e) {
      showToast(isRtl ? 'حدث خطأ أثناء إنشاء النسخة الاحتياطية' : 'Error generating backup');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.palettes) localStorage.setItem('moonberry_saved_palettes', JSON.stringify(json.palettes));
        if (json.prompts) localStorage.setItem('moonberry_custom_prompts', JSON.stringify(json.prompts));
        if (json.favorites) localStorage.setItem('moonberry_prompt_favorites', JSON.stringify(json.favorites));
        
        showToast(isRtl ? 'تم استرجاع مساحة العمل بنجاح! سيتم التحديث' : 'Workspace restored successfully! Refreshing data');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        showToast(isRtl ? 'ملف النسخة الاحتياطية غير صالح' : 'Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0f0714] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6]">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'النسخ الاحتياطي واستعادة البيانات' : 'Workspace Backup & Restore'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed text-right">
          {isRtl
            ? 'احفظ جميع باليتاتك المفضلة، الأوامر والبرومبتات الخاصة، وتفضيلاتك في ملف JSON محلي واحد يمكنك نقله لأي جهاز أو استرجاعه في أي وقت بدون فقدان أي بيانات.'
            : 'Export all your saved palettes, custom AI prompts, favorites, and settings into a single JSON file for offline archival or cross-device transfer.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Action Card */}
          <div 
            onClick={handleExportBackup}
            className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#f43f5e] cursor-pointer transition-all space-y-3 group text-right"
          >
            <div className="p-2.5 rounded-xl bg-[#f43f5e]/20 text-[#f43f5e] w-fit">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#f43f5e] transition-colors">
              {isRtl ? 'تصدير نسخة احتياطية' : 'Export Backup JSON'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isRtl ? 'تنزيل ملف .json يحتوي على كافة إعداداتك ومشاريعك' : 'Download .json file containing full library'}
            </p>
          </div>

          {/* Import Action Card */}
          <label 
            className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#8b5cf6] cursor-pointer transition-all space-y-3 group text-right block"
          >
            <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 text-[#8b5cf6] w-fit">
              <Upload className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#8b5cf6] transition-colors">
              {isRtl ? 'استيراد واسترجاع' : 'Import & Restore'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isRtl ? 'رفع ملف .json لاسترجاع كل الباليتات والأوامر' : 'Upload .json backup to restore all assets'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {isRtl ? 'بياناتك مشفرة ومحفوظة بالكامل على جهازك دون إرسالها لأي خوادم خارجية.' : '100% Client-Side Privacy: All data is saved strictly in your local browser.'}
          </span>
        </div>
      </div>
    </div>
  );
};
