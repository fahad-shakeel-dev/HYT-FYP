"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LucideArrowLeft, LucideCheckCircle, LucideXCircle, LucideActivity, LucideShieldCheck } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const [message, setMessage] = useState("Verifying your email...");
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const role = searchParams.get("role") || "therapist";

      if (!token) {
        setMessage("Invalid or missing clinical token");
        setIsError(true);
        return;
      }

      try {
        // Map legacy roles to new internal API structure
        // If role is student/parent, use parent API. Otherwise use therapist.
        const apiRole = role === "student" || role === "parent" ? "parent" : "therapist";

        const response = await fetch(
          `/api/${apiRole}/verify-email?token=${token}`,
          { method: "GET" }
        );

        if (response.ok) {
          setMessage("Email verified successfully! Authorizing portal access...");
          setTimeout(() => {
            router.push(`/${apiRole}?message=Email%20verified%20successfully`);
          }, 2000);
        } else {
          const data = await response.json();
          setMessage(data.message || "Credential verification failed. Please try again.");
          setIsError(true);
        }
      } catch (error) {
        setMessage("System latency detected. Verification failed.");
        setIsError(true);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const container = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const role = searchParams.get("role");
  const loginPath = role === "student" || role === "parent" ? "/parent" : "/therapist";

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Background Medical Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 border border-white relative z-10"
      >
        <motion.div variants={item} className="text-center mb-12">
          <Link
            href={loginPath}
            className="inline-flex items-center text-slate-500 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group"
          >
            <LucideArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={16} />
            Back to Login
          </Link>

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-200">
              {isError ? <LucideShieldCheck size={40} className="opacity-50" /> : <LucideActivity size={40} className="animate-pulse" />}
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Email Verification</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-none text-center">Lumos Milestone Care</p>
        </motion.div>

        <motion.div
          variants={item}
          className={`flex items-center justify-center p-8 rounded-3xl border ${isError
              ? "bg-rose-50 border-rose-100 text-rose-600"
              : "bg-teal-50 border-teal-100 text-teal-600"
            }`}
        >
          {isError ? (
            <LucideXCircle className="mr-4 shrink-0" size={24} />
          ) : (
            <div className="relative mr-4 shrink-0">
              <LucideCheckCircle size={24} />
              {!isError && <motion.div className="absolute inset-0 bg-teal-400/20 rounded-full scale-150 blur-lg" animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} />}
            </div>
          )}
          <p className="text-sm font-black uppercase tracking-wider">{message}</p>
        </motion.div>

        {isError && (
          <motion.div variants={item} className="text-center mt-10 space-y-4">
            <p className="text-slate-500 font-bold text-xs leading-relaxed">
              Clinical registry access denied. Please initiate a new registration request or verify your credentials.
            </p>
            <div className="h-[1px] w-12 bg-slate-100 mx-auto"></div>
            <Link href="/" className="text-[10px] font-black text-primary-600 hover:text-slate-900 uppercase tracking-widest transition-colors block text-center">
              Return to System Index
            </Link>
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-relaxed">
            Secure Facility Data Synchronization Active
          </p>
          <div className="h-1 w-24 bg-slate-50 mx-auto rounded-full overflow-hidden text-center">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/2 bg-primary-600/20"
            />
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] text-center">Accessing Authorization Layer...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
