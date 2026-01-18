"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideArrowLeft, LucideShieldCheck, LucideChevronRight, LucideActivity, LucideHeart, LucideCheckCircle2, LucideUsers, LucideEye, LucideEyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function ParentRegisterForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [checkingRegNumber, setCheckingRegNumber] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    phone: "",
    program: "",
    address: "",
    registrationNumber: "",
  })
  const router = useRouter()

  // Validation Regex Patterns
  const validationPatterns = {
    name: /^[a-zA-Z\s'-]{3,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  }

  // Check if registration number is available
  const checkRegistrationNumber = async (regNumber) => {
    if (!regNumber.trim()) {
      return
    }

    setCheckingRegNumber(true)
    try {
      const response = await fetch("/api/check-registration-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: regNumber }),
      })

      const data = await response.json()

      if (!data.available) {
        setFieldErrors(prev => ({
          ...prev,
          registrationNumber: data.message
        }))
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.registrationNumber
          return newErrors
        })
      }
    } catch (error) {
      console.error("Error checking registration number:", error)
    } finally {
      setCheckingRegNumber(false)
    }
  }

  // Validate individual fields
  const validateField = (name, value) => {
    const errors = { ...fieldErrors }

    switch (name) {
      case "name":
        if (!value.trim()) {
          errors.name = "Guardian full name is required"
        } else if (!validationPatterns.name.test(value.trim())) {
          errors.name = "Name must be 3-50 characters, letters only"
        } else {
          delete errors.name
        }
        break

      case "email":
        if (!value.trim()) {
          errors.email = "Email address is required"
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
          errors.phone = "Please enter a valid phone number"
        } else {
          delete errors.phone
        }
        break

      case "registrationNumber":
        if (!value.trim()) {
          errors.registrationNumber = "Patient registry ID is required"
        } else if (value.trim().length < 2) {
          errors.registrationNumber = "Please enter a valid registry ID"
        } else {
          delete errors.registrationNumber
          checkRegistrationNumber(value.trim())
        }
        break

      case "password":
        if (!value) {
          errors.password = "Password is required"
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

  const validateStep1 = () => {
    const newErrors = {}
    const fieldsToCheck = ["name", "email", "phone", "registrationNumber"]
    
    fieldsToCheck.forEach(field => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = true
      }
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateField("password", formData.password) || !validateField("confirmPassword", formData.confirmPassword)) {
      Swal.fire({ icon: "error", title: "Validation Error", text: "Please correct the password errors above.", confirmButtonColor: "#ef4444" })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Password Mismatch", text: "Passwords do not match.", confirmButtonColor: "#ef4444" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Success",
          text: "Your care portal account has been provisioned.",
          confirmButtonColor: "#10b981",
        }).then(() => router.push("/parent"))
      } else {
        const data = await response.json()
        Swal.fire({ icon: "error", title: "Registry Error", text: data.message || "Credentialing failed.", confirmButtonColor: "#ef4444" })
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "System Offline", text: "Communication with the clinical registry failed.", confirmButtonColor: "#ef4444" })
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
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-rose-500 rounded-full blur-[120px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl mb-8">
            <LucideHeart size={32} />
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
            A Unified <br /> <span className="text-rose-400">Care Gateway</span> <br /> for Your Family
          </h1>

          <div className="space-y-6 pt-8 border-t border-white/5">
            {[
              { icon: LucideCheckCircle2, title: "Clinical Transparency", desc: "Shared data with therapists." },
              { icon: LucideUsers, title: "Family-Centric UI", desc: "Dashboards for caregivers." }
            ].map((feat, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 shrink-0">
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
                <Link href="/parent" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-black text-[8px] xs:text-[9px] uppercase tracking-widest mb-4 sm:mb-6 transition-all group">
                  <LucideArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform hidden sm:block" size={14} />
                  Access Portal
                </Link>
                <h2 className="text-2xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Caregiver Registry</h2>
                <p className="text-slate-500 font-bold text-xs sm:text-sm">Patient & Guardian Provisioning</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Phase</p>
                <p className="text-xl sm:text-2xl font-black text-primary-600">{step}<span className="text-slate-400">/2</span></p>
              </div>
            </header>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Guardian Full Name</label>
                        <div className="relative group">
                          <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors hidden sm:block sm:size-[18px]" size={16} />
                          <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors sm:hidden" size={16} />
                          <input name="name" placeholder="Johnathan Doe" value={formData.name} onChange={handleInputChange} className={`w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-2.5 sm:py-4 bg-white border rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-xs sm:text-sm ${
                            fieldErrors.name ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                          }`} required />
                        </div>
                        {fieldErrors.name && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.name}</p>}
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Email</label>
                        <div className="relative group">
                          <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors hidden sm:block sm:size-[18px]" size={16} />
                          <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors sm:hidden" size={16} />
                          <input name="email" type="email" placeholder="care@family.com" value={formData.email} onChange={handleInputChange} className={`w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-2.5 sm:py-4 bg-white border rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-xs sm:text-sm ${
                            fieldErrors.email ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                          }`} required />
                        </div>
                        {fieldErrors.email && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
                        <div className="flex gap-2 sm:gap-3 group">
                          <div className="relative w-20 sm:w-24 shrink-0">
                            <LucidePhone className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors sm:hidden" size={14} />
                            <LucidePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors hidden sm:block sm:size-[18px]" size={18} />
                            <div className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2.5 sm:py-4 bg-white border border-slate-200 rounded-lg sm:rounded-2xl text-slate-800 font-bold text-xs sm:text-sm shadow-sm flex items-center">
                              +92
                            </div>
                          </div>
                          <div className="relative flex-1">
                            <input name="phone" placeholder="300-0000000" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 sm:px-6 py-2.5 sm:py-4 bg-white border rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-xs sm:text-sm ${
                              fieldErrors.phone ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                            }`} required />
                          </div>
                        </div>
                        {fieldErrors.phone && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.phone}</p>}
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Patient Registry ID</label>
                        <div className="relative group">
                          <LucideShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors hidden sm:block sm:size-[18px]" size={16} />
                          <LucideShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors sm:hidden" size={16} />
                          <input name="registrationNumber" placeholder="P-882-90" value={formData.registrationNumber} onChange={handleInputChange} className={`w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-2.5 sm:py-4 bg-white border rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-xs sm:text-sm ${
                            fieldErrors.registrationNumber ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                          }`} required />
                          {checkingRegNumber && (
                            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                              <div className="animate-spin">
                                <LucideActivity size={18} className="text-primary-600" />
                              </div>
                            </div>
                          )}
                        </div>
                        {fieldErrors.registrationNumber && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.registrationNumber}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-4 bg-white border border-slate-200 rounded-lg sm:rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-xs sm:text-sm shadow-sm appearance-none">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Care Type</label>
                        <input name="program" placeholder="OT/SLP" value={formData.program} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-4 bg-white border border-slate-200 rounded-lg sm:rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-xs sm:text-sm shadow-sm uppercase" required />
                      </div>
                    </div>

                    <button type="button" onClick={() => validateStep1() ? setStep(2) : Swal.fire({ icon: 'warning', title: 'Incomplete Fields', text: 'Please fill all required fields.' })} className="w-full py-3 sm:py-4 md:py-5 bg-slate-900 text-white font-black rounded-lg sm:rounded-2xl shadow-xl flex items-center justify-center gap-2 sm:gap-3 group transition-all active:scale-[0.98] mt-3 sm:mt-4">
                      <span className="text-[9px] xs:text-[10px] uppercase tracking-[0.2em]">Next: Secure Access</span>
                      <LucideChevronRight size={16} className="sm:size-[18px] group-hover:translate-x-1 transition-transform hidden sm:block" />
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
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Residential Address</label>
                      <input name="address" placeholder="123 Care Street, Medical District" value={formData.address} onChange={handleInputChange} className="w-full px-4 sm:px-6 py-2.5 sm:py-4 bg-white border border-slate-200 rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-xs sm:text-sm shadow-sm" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Password</label>
                        <div className="relative group">
                          <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors hidden sm:block sm:size-[18px]" size={16} />
                          <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors sm:hidden" size={16} />
                          <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className={`w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-2.5 sm:py-4 bg-white border rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-xs sm:text-sm ${
                            fieldErrors.password ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                          }`} required />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                          >
                            {showPassword ? <LucideEyeOff size={16} className="hidden sm:block sm:size-[18px]" /> : <LucideEye size={16} className="hidden sm:block sm:size-[18px]" />}
                            {showPassword ? <LucideEyeOff size={16} className="sm:hidden" /> : <LucideEye size={16} className="sm:hidden" />}
                          </button>
                        </div>
                        {fieldErrors.password && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.password}</p>}
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[8px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                        <div className="relative group">
                          <LucideShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors hidden sm:block sm:size-[18px]" size={16} />
                          <LucideShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors sm:hidden" size={16} />
                          <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-2.5 sm:py-4 bg-white border rounded-lg sm:rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 shadow-sm transition-all font-bold text-xs sm:text-sm ${
                            fieldErrors.confirmPassword ? "border-rose-400 focus:ring-rose-600/5 focus:border-rose-600" : "border-slate-200 focus:ring-primary-600/5 focus:border-primary-600"
                          }`} required />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                          >
                            {showConfirmPassword ? <LucideEyeOff size={16} className="hidden sm:block sm:size-[18px]" /> : <LucideEye size={16} className="hidden sm:block sm:size-[18px]" />}
                            {showConfirmPassword ? <LucideEyeOff size={16} className="sm:hidden" /> : <LucideEye size={16} className="sm:hidden" />}
                          </button>
                        </div>
                        {fieldErrors.confirmPassword && <p className="text-rose-600 text-[11px] font-black uppercase tracking-widest">{fieldErrors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 sm:py-3 md:py-4 md:py-5 bg-white border border-slate-200 text-slate-500 font-black rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all text-[9px] xs:text-[10px] uppercase tracking-[0.2em]">Back</button>
                      <button type="submit" disabled={loading} className="flex-[2] py-2.5 sm:py-3 md:py-4 md:py-5 bg-primary-600 text-white font-black rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl shadow-primary-200 flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-[0.98] disabled:opacity-50 group">
                        {loading ? <LucideActivity className="animate-spin hidden sm:block sm:size-[20px]" size={16} /> : (
                          <>
                            <span className="text-[9px] xs:text-[10px] uppercase tracking-[0.2em]">Complete Provisioning</span>
                            <LucideChevronRight size={16} className="sm:size-[18px] group-hover:translate-x-1 transition-transform hidden sm:block" />
                          </>
                        )}
                        {loading && <LucideActivity className="animate-spin sm:hidden" size={16} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 pb-2 sm:pb-3 md:pb-4 text-[6px] xs:text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] text-center shrink-0">
          Caregiver Transparency Unit • Department of Clinical Informatics • 2025
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
