"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { LucideLock, LucideMail, LucideArrowLeft, LucideEye, LucideEyeOff, LucideStethoscope, LucideActivity, LucideShieldCheck, LucideChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function TherapistLoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const message = searchParams.get("message")
        if (message) {
            setSuccess(message)
        }
    }, [searchParams])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        if (!formData.email || !formData.password) {
            setError("Identification credentials required")
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/therapist/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                if (formData.rememberMe) {
                    localStorage.setItem("user", JSON.stringify(data.user))
                } else {
                    sessionStorage.setItem("user", JSON.stringify(data.user))
                }
                router.push("/therapist/dashboard")
            } else {
                setError(data.message || "Therapist authorization failed")
            }
        } catch (error) {
            setError("Critical connection error. System unreachable.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full max-w-screen bg-white flex flex-col lg:flex-row overflow-x-hidden overflow-y-auto lg:overflow-hidden font-outfit">
            {/* Split Screen - Brand Side */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center p-12 xl:p-20 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 -right-20 w-96 h-96 bg-teal-500 rounded-full blur-[120px]"></div>
                </div>

                <LucideActivity size={400} className="absolute -right-20 -bottom-20 text-white/5 -rotate-12 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full mb-8 border border-white/20">
                        <LucideStethoscope className="text-primary-400" size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/80">Therapist Portal</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                        Targeted <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">Therapeutic</span> <br />
                        Interventions
                    </h1>

                    <p className="text-white/60 font-medium text-base leading-relaxed mb-10 max-w-sm">
                        Execute advanced session monitoring, manage clinical nodes, and orchestrate patient recovery breakthroughs.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-white">100%</p>
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Secure Sync</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-white leading-none">Global</p>
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Registry</p>
                        </div>
                    </div>
                </motion.div>

                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                    <div className="w-6 h-[1px] bg-white/20"></div>
                    <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.4em]">Auth Layer v2.1.0</span>
                </div>
            </div>

            {/* Split Screen - Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-20 relative bg-[#fcfcfd] overflow-y-auto no-scrollbar">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-md my-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <header className="mb-8">
                            <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-black text-[9px] uppercase tracking-widest mb-6 transition-all group">
                                <LucideArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={14} />
                                Portal Selection
                            </Link>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-200 shrink-0">
                                    <LucideStethoscope size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Therapist Sign-in</h2>
                                    <p className="text-slate-500 font-bold text-sm">Clinical Personnel Only</p>
                                </div>
                            </div>
                        </header>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shrink-0"></div>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                            <LucideMail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="credentials@clinical.system"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Access Token</label>
                                        <Link href="/therapistForgotpassword" title="Forgot Password" className="text-[9px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                                            Forget Password
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                            <LucideLock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-14 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                                        >
                                            {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 ml-1">
                                <label className="relative flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 bg-white border-2 border-slate-300 rounded-lg peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                                        <LucideShieldCheck size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="ml-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">Maintain Active Session</span>
                                </label>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-primary-600 hover:bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-primary-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 group"
                                whileHover={{ y: -2 }}
                            >
                                {loading ? (
                                    <LucideActivity className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Authorize Access</span>
                                        <LucideChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <footer className="mt-10 pt-8 border-t border-slate-100 text-center">
                            <p className="text-[11px] font-bold text-slate-500 mb-4">
                                Need a new clinical account?
                            </p>
                            <Link href="/therapistRegister" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all border border-slate-200 hover:border-primary-200">
                                Create Account
                                <LucideChevronRight size={14} />
                            </Link>
                        </footer>
                    </motion.div>
                </div>

                <div className="mt-10 pb-4 text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] text-center shrink-0">
                    Secure Facility Management • Department of Health Informatics • 2025
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}
