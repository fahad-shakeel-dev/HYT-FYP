"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideArrowLeft, LucideShieldCheck, LucideChevronRight, LucideActivity, LucideHeart, LucideCheckCircle2, LucideUsers } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function ParentRegisterForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
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
    semester: 1,
    section: "A",
  })
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateStep1 = () => {
    return formData.name && formData.email && formData.phone && formData.registrationNumber
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Security Mismatch", text: "Passwords do not match.", confirmButtonColor: "#ef4444" })
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
    <div className="h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden font-outfit">
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
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-16 relative bg-[#fcfcfd] overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md xl:max-w-xl my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="mb-8 flex items-baseline justify-between">
              <div>
                <Link href="/parent" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-black text-[9px] uppercase tracking-widest mb-6 transition-all group">
                  <LucideArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={14} />
                  Access Portal
                </Link>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">Caregiver Registry</h2>
                <p className="text-slate-500 font-bold text-sm">Patient & Guardian Provisioning</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Phase</p>
                <p className="text-2xl font-black text-primary-600">{step}<span className="text-slate-400">/2</span></p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Guardian Full Name</label>
                        <div className="relative group">
                          <LucideUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                          <input name="name" placeholder="Johnathan Doe" value={formData.name} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Email</label>
                        <div className="relative group">
                          <LucideMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                          <input name="email" type="email" placeholder="care@family.com" value={formData.email} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm" required />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
                        <div className="relative group">
                          <LucidePhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                          <input name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Patient Registry ID</label>
                        <div className="relative group">
                          <LucideShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                          <input name="registrationNumber" placeholder="P-882-90" value={formData.registrationNumber} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm" required />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-sm shadow-sm appearance-none">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Phase</label>
                        <input name="semester" type="number" min="1" max="12" value={formData.semester} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-sm shadow-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Node</label>
                        <input name="section" placeholder="A" value={formData.section} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-sm shadow-sm uppercase" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Care Type</label>
                        <input name="program" placeholder="OT/SLP" value={formData.program} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-sm shadow-sm font-black uppercase text-[10px]" required />
                      </div>
                    </div>

                    <button type="button" onClick={() => validateStep1() ? setStep(2) : Swal.fire({ icon: 'warning', title: 'Incomplete Phases', text: 'Please fill clinical identifier fields.' })} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 group transition-all active:scale-[0.98] mt-4">
                      <span className="text-[10px] uppercase tracking-[0.2em]">Next: Secure Access</span>
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
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Residential Address</label>
                      <input name="address" placeholder="123 Care Street, Medical District" value={formData.address} onChange={handleInputChange} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 transition-all font-bold text-sm shadow-sm" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Password</label>
                        <div className="relative group">
                          <LucideLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                          <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                        <div className="relative group">
                          <LucideShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                          <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 shadow-sm transition-all font-bold text-sm" required />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all text-[10px] uppercase tracking-[0.2em]">Back</button>
                      <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 group">
                        {loading ? <LucideActivity className="animate-spin" size={20} /> : (
                          <>
                            <span className="text-[10px] uppercase tracking-[0.2em]">Complete Provisioning</span>
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

        <div className="mt-10 pb-4 text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] text-center shrink-0">
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
