"use client"

import { AlertCircle, Clock, BookOpen, ShieldAlert, Activity, ShieldCheck, Zap, Globe, Layers, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function SessionGuard({ hasActiveSession }) {
    if (hasActiveSession) {
        return null
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] font-outfit p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full"
            >
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-slate-900 relative overflow-hidden group">
                    <div className="relative z-10 text-center">
                        <div className="mb-10">
                            <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-8 animate-pulse">
                                <ShieldAlert size={48} />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">Propagation Halted</h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                                Clinical infrastructure propagation is currently inactive. System features are gated pending phase initiation.
                            </p>
                        </div>

                        <div className="bg-amber-600/10 border border-amber-600/20 rounded-3xl p-8 mb-10 overflow-hidden relative group/alert">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Clock className="text-amber-500 animate-spin-slow" size={20} />
                                <span className="text-amber-500 font-black uppercase text-[11px] tracking-widest">Institutional Intermission</span>
                            </div>
                            <p className="text-amber-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
                                Active lifecycle ended. Patient progression values have been incremented across the global repository.
                            </p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 blur-[50px] -z-0" />
                        </div>

                        <div className="space-y-4 text-left max-w-xs mx-auto mb-10">
                            {[
                                { text: "Unassigned clinician node links", color: "text-primary-500", icon: Layers },
                                { text: "Incremented patient registry phases", color: "text-emerald-500", icon: Globe },
                                { text: "Archive-ready historical status", color: "text-amber-500", icon: ShieldCheck }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className={`w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center ${item.color} group-hover/item:scale-110 transition-transform`}>
                                        <item.icon size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-slate-800/50">
                            <div className="p-6 bg-primary-600/5 border border-primary-600/10 rounded-2xl flex items-center justify-between group/link cursor-help">
                                <div className="flex items-center gap-4">
                                    <Zap className="text-primary-500" size={16} />
                                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Provisioning Required</span>
                                </div>
                                <ChevronRight className="text-slate-700 group-hover/link:translate-x-1 transition-transform" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Background Elements */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/5 blur-[120px] pointer-events-none" />
                    <div className="absolute -left-20 -top-20 w-80 h-80 bg-primary-600/5 blur-[120px] pointer-events-none" />
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 15s linear infinite; }
            `}</style>
        </div>
    )
}
