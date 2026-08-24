import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UpgradeModal } from '../common/UpgradeModal';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';

// TODO: replace with the real pricing plan once it's ready.
const PAID_PLAN_PRICE_EGP = 99;
const PAID_PLAN_CREDITS_LABEL = 100;

export const PricingPage: React.FC = () => {
  const { language, user, userPlan, openAuthModal } = useApp();
  const isRtl = language === 'ar';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleUpgradeClick = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setIsUpgradeModalOpen(true);
  };

  const freeFeatures = isRtl
    ? ['استخدام غير محدود لموديل Flux', 'صورتان مجانًا من أي موديل آخر', 'كل أدوات الألوان والخطوط والمقاسات', 'مكتبة البرومبتات كاملة']
    : ['Unlimited Flux generations', '2 free images on any other model', 'Full access to Colors, Fonts & Grids tools', 'Full prompts library'];

  const paidFeatures = isRtl
    ? [
        'كل مميزات الخطة المجانية',
        `${PAID_PLAN_CREDITS_LABEL} كريدت شهريًا لموديلات GPT Image وSeedream وNano Banana`,
        'أولوية في التوليد بدون انتظار',
        'دعم فني مباشر',
      ]
    : [
        'Everything in the Free plan',
        `${PAID_PLAN_CREDITS_LABEL} monthly credits for GPT Image, Seedream & Nano Banana`,
        'Priority generation queue',
        'Direct support',
      ];

  return (
    <div className="max-w-5xl mx-auto space-y-10" id="pricing-page-root">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
          <Sparkles className="w-3.5 h-3.5" />
          {isRtl ? 'الأسعار' : 'Pricing'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {isRtl ? 'اختر الخطة المناسبة لك' : 'Choose the plan that fits you'}
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          {isRtl
            ? 'ابدأ مجانًا، ورقّي حسابك في أي وقت للحصول على مزيد من موديلات توليد الصور.'
            : 'Start free, and upgrade anytime for more image generation models.'}
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Free plan */}
        <div className="relative p-7 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
          {userPlan === 'free' && user && (
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold bg-white text-[#0f0714]">
              {isRtl ? 'خطتك الحالية' : 'Your current plan'}
            </span>
          )}
          <Zap className="w-8 h-8 text-slate-300 mb-4" />
          <h3 className="text-xl font-extrabold text-white mb-1">{isRtl ? 'مجانية' : 'Free'}</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-extrabold text-white">{isRtl ? '0 جنيه' : 'EGP 0'}</span>
            <span className="text-xs text-slate-400">/{isRtl ? 'دائمًا' : 'forever'}</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {!user && (
            <button
              onClick={openAuthModal}
              className="w-full py-3 rounded-full text-sm font-bold border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              {isRtl ? 'ابدأ مجانًا' : 'Get Started Free'}
            </button>
          )}
        </div>

        {/* Paid plan */}
        <div className="relative p-7 rounded-3xl bg-gradient-to-br from-[#f43f5e]/10 to-[#8b5cf6]/10 border-2 border-[#8b5cf6] flex flex-col overflow-hidden">
          <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white">
            {isRtl ? 'الأكثر طلبًا' : 'Most Popular'}
          </span>
          <Crown className="w-8 h-8 text-amber-300 mb-4" />
          <h3 className="text-xl font-extrabold text-white mb-1">{isRtl ? 'برو' : 'Pro'}</h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-extrabold text-white">
              {isRtl ? `${PAID_PLAN_PRICE_EGP} جنيه` : `EGP ${PAID_PLAN_PRICE_EGP}`}
            </span>
            <span className="text-xs text-slate-400">/{isRtl ? 'شهريًا' : 'month'}</span>
          </div>
          <p className="text-[10px] text-amber-300/80 font-bold mb-5">
            {isRtl ? '* سعر مبدئي، قابل للتغيير' : '* Placeholder price, subject to change'}
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {paidFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {userPlan === 'paid' && user ? (
            <div className="w-full py-3 rounded-full text-sm font-bold bg-white/10 text-white text-center">
              {isRtl ? 'أنت مشترك بالفعل ✓' : "You're already subscribed ✓"}
            </div>
          ) : (
            <button
              onClick={handleUpgradeClick}
              className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-[1.02] transition-all shadow-lg"
            >
              {isRtl ? 'ترقية الحساب' : 'Upgrade Now'}
            </button>
          )}
        </div>
      </div>

      {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />}
    </div>
  );
};
