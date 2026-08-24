import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { ShieldCheck, ShieldAlert, Check, X, Loader2, ExternalLink } from 'lucide-react';

// TODO: keep this in sync with the placeholder in AppContext.tsx until the real plan is set.
const PAID_PLAN_CREDITS = 100;

interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  senderPhone: string;
  amount: number;
  screenshotBase64: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export const AdminPanel: React.FC = () => {
  const { language, isAdmin, showToast } = useApp();
  const isRtl = language === 'ar';

  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'paymentRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetched: PaymentRequest[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRequest));
      setRequests(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const handleApprove = async (req: PaymentRequest) => {
    setProcessingId(req.id);
    try {
      await updateDoc(doc(db, 'users', req.userId), {
        plan: 'paid',
        credits: increment(PAID_PLAN_CREDITS),
      });
      await updateDoc(doc(db, 'paymentRequests', req.id), { status: 'approved' });
      showToast(isRtl ? 'تمت الموافقة وتفعيل الخطة' : 'Approved and plan activated');
    } catch (err) {
      console.error(err);
      showToast(isRtl ? 'حدث خطأ أثناء الموافقة' : 'Something went wrong approving this');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: PaymentRequest) => {
    setProcessingId(req.id);
    try {
      await updateDoc(doc(db, 'paymentRequests', req.id), { status: 'rejected' });
      showToast(isRtl ? 'تم رفض الطلب' : 'Request rejected');
    } catch (err) {
      console.error(err);
      showToast(isRtl ? 'حدث خطأ أثناء الرفض' : 'Something went wrong rejecting this');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <ShieldAlert className="w-10 h-10 text-[#f43f5e]" />
        <h2 className="text-lg font-extrabold text-white">
          {isRtl ? 'مفيش صلاحية دخول' : 'Access denied'}
        </h2>
        <p className="text-sm text-slate-400">
          {isRtl ? 'الصفحة دي مخصصة للمدير بس.' : 'This page is for admins only.'}
        </p>
      </div>
    );
  }

  const visibleRequests = filter === 'pending' ? requests.filter(r => r.status === 'pending') : requests;

  return (
    <div className="space-y-6" id="admin-panel-root">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white">
            {isRtl ? 'مراجعة طلبات الدفع' : 'Payment Requests Review'}
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full text-xs font-bold">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-full transition-all ${filter === 'pending' ? 'bg-white text-[#0f0714]' : 'text-slate-400'}`}
          >
            {isRtl ? 'قيد الانتظار' : 'Pending'}
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full transition-all ${filter === 'all' ? 'bg-white text-[#0f0714]' : 'text-slate-400'}`}
          >
            {isRtl ? 'الكل' : 'All'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
        </div>
      ) : visibleRequests.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-16">
          {isRtl ? 'مفيش طلبات دلوقتي' : 'No requests right now'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleRequests.map(req => (
            <div key={req.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <a href={req.screenshotBase64} target="_blank" rel="noreferrer" className="block relative group">
                <img src={req.screenshotBase64} alt="Payment proof" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
              <div className="p-4 space-y-2">
                <p className="text-sm font-bold text-white truncate">{req.userEmail}</p>
                <p className="text-xs text-slate-400" dir="ltr">{req.senderPhone}</p>
                <p className="text-xs text-slate-400">{req.amount} {isRtl ? 'جنيه' : 'EGP'}</p>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === 'pending'
                      ? 'bg-amber-400/20 text-amber-300'
                      : req.status === 'approved'
                      ? 'bg-emerald-400/20 text-emerald-300'
                      : 'bg-[#f43f5e]/20 text-[#f43f5e]'
                  }`}
                >
                  {req.status === 'pending' ? (isRtl ? 'قيد الانتظار' : 'Pending') : req.status === 'approved' ? (isRtl ? 'تمت الموافقة' : 'Approved') : (isRtl ? 'مرفوض' : 'Rejected')}
                </span>

                {req.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApprove(req)}
                      disabled={processingId === req.id}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400/30 transition-all disabled:opacity-50"
                    >
                      {processingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      {isRtl ? 'موافقة' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      disabled={processingId === req.id}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold bg-[#f43f5e]/20 text-[#f43f5e] hover:bg-[#f43f5e]/30 transition-all disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      {isRtl ? 'رفض' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
