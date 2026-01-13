'use client';

import LoginForm from '@/components/therapist/TherapistLogin';
import { Suspense } from 'react';


export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Secure Clinical Portal...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
