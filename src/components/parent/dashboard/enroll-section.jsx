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
        <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
                <LucideStethoscope size={24} />
              </div>
              Node Authorization Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-bold text-slate-700 block ml-1">
                  Clinical Node ID
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <LucideShieldCheck size={20} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter Credential ID"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-bold text-slate-700 block ml-1">
                  Secure Access Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <LucideLock size={20} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter Access Key"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LucideActivity className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    <LucidePlus size={20} />
                    Authorize Access
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Protocol Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <LucideCheckCircle size={20} className="text-emerald-600" />
              Authorization Steps
            </h3>
            <div className="space-y-5">
              {[
                "Obtain credentials from your lead therapist.",
                "Input the Node ID and Access Key.",
                "Submit to sync your clinical dashboard."
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-800 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LucideInfo size={20} className="text-blue-400" />
              Support
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Having trouble connecting? Contact the facility IT desk for credential verification.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <LucideMail size={16} /> support@portal.com
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <LucidePhone size={16} /> +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

