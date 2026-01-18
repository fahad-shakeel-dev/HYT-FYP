"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { LucideMail, LucideArrowLeft, LucideActivity, LucideChevronRight, LucideShieldCheck, LucideLock, LucideKey } from "lucide-react"
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
            setError("Email address is required")
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
                setSuccess(data.message || "Password reset link has been sent to your email address")
                setEmail("")
            } else {
                setError(data.message || "Email not found in our system")
            }
        } catch (error) {
            setError("Connection error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-outfit">
            {/* Animated Background Blur Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Split Layout Container */}
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10 items-center">
                {/* Left Side - Brand Info */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden lg:block text-white"
                >
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full mb-6 border border-white/20">
                            <LucideKey className="text-primary-400" size={16} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/80">Password Recovery</span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
                            Regain Access
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">to Your Account</span>
                        </h1>

                        <p className="text-white/70 font-medium text-lg leading-relaxed mb-10 max-w-md">
                            Enter your email address and we'll send you a secure link to reset your password within minutes.
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-4 pt-8 border-t border-white/10">
                        {[
                            { icon: LucideShieldCheck, title: "Secure Process", desc: "SSL encrypted transmission" },
                            { icon: LucideLock, title: "Instant Delivery", desc: "Reset link in your inbox" },
                            { icon: LucideKey, title: "One-Time Use", desc: "Link expires in 24 hours" }
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                                className="flex gap-4 items-start group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-primary-400 shrink-0 group-hover:bg-white/20 transition-all">
                                    <feat.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm mb-1 tracking-tight">{feat.title}</h3>
                                    <p className="text-white/60 text-xs font-bold leading-tight">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side - Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/20"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <Link href="/therapist" className="inline-flex items-center text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest mb-8 transition-all group">
                            <LucideArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
                            Back to Login
                        </Link>

                        <div className="flex justify-center mb-8">
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/50 relative"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                            >
                                <LucideKey size={40} />
                            </motion.div>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Forget Password?</h2>
                        <p className="text-white/70 font-bold text-sm">No worries, we'll help you recover your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/80 uppercase tracking-widest ml-1 block">Email Address</label>
                            <div className="relative group">
                                <LucideMail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-400 shadow-lg backdrop-blur-sm transition-all font-bold text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-rose-500/20 border border-rose-400/50 text-rose-100 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0"></div>
                                {error}
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-500/20 border border-green-400/50 text-green-100 p-5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-start gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce shrink-0 mt-1"></div>
                                <div className="flex-1">{success}</div>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-black rounded-xl shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 group mt-2"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <LucideActivity className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span className="text-[10px] uppercase tracking-[0.2em]">Send Reset Link</span>
                                    <LucideChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-3">Security Note</p>
                        <p className="text-white/60 text-[11px] font-medium leading-relaxed">
                            Check your email (including spam folder) for the reset link. The link will expire in 24 hours for security.
                        </p>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    )
}
