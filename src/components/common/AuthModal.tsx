import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, User, Loader2, Chrome } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export const AuthModal: React.FC = () => {
  const { language, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail } = useApp();
  const isRtl = language === 'ar';

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const translateFirebaseError = (code: string): string => {
    const map: Record<string, { ar: string; en: string }> = {
      'auth/email-already-in-use': { ar: 'الإيميل ده مستخدم بالفعل، جرب تسجيل الدخول بدل الإنشاء', en: 'This email is already in use — try logging in instead' },
      'auth/invalid-email': { ar: 'صيغة الإيميل غير صحيحة', en: 'Invalid email format' },
      'auth/weak-password': { ar: 'كلمة السر ضعيفة، لازم تكون 6 أحرف على الأقل', en: 'Password is too weak — at least 6 characters' },
      'auth/invalid-credential': { ar: 'الإيميل أو كلمة السر غير صحيحة', en: 'Incorrect email or password' },
      'auth/user-not-found': { ar: 'مفيش حساب بالإيميل ده', en: 'No account found with this email' },
      'auth/wrong-password': { ar: 'كلمة السر غير صحيحة', en: 'Incorrect password' },
      'auth/popup-closed-by-user': { ar: 'اتقفلت نافذة جوجل قبل ما تخلص', en: 'Google sign-in window was closed' },
    };
    const entry = map[code];
    if (entry) return isRtl ? entry.ar : entry.en;
    return isRtl ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong, please try again';
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg(isRtl ? 'يرجى ملء كل الحقول' : 'Please fill in all fields');
      return;
    }
    if (mode === 'signup' && !displayName.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال اسمك' : 'Please enter your name');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, displayName.trim());
      }
    } catch (err: any) {
      setErrorMsg(translateFirebaseError(err?.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(translateFirebaseError(err?.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={closeAuthModal}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-[#150c22] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          id="auth-modal-close-button"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full mb-6 mt-2">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'login' ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white' : 'text-slate-400'
            }`}
          >
            {isRtl ? 'تسجيل الدخول' : 'Login'}
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'signup' ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white' : 'text-slate-400'
            }`}
          >
            {isRtl ? 'حساب جديد' : 'Sign Up'}
          </button>
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogle}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-bold bg-white text-[#0f0714] hover:scale-[1.02] transition-all disabled:opacity-60 mb-4"
        >
          <Chrome className="w-4 h-4" />
          <span>{isRtl ? 'الدخول بحساب جوجل' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">{isRtl ? 'أو' : 'or'}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <div className="space-y-3">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ltr:left-3.5 rtl:right-3.5" />
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={isRtl ? 'الاسم' : 'Name'}
                className="w-full py-3 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8b5cf6] text-sm"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ltr:left-3.5 rtl:right-3.5" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isRtl ? 'البريد الإلكتروني' : 'Email'}
              className="w-full py-3 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8b5cf6] text-sm"
              dir="ltr"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 ltr:left-3.5 rtl:right-3.5" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isRtl ? 'كلمة السر' : 'Password'}
              className="w-full py-3 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8b5cf6] text-sm"
              dir="ltr"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-[#f43f5e] font-medium text-center">{errorMsg}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white hover:scale-[1.02] transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{mode === 'login' ? (isRtl ? 'دخول' : 'Log In') : (isRtl ? 'إنشاء الحساب' : 'Create Account')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

