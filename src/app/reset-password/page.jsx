"use client"

import React, { Suspense } from "react"
import ResetPasswordForm from '@/components/therapist/ResetPassword'

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Authorization Layer...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

export default Page
