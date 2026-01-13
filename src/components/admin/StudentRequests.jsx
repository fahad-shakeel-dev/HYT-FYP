"use client"

import { motion } from "framer-motion"
import { LucideCheck, LucideX, LucideGraduationCap, LucideMail, LucidePhone, LucideTrash2, User, Activity, Zap, ShieldCheck, ChevronRight, ClipboardList, Database } from "lucide-react"

export default function StudentRequests({
  studentRequests,
  handleApprove,
  handleRejectClick,
  handleDeleteStudent,
  processingRequests,
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="space-y-8 font-outfit">
      {/* Intake Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Patient Intake</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Institutional Onboarding & Credentialing Queue</p>
        </motion.div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
          <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"> Pending Applications: {studentRequests.length} </span>
          </div>
        </motion.div>
      </div>

      {/* Requests Queue */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {studentRequests.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/10 rounded-[3rem] border border-dashed border-slate-800">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-6">
              <Database size={32} />
            </div>
            <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em]"> Intake Queue Latency: Zero </p>
          </div>
        ) : (
          studentRequests.map((request, idx) => {
            const requestId = request._id || request.id
            const isProcessing = processingRequests.has(requestId)

            return (
              <motion.div
                key={requestId}
                variants={item}
                className="bg-slate-900/30 backdrop-blur-xl border border-slate-900 rounded-[2rem] p-8 group hover:border-slate-800 transition-all overflow-hidden relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Personal Profile Cluster */}
                  <div className="lg:col-span-4 flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-900 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        {request.image ? (
                          <img src={request.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <User size={32} className="text-slate-700" />
                        )}
                      </div>
                      <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-primary-600 rounded-xl border-4 border-[#020617] flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                        <ShieldCheck size={14} />
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[8px] font-black text-primary-500 uppercase tracking-widest mb-1 font-mono">#{requestId.slice(-6).toUpperCase()}</p>
                      <h3 className="text-xl font-black text-white tracking-tighter truncate leading-none mb-2">{request.name}</h3>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest truncate">
                        <LucideMail size={12} className="text-slate-700" />
                        {request.email}
                      </div>
                    </div>
                  </div>

                  {/* Demographics Cluster */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-900">
                      <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-2">Assigned Hierarchy</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{request.semester} - {request.section}</span>
                      </div>
                    </div>
                    <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-900">
                      <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-2">Institutional ID</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest truncate">{request.registrationNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Cluster */}
                  <div className="lg:col-span-3 flex items-center justify-end gap-3">
                    {request.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(request, "students")}
                          disabled={isProcessing}
                          className="px-6 py-4 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-600/20 hover:border-emerald-600 text-emerald-500 hover:text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 group/btn"
                        >
                          {isProcessing ? <Activity className="animate-spin" size={16} /> : <LucideCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleRejectClick(request, "students")}
                          disabled={isProcessing}
                          className="px-6 py-4 bg-rose-600/10 hover:bg-rose-600 border border-rose-600/20 hover:border-rose-600 text-rose-500 hover:text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 group/btn"
                        >
                          <LucideX size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeleteStudent(request)}
                        className="px-8 py-4 bg-slate-800 hover:bg-rose-900 border border-slate-800 hover:border-rose-950 text-slate-400 hover:text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3"
                      >
                        <LucideTrash2 size={16} />
                        <span>Purge Registry</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute right-0 top-0 h-full w-1">
                  <div className={`h-full w-full ${request.status === 'pending' ? 'bg-amber-500' : request.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>

                <div className="absolute right-0 top-0 w-32 h-32 bg-primary-600/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Queue Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {[
          { label: "Verification Latency", val: "1.4s", icon: Zap, color: "text-amber-500" },
          { label: "Onboarding Flow", val: "Active", icon: Activity, color: "text-emerald-500" },
          { label: "Registry Integrity", val: "Secure", icon: ShieldCheck, color: "text-primary-500" }
        ].map((diag, i) => (
          <div key={i} className="p-8 bg-slate-900/20 border border-slate-900 rounded-[2rem] flex items-center gap-6">
            <div className={`w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center ${diag.color}`}>
              <diag.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{diag.label}</p>
              <p className="text-lg font-black text-white">{diag.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
