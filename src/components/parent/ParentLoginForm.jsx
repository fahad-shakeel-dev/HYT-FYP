"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { LucideMail, LucideLock, LucideArrowLeft, LucideUsers, LucideActivity, LucideHeart, LucideChevronRight, LucideEye, LucideEyeOff, LucideShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Swal from "sweetalert2"

export default function ParentLoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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

        if (!formData.email || !formData.password) {
            Swal.fire({
                icon: "error",
                title: "Missing Credentials",
                text: "Please provide both email and security key.",
                confirmButtonColor: "#2563eb",
            })
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/parent/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            })

            const data = await response.json()

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Authorization Verified",
                    text: `Welcome to the Care Portal, ${data.student.name}!`,
                    confirmButtonColor: "#10b981",
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = "/parent/dashboard"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: data.message || "Invalid credentials provided.",
                    confirmButtonColor: "#ef4444",
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Network Latency",
                text: "Communication with the care registry failed.",
                confirmButtonColor: "#ef4444",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden font-outfit">
            {/* Split Screen - Care Side */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center p-12 xl:p-20 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 -right-20 w-96 h-96 bg-rose-500 rounded-full blur-[120px]"></div>
                </div>

                <LucideHeart size={400} className="absolute -right-20 -bottom-20 text-white/5 -rotate-12 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-md text-left"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full mb-8 border border-white/10">
                        <LucideHeart className="text-rose-400" size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Secure Caregiver Node</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                        Monitor Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-rose-300">Clinical Node</span> <br />
                        Progress
                    </h1>

                    <p className="text-white/40 font-bold text-base leading-relaxed mb-10 max-w-sm">
                        Real-time visualization of therapeutic milestones and clinician feedback.
                    </p>

                    <div className="grid grid-cols-1 gap-4 pt-8 border-t border-white/5">
                        <div className="flex gap-4 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                            <div>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-none">Live Session Logs</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                            <div>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-none">Growth Indicators</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                    <div className="w-6 h-[1px] bg-white/10"></div>
                    <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">Care Portal v2.0</span>
                </div>
            </div>

            {/* Split Screen - Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-20 relative bg-[#fcfcfd] overflow-y-auto no-scrollbar">
                <div className="w-full max-w-sm xl:max-w-md my-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <header className="mb-8">
                            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-primary-600 font-black text-[9px] uppercase tracking-widest mb-6 transition-all group">
                                <LucideArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={14} />
                                Exit to Selection
                            </Link>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-200 shrink-0">
                                    <LucideUsers size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Parent Sign-in</h2>
                                    <p className="text-slate-400 font-bold text-sm">Authorized Caregiver Access</p>
                                </div>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Family Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors">
                                            <LucideMail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="parent@domain.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                                        <Link href="#" className="text-[9px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                                            Forgot Key?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors">
                                            <LucideLock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-14 py-4 bg-white border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-600 transition-colors"
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
                                    <div className="w-5 h-5 bg-white border-2 border-slate-200 rounded-lg peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                                        <LucideShieldCheck size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="ml-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Maintain Portal Active</span>
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
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Enter Care Portal</span>
                                        <LucideChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <footer className="mt-10 pt-8 border-t border-slate-50 text-center">
                            <p className="text-[11px] font-bold text-slate-400 mb-4">
                                New family registered with our network?
                            </p>
                            <Link href="/parent/register" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-100 hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all border border-slate-100 hover:border-primary-100">
                                Register Account
                                <LucideChevronRight size={14} />
                            </Link>
                        </footer>
                    </motion.div>
                </div>

                <div className="mt-10 pb-4 text-[7px] font-black text-slate-300 uppercase tracking-[0.4em] text-center shrink-0">
                    Family Transparency Module • Rehabilitative Clinical Network • 2025
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
