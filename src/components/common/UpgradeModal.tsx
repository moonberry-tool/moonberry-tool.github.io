import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db, storage } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Copy, Check, Upload, Loader2, PartyPopper } from 'lucide-react';

// TODO: replace with your real Orange Cash number and registered name.
const ORANGE_CASH_NUMBER = '012 23093974;
const ORANGE_CASH_NAME = 'moonberry team';
const PAID_PLAN_PRICE_EGP = 99;

interface UpgradeModalProps {
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
  const { language, user, showToast } = useApp();
  const isRtl = language === 'ar';

  const [senderPhone, setSenderPhone] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(ORANGE_CASH_NUMBER);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!senderPhone.trim() || !screenshotFile) {
      setErrorMsg(isRtl ? 'يرجى إدخال رقمك ورفع لقطة شاشة التحويل' : 'Please enter your number and upload a payment screenshot');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const fileRef = ref(storage, `paymentProofs/${user.uid}/${Date.now()}-${screenshotFile.name}`);
      await uploadBytes(fileRef, screenshotFile);
      const screenshotUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'paymentRequests'), {
        userId: user.uid,
        userEmail: user.email,
        senderPhone: senderPhone.trim(),
        amount: PAID_PLAN_PRICE_EGP,
        screenshotUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit payment request', err);
      setErrorMsg(isRtl ? 'حدث خطأ أثناء الإرسال، حاول مرة أخرى' : 'Something went wrong, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-[#150c22] border border-white/10 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-emerald-300" />
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {isRtl ? 'تم إرسال طلبك بنجاح!' : 'Request submitted!'}
            </h3>
            <p className="text-sm text-slate-400">
              {isRtl
                ? 'هيتم مراجعة التحويل وتفعيل خطتك خلال وقت قصير. هتوصلك رسالة داخل الموقع أول ما يتفعّل.'
                : "We'll review your payment and activate your plan shortly. You'll see it reflected in your account once approved."}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {isRtl ? 'تمام' : 'Got it'}
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-extrabold text-white mb-1 mt-2">
              {isRtl ? 'ترقية الحساب عبر أورنچ كاش' : 'Upgrade via Orange Cash'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {isRtl
                ? 'حوّل المبلغ يدويًا، وارفع لقطة شاشة إثبات التحويل، وهنراجعها ونفعّل خطتك.'
                : 'Send the payment manually, upload a screenshot as proof, and we\'ll review and activate your plan.'}
            </p>

            {/* Payment instructions */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isRtl ? 'المبلغ المطلوب' : 'Amount to send'}</span>
                <span className="text-sm font-extrabold text-white">{PAID_PLAN_PRICE_EGP} {isRtl ? 'جنيه' : 'EGP'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isRtl ? 'الاسم المسجل' : 'Registered name'}</span>
                <span className="text-sm font-bold text-white">{ORANGE_CASH_NAME}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isRtl ? 'رقم أورنچ كاش' : 'Orange Cash number'}</span>
                <button
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1.5 text-sm font-extrabold text-white"
                  dir="ltr"
                >
                  {ORANGE_CASH_NUMBER}
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  {isRtl ? 'رقمك اللي حوّلت منه' : 'Your phone number (sender)'}
                </label>
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  dir="ltr"
                  className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8b5cf6] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  {isRtl ? 'لقطة شاشة إثبات التحويل' : 'Payment screenshot'}
                </label>
                <label
                  htmlFor="payment-screenshot-input"
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-black/40 border border-dashed border-white/20 text-sm text-slate-400 cursor-pointer hover:border-[#8b5cf6]/50 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span className="truncate">
                    {screenshotFile ? screenshotFile.name : isRtl ? 'اضغط لرفع الصورة' : 'Click to upload image'}
                  </span>
                </label>
                <input
                  id="payment-screenshot-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setScreenshotFile(e.target.files?.[0] || null)}
                />
              </div>

              {errorMsg && <p className="text-xs text-[#f43f5e] font-medium text-center">{errorMsg}</p>}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-[1.02] transition-all disabled:opacity-60 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{isRtl ? 'إرسال للمراجعة' : 'Submit for review'}</span>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
