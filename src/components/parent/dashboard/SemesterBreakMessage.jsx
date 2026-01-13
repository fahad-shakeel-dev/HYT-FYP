"use client"

import { motion } from "framer-motion"
import { LucideShieldCheck, LucideCalendar, LucideActivity, LucideStethoscope, LucideHeart, LucideInfo } from "lucide-react"

export default function ClinicalPhaseTransitionMessage({ currentSemester, nextSemester }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-5xl mx-auto px-6 py-12"
        >
            <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-50 p-12 text-center relative overflow-hidden group">
                {/* Background Analytics */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-teal-400 to-indigo-600"></div>
                <LucideActivity className="absolute right-[-20px] top-[-20px] text-slate-50 w-64 h-64 -rotate-12 pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                    className="mb-8 relative z-10"
                >
                    <div className="w-24 h-24 bg-primary-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary-200">
                        <LucideShieldCheck size={48} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10"
                >
                    <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Phase Completion Verified!</h1>
                    <p className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-10">Clinical Milestone Achieved</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-[2.5rem] p-10 mb-10"
                >
                    <p className="text-xl font-bold text-slate-600 mb-10">
                        Clinical Phase <span className="text-primary-600 font-black px-3 py-1 bg-primary-50 rounded-xl">{currentSemester}</span> has been successfully finalized and archived.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-50 group/item hover:border-primary-100 transition-all">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all">
                                <LucideHeart size={24} />
                            </div>
                            <h3 className="text-slate-800 font-black text-xs uppercase tracking-widest mb-2">Maintenance Period</h3>
                            <p className="text-slate-400 font-bold text-[10px] leading-relaxed">Clinical data integrity review in progress.</p>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-50 group/item hover:border-primary-100 transition-all">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                <LucideCalendar size={24} />
                            </div>
                            <h3 className="text-slate-800 font-black text-xs uppercase tracking-widest mb-2">Next Clinical Phase</h3>
                            <p className="text-slate-400 font-bold text-[10px] leading-relaxed">Authorized for Transition to Phase {nextSemester}.</p>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-50 group/item hover:border-primary-100 transition-all">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                <LucideActivity size={24} />
                            </div>
                            <h3 className="text-slate-800 font-black text-xs uppercase tracking-widest mb-2">Node Synchronization</h3>
                            <p className="text-slate-400 font-bold text-[10px] leading-relaxed">Awaiting new clinical node allocation.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-white border border-slate-100 rounded-[2.5rem] p-8 text-left shadow-sm group hover:border-primary-100 transition-all"
                    >
                        <h4 className="flex items-center gap-3 text-slate-800 font-black text-xs uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                            System Synchronization
                        </h4>
                        <ul className="space-y-4">
                            {[
                                "Current clinical phase incremented automatically",
                                "Legacy therapy node enrollments cleared",
                                "Security tokens reset for next phase access",
                                "Therapist re-assignment protocols initiated"
                            ].map((text, idx) => (
                                <li key={idx} className="flex gap-4 items-center group/li">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/li:bg-primary-600 transition-colors"></div>
                                    <span className="text-slate-500 font-bold text-xs">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-left shadow-2xl group hover:border-teal-500 transition-all"
                    >
                        <h4 className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                            <div className="p-1 bg-teal-500/10 text-teal-400 rounded-md">
                                <LucideStethoscope size={14} />
                            </div>
                            Protocol: Phase {nextSemester}
                        </h4>
                        <ul className="space-y-4 font-outfit text-white/60">
                            {[
                                "Await official node authorization credentials",
                                "Review upcoming session plans (Standard-10)",
                                "Synchronize with new clinical leads",
                                "Monitor dashboard for verified node links"
                            ].map((text, idx) => (
                                <li key={idx} className="flex gap-4 items-center group/li">
                                    <div className="w-1 h-3 bg-white/10 rounded-full group-hover/li:bg-teal-400 transition-all"></div>
                                    <span className="font-bold text-xs leading-none">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                    className="mt-12 p-6 bg-primary-50 rounded-[2rem] border border-primary-100 flex items-center gap-6 text-left"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                        <LucideInfo size={24} />
                    </div>
                    <div>
                        <p className="text-slate-800 font-black text-xs uppercase tracking-widest mb-1">Clinical Tip:</p>
                        <p className="text-slate-500 font-bold text-xs italic leading-tight">
                            Use this maintenance window to review previous care plans and prepare for advanced therapeutic interventions in the upcoming phase.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
