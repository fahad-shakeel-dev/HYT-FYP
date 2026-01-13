"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { LucideMail, LucideArrowLeft, LucideStethoscope, LucideActivity, LucideChevronRight, LucideShieldCheck } from "lucide-react"
import Link from "next/link"

export default function TherapistForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        if (!email) {
            setError("Clinical email required for identification")
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/therapist/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(data.message || "Recovery instructions dispatched to your inbox")
                setEmail("")
            } else {
                setError(data.message || "Credential verification failed")
            }
        } catch (error) {
            setError("Critical connection error. Please retry.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Immersive Background Design */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-12 border border-white relative z-10"
            >
                <div className="text-center mb-12">
                    <Link href="/therapist" className="inline-flex items-center text-slate-400 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group">
                        <LucideArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={16} />
                        Back to Login
                    </Link>

                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-200 rotate-6">
                            <LucideStethoscope size={40} className="-rotate-6" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Credential Recovery</h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Clinical Security Layer</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Identity</label>
                        <div className="relative group">
                            <LucideMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="therapist@hospital.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shrink-0"></div>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-100 text-green-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 text-left leading-relaxed">
                            <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce shrink-0"></div>
                            {success}
                        </div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-primary-600 hover:bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-primary-100 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50 group"
                        whileHover={{ y: -4 }}
                    >
                        {loading ? (
                            <LucideActivity className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span className="text-[10px] uppercase tracking-[0.3em]">Dispatch Recovery Link</span>
                                <LucideChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-300 font-black text-[8px] uppercase tracking-widest">
                        <LucideShieldCheck size={12} />
                        Verified Clinical Security System
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    )
}
