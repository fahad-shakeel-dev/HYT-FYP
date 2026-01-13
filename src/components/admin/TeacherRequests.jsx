"use client"

import { User, Mail, Calendar, Check, X, Clock, ShieldCheck, FileText, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function TeacherRequests({ teacherRequests, handleApprove, handleRejectClick, processingRequests }) {
  return (
    <div className="space-y-8 font-outfit">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-amber-500" size={24} />
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Therapist Requests</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm">Review pending clinical applications</p>
        </div>
        <div className="px-5 py-2 bg-amber-50 border border-amber-100 rounded-full">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            {teacherRequests?.length || 0} Awaiting Review
          </span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {(!teacherRequests || teacherRequests.length === 0) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
              <Check size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">All Caught Up</h2>
            <p className="text-slate-500 text-sm">No pending requests at this time.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {teacherRequests.map((request, index) => {
              const isProcessing = processingRequests.has(request._id)

              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-amber-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                            <User size={18} />
                          </div>
                          <span className="text-slate-800 font-bold text-sm tracking-tight">{request.name}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                        <div className="flex items-center space-x-3">
                          <Mail className="text-slate-400" size={16} />
                          <span className="text-slate-600 font-medium text-sm truncate max-w-[150px]">{request.email}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request ID</label>
                        <div className="flex items-center space-x-3">
                          <FileText className="text-slate-400" size={16} />
                          <span className="text-slate-700 font-bold text-sm uppercase">REQ-{request._id.slice(-6)}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                        <div className="flex items-center space-x-3">
                          <Calendar className="text-slate-400" size={16} />
                          <span className="text-slate-600 font-bold text-sm">{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                      <button
                        onClick={() => handleApprove(request, "teachers")}
                        disabled={isProcessing}
                        className="flex-1 xl:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <Activity size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                        <span className="text-xs uppercase tracking-wider">Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectClick(request, "teachers")}
                        disabled={isProcessing}
                        className="flex-1 xl:flex-none px-6 py-3 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold rounded-xl transition-all border border-slate-200 hover:border-rose-200 flex items-center justify-center gap-2 shadow-sm"
                      >
                        <X size={16} strokeWidth={3} />
                        <span className="text-xs uppercase tracking-wider">Reject</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div className="pt-8 flex items-center justify-center gap-4 opacity-40">
        <div className="w-8 h-[1px] bg-slate-300" />
        <ShieldCheck size={14} className="text-slate-400" />
        <div className="w-8 h-[1px] bg-slate-300" />
      </div>
    </div>
  )
}
