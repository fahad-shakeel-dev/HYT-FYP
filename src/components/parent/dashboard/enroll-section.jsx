"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  LucidePlus,
  LucideAlertCircle,
  LucideCheckCircle,
  LucideShieldCheck,
  LucideLock,
  LucideStethoscope,
  LucideActivity,
  LucideInfo,
  LucideArrowRight,
  LucideMail,
  LucidePhone,
  LucideClock
} from "lucide-react";

export default function EnrollSection({ onEnrollSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.password) {
      Swal.fire({
        title: "Incomplete Authorization",
        text: "Please provide both Clinical Node ID and Secure Key.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/parent/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Authorization Successful",
          text: "You have been securely granted access to the clinical node.",
          icon: "success",
          confirmButtonColor: "#2563eb",
          background: "#ffffff",
          customClass: {
            title: "font-black text-slate-800",
            content: "font-medium text-slate-600",
            confirmButton: "rounded-xl px-8 py-3 font-bold"
          }
        }).then(() => {
          setFormData({ username: "", password: "" });
          if (onEnrollSuccess) onEnrollSuccess();
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Authorization Failed",
          text: data.message || "Invalid clinical node credentials provided.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      Swal.fire({
        title: "System Error",
        text: "An error occurred during credential verification. Please try again.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto space-y-8 pb-12"
    >
      {/* Header Banner */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-50 rounded-bl-[8rem] -mr-32 -mt-32 transition-transform group-hover:scale-105 duration-700"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Authorize New Therapy Node</h1>
          <p className="text-slate-400 font-bold max-w-2xl">
            Establish a secure connection to a clinical node using the credentials provided by your lead therapist.
            This allows real-time tracking of therapeutic milestones and resources.
          </p>
        </div>
        <div className="relative z-10 px-6 py-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center gap-4">
          <LucideShieldCheck className="text-primary-600" size={32} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-none mb-1">Security Status</span>
            <span className="text-sm font-black text-slate-700">Level-2 Encrypted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Enrollment Form */}
        <div className="lg:col-span-7 bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 text-slate-50/50">
            <LucidePlus size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm">
                <LucideStethoscope size={24} />
              </div>
              Node Authorization Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="username" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Clinical Node ID
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary-600 transition-colors">
                    <LucideShieldCheck size={20} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. PED-SPEECH-2025"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold tracking-tight"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Secure Node Access Key
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-5 text-slate-300 group-focus-within:text-primary-600 transition-colors">
                    <LucideLock size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold tracking-tight"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 px-6 rounded-[1.5rem] transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary-100 disabled:opacity-50 uppercase tracking-[0.2em] relative overflow-hidden group"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <LucideActivity className="animate-spin" size={20} />
                      Authorizing...
                    </>
                  ) : (
                    <>
                      <LucidePlus size={20} />
                      Authorize Node Access
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Protocol Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 relative overflow-hidden group">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                <LucideCheckCircle size={20} />
              </div>
              Authorization Protocol
            </h3>
            <div className="space-y-6">
              {[
                { step: 1, text: "Obtain clinical credentials from lead therapist or facility coordinator" },
                { step: 2, text: "Input the unique Clinical Node ID into the authorization field" },
                { step: 3, text: "Enter the secure node access key exactly as provided" },
                { step: 4, text: "Submit for verification to grant immediate portal synchronization" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 group/item">
                  <div className="w-8 h-8 bg-slate-50 text-slate-400 group-hover/item:bg-teal-600 group-hover/item:text-white rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all">
                    {item.step}
                  </div>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-800 relative overflow-hidden">
            <LucideAlertCircle className="absolute right-[-20px] top-[-20px] text-white/5 w-32 h-32" />
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <LucideInfo size={20} />
              </div>
              Security Policies
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-1.5 h-full bg-amber-500 rounded-full"></div>
                <p className="text-white/60 font-bold text-xs italic leading-relaxed">Ensure node ID matches your Child's clinical phase and specialization area.</p>
              </div>
              <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-1.5 h-full bg-amber-500 rounded-full"></div>
                <p className="text-white/60 font-bold text-xs italic leading-relaxed">Keys are case-sensitive. Multiple incorrect attempts may trigger security lock.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Need Support?</h3>
            <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
              If authorization fails, please verify credentials with the facility coordinator or contact central support.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                  <LucideMail size={18} />
                </div>
                <span className="text-sm font-black tracking-tight underline">support@rehab-session.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                  <LucidePhone size={18} />
                </div>
                <span className="text-sm font-black tracking-tight">+1 (555) 098-7654</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <LucideClock size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Support: 8AM-5PM CST</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
              Full Security PDF
              <LucideArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
