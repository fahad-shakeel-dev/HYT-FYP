"use client"

import { motion } from "framer-motion"
import { LucideActivity, LucideHeart, LucideShieldCheck } from "lucide-react"

export default function SplashScreen() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden relative font-outfit">
            {/* Immersive Background Dynamics */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary-600 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-teal-500 rounded-full blur-[150px]"
                />
            </div>

            {/* Content Container */}
            <motion.div
                className="text-center z-10 px-8 max-w-5xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Branding Icon */}
                <motion.div
                    className="mb-12 inline-block relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                >
                    <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <LucideActivity size={48} className="text-primary-400 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    </div>
                    {/* Orbitals */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border border-dashed border-white/10 rounded-full"
                    />
                </motion.div>

                {/* System Title */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 mb-6 leading-none">
                        Clinical Governance Registry
                    </p>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                        Rehabilitation Therapy <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-teal-300 to-primary-500">
                            Session Management
                        </span>
                    </h1>
                </motion.div>

                {/* Progress Indicators */}
                <div className="space-y-10 mt-16 max-w-sm mx-auto">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-teal-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                    </div>

                    <motion.div
                        className="flex items-center justify-center gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        <div className="flex items-center gap-3">
                            <LucideShieldCheck size={14} className="text-white/20" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Secure Auth</span>
                        </div>
                        <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                        <div className="flex items-center gap-3">
                            <LucideHeart size={14} className="text-white/20" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Care Synchronized</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer Institutional Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-12 w-full text-center"
            >
                <div className="inline-block px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                        UCP Faisalabad • Dept. of Computer Science • 2025
                    </span>
                </div>
            </motion.div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    )
}
