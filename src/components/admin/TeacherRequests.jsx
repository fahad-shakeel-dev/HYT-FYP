"use client"

import { User, Mail, Phone, Calendar, Check, X, Clock, ShieldCheck, FileText, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function TeacherRequests({ teacherRequests, handleApprove, handleRejectClick, processingRequests }) {
  return (
    <div className="space-y-8 font-outfit">
      {/* Clinician Onboarding Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-amber-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Therapist Verification</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Pending Clinical Credentialing Queue</p>
        </div>
        <div className="px-6 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            {teacherRequests?.length || 0} Professional Applications Awaiting Review
          </span>
        </div>
      </div>

      {/* Requests Registry Table-like View */}
      <div className="space-y-4">
        {teacherRequests?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800"
          >
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mx-auto mb-6">
              <Clock size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">Registry Clear</h2>
            <p className="text-slate-600 font-bold mt-2">All clinician credentials have been processed.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {teacherRequests?.map((request, index) => {
              const isProcessing = processingRequests.has(request._id)

              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-900 hover:border-slate-800 transition-all hover:bg-slate-900/60 group"
                >
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 w-full">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Legal Identity</label>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500">
                            <User size={18} />
                          </div>
                          <span className="text-white font-black tracking-tight">{request.name}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Communication Channel</label>
                        <div className="flex items-center space-x-3">
                          <Mail className="text-slate-500" size={16} />
                          <span className="text-slate-300 font-bold text-sm truncate max-w-[150px]">{request.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Inscribed Registry ID</label>
                        <div className="flex items-center space-x-3">
                          <FileText className="text-slate-500" size={16} />
                          <span className="text-slate-300 font-bold text-sm">REH-2025-{request._id.slice(-4).toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Application Phase</label>
                        <div className="flex items-center space-x-3">
                          <Calendar className="text-slate-500" size={16} />
                          <span className="text-slate-300 font-bold text-sm">{new Date(request.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Verification Status</label>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-amber-500 font-black uppercase text-[10px] tracking-widest">{request.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full xl:w-auto pt-8 xl:pt-0 border-t xl:border-t-0 border-slate-800/50">
                      <button
                        onClick={() => handleApprove(request, "teachers")}
                        disabled={isProcessing}
                        className="flex-1 xl:flex-none px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-950/20 active:scale-95 flex items-center justify-center gap-2 group/btn"
                      >
                        {isProcessing ? <Activity size={18} className="animate-spin" /> : <Check size={18} className="group-hover/btn:scale-110 transition-transform" />}
                        <span className="text-[10px] uppercase tracking-[0.2em]">Authorize Access</span>
                      </button>
                      <button
                        onClick={() => handleRejectClick(request, "teachers")}
                        disabled={isProcessing}
                        className="flex-1 xl:flex-none px-8 py-4 bg-slate-800 hover:bg-rose-900 text-slate-200 hover:text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-700 hover:border-rose-800 group/btn"
                      >
                        <X size={18} className="group-hover/btn:rotate-90 transition-transform" />
                        <span className="text-[10px] uppercase tracking-[0.2em]">Revoke Request</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Audit Log Hint */}
      <div className="pt-10 flex items-center justify-center gap-6">
        <div className="w-12 h-[1px] bg-slate-900" />
        <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Institutional Verification Protocol • TLS 1.3 Active</span>
        <div className="w-12 h-[1px] bg-slate-900" />
      </div>
    </div>
  )
}
