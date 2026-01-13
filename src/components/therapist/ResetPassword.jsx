"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { LucideShieldCheck, LucideEye, LucideEyeOff, LucideArrowLeft, LucideStethoscope, LucideActivity, LucideChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function TherapistResetPasswordForm() {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    useEffect(() => {
        if (!token) {
            setError("Secure token missing or expired")
        }
    }, [token])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        if (!formData.password || !formData.confirmPassword) {
            setError("All clinical security fields required")
            setLoading(false)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Credentials do not match")
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/therapist/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess("Access credentials updated. Redirecting to portal...")
                setTimeout(() => {
                    router.push("/therapist?message=Credentials updated successfully")
                }, 2000)
            } else {
                setError(data.message || "Credential authorization failed")
            }
        } catch (error) {
            setError("Critical system error. Please retry.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Background Medical Visuals */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 border border-white relative z-10"
            >
                <div className="text-center mb-12">
                    <Link href="/therapist" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group">
                        <LucideArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={16} />
                        Abort Security Update
                    </Link>

                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-200">
                            <LucideShieldCheck size={40} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Establish New Key</h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Authorized Credential Update</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Clinical Security Key</label>
                            <div className="relative group">
                                <LucideStethoscope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-16 pr-16 py-5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-600 transition-colors"
                                >
                                    {showPassword ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Security Key</label>
                            <div className="relative group">
                                <LucideShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-16 pr-16 py-5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shrink-0"></div>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-100 text-green-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce shrink-0"></div>
                            {success}
                        </div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full py-6 bg-primary-600 hover:bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-primary-100 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50 group"
                        whileHover={{ y: -4 }}
                    >
                        {loading ? (
                            <LucideActivity className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span className="text-[10px] uppercase tracking-[0.3em]">Authorize Credential Sync</span>
                                <LucideChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-relaxed">
                        Secure Facility Data Synchronization Active
                    </p>
                    <div className="h-1 w-24 bg-slate-50 mx-auto rounded-full overflow-hidden">
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
    )
}
