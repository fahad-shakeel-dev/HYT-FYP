"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideStethoscope, LucideArrowLeft, LucideShieldCheck, LucideChevronRight, LucideUpload, LucideActivity, LucideEye, LucideEyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TherapistRegisterForm() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()

    // Validation Regex Patterns
    const validationPatterns = {
        name: /^[a-zA-Z\s'-]{3,50}$/, // Letters, spaces, hyphens, apostrophes (3-50 chars)
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Standard email format
        phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, // International phone
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Strong password: 8+ chars minimum, uppercase, lowercase, digit (any special chars allowed)
    }

    const fieldRefs = {
        name: null,
        email: null,
        phone: null,
        subject: null,
        password: null,
        confirmPassword: null,
    }

    // Validate individual fields
    const validateField = (name, value) => {
        const errors = { ...fieldErrors }

        switch (name) {
            case "name":
                if (!value.trim()) {
                    errors.name = "Professional name is required"
                } else if (!validationPatterns.name.test(value.trim())) {
                    errors.name = "Name must be 3-50 characters, letters only"
                } else {
                    delete errors.name
                }
                break

            case "email":
                if (!value.trim()) {
                    errors.email = "Professional email is required"
                } else if (!validationPatterns.email.test(value.trim())) {
                    errors.email = "Please enter a valid email address"
                } else {
                    delete errors.email
                }
                break

            case "phone":
                if (!value.trim()) {
                    errors.phone = "Contact number is required"
                } else if (!validationPatterns.phone.test(value.trim())) {
                    errors.phone = "Please enter a valid phone number (intl format accepted)"
                } else {
                    delete errors.phone
                }
                break

            case "subject":
                if (!value.trim()) {
                    errors.subject = "Clinical specialization is required"
                } else if (value.trim().length < 2) {
                    errors.subject = "Please enter a valid specialization"
                } else {
                    delete errors.subject
                }
                break

            case "password":
                if (!value) {
                    errors.password = "Access password is required"
                } else if (!validationPatterns.password.test(value)) {
                    errors.password = "Password must be at least 8 characters with uppercase, lowercase, and number"
                } else {
                    delete errors.password
                }
                break

            case "confirmPassword":
                if (!value) {
                    errors.confirmPassword = "Please confirm your password"
                } else if (value !== formData.password) {
                    errors.confirmPassword = "Passwords do not match"
                } else {
                    delete errors.confirmPassword
                }
                break

            default:
                break
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        validateField(name, value)
    }

    const validateAllFields = () => {
        const newErrors = {}
        const fieldsToValidate = step === 1 
            ? ["name", "email", "phone", "subject"]
            : ["password", "confirmPassword"]

        fieldsToValidate.forEach(field => {
            if (!validateField(field, formData[field])) {
                newErrors[field] = true
            }
        })

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!validateAllFields()) {
            setError("Please correct the errors above before continuing")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Security tokens do not match")
            return
        }

        setLoading(true)
        try {
            const response = await fetch("/api/therapist/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/therapist?message=Registration request submitted. Awaiting clinical verification.")
            } else {
                const data = await response.json()
                setError(data.message || "Registration failed")
            }
        } catch (err) {
            console.error("Registration error:", err)
            
            // Detailed network error handling
            if (err.message === "Failed to fetch") {
                setError("Network connection failed. Please check your internet connection and try again.")
            } else if (err instanceof TypeError && err.message.includes("fetch")) {
                setError("Unable to reach the server. Please check your connection.")
            } else {
                setError("An unexpected error occurred. Please try again later.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full max-w-screen bg-white flex flex-col lg:flex-row overflow-x-hidden overflow-y-auto lg:overflow-hidden font-outfit">
            {/* Split Screen - Info Side */}
            <div className="hidden lg:flex lg:w-[40%] bg-slate-900 relative items-center justify-center p-12 xl:p-16 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 -right-20 w-96 h-96 bg-teal-500 rounded-full blur-[120px]"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 w-full max-w-sm"
                >
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl mb-8">
                        <LucideActivity size={32} />
                    </div>

                    <h1 className="text-3xl xl:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
                        Join the <span className="text-primary-400">Clinical</span> <br /> Professional Network
                    </h1>

                    <div className="space-y-6 pt-8 border-t border-white/5">
                        {[
                            { icon: LucideShieldCheck, title: "Verified Credentials", desc: "Vetting for clinical integrity." },
                            { icon: LucideActivity, title: "Automated Reporting", desc: "Data progress visualization." }
                        ].map((feat, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 shrink-0">
                                    <feat.icon size={18} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">{feat.title}</h3>
                                    <p className="text-white/60 text-[11px] font-bold leading-tight">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Split Screen - Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-20 relative bg-[#fcfcfd] overflow-y-auto no-scrollbar">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-xl my-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4">
                            <div>
                                <Link href="/therapist" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-black text-[8px] xs:text-[9px] uppercase tracking-widest mb-4 sm:mb-6 transition-all group">
                                    <LucideArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform hidden sm:block" size={14} />
                                    Access Portal
                                </Link>
                                <h2 className="text-2xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Clinician Registry</h2>
                                <p className="text-slate-500 font-bold text-xs sm:text-sm">Professional System Authorization</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Step</p>
                                <p className="text-xl sm:text-2xl font-black text-primary-600">{step}<span className="text-slate-400">/2</span></p>
                            </div>
                        </header>

                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shrink-0"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Full Name</label>
                                                <div className="relative group">
                                                    <LucideUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                    <input name="name" placeholder="Dr. Jane Smith" value={formData.name} onChange={handleInputChange} className={`w-full pl-14 pr-6 py-4 bg-white border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-sm ${
                                                        fieldErrors.name ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                                                    }`} required />
                                                </div>
                                                {fieldErrors.name && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Clinical Specialization</label>
                                                <div className="relative group">
                                                    <LucideStethoscope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                    <input name="subject" placeholder="Occupational Therapy" value={formData.subject} onChange={handleInputChange} className={`w-full pl-14 pr-6 py-4 bg-white border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-sm ${
                                                        fieldErrors.subject ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                                                    }`} required />
                                                </div>
                                                {fieldErrors.subject && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.subject}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email Address</label>
                                            <div className="relative group">
                                                <LucideMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                <input name="email" type="email" placeholder="clinician@hospital.com" value={formData.email} onChange={handleInputChange} className={`w-full pl-14 pr-6 py-4 bg-white border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-sm ${
                                                    fieldErrors.email ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                                                }`} required />
                                            </div>
                                            {fieldErrors.email && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
                                            <div className="flex gap-3 group">
                                                <div className="relative w-24 shrink-0">
                                                    <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                    <div className="w-full pl-10 pr-3 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm shadow-sm flex items-center">
                                                        +92
                                                    </div>
                                                </div>
                                                <div className="relative flex-1">
                                                    <input name="phone" placeholder="300-0000000" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-white border rounded-xl sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-sm ${
                                                        fieldErrors.phone ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                                                    }`} required />
                                                </div>
                                            </div>
                                            {fieldErrors.phone && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.phone}</p>}
                                        </div>

                                        <button type="button" onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 group transition-all active:scale-[0.98] mt-4">
                                            <span className="text-[10px] uppercase tracking-[0.2em]">Next: Security Config</span>
                                            <LucideChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Password</label>
                                            <div className="relative group">
                                                <LucideLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className={`w-full pl-14 pr-14 py-4 bg-white border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-sm ${
                                                    fieldErrors.password ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                                                }`} required />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                    {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                                </button>
                                            </div>
                                            {fieldErrors.password && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.password}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <div className="relative group">
                                                <LucideShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full pl-14 pr-14 py-4 bg-white border rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-sm ${
                                                    fieldErrors.confirmPassword ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                                                }`} required />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                    {showConfirmPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                                </button>
                                            </div>
                                            {fieldErrors.confirmPassword && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.confirmPassword}</p>}
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all text-[10px] uppercase tracking-[0.2em]">Back</button>
                                            <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 group">
                                                {loading ? <LucideActivity className="animate-spin" size={20} /> : (
                                                    <>
                                                        <span className="text-[10px] uppercase tracking-[0.2em]">Complete Registry</span>
                                                        <LucideChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                </div>

                <div className="mt-10 pb-4 text-[7px] font-black text-slate-300 uppercase tracking-[0.4em] text-center shrink-0">
                    Lumos Milestone Care • 2025
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
