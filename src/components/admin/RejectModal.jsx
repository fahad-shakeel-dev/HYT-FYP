"use client"

import { X, ShieldAlert, Activity, ClipboardList, Send, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RejectModal({
  showRejectModal,
  setShowRejectModal,
  rejectReason,
  setRejectReason,
  handleRejectSubmit,
  setSelectedRequest,
}) {
  if (!showRejectModal) return null

  const handleClose = () => {
    setShowRejectModal(false)
    setRejectReason("")
    setSelectedRequest(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6 lg:p-12"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-14 w-full max-w-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500">
                  <ShieldAlert size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-1">Refusal Protocol</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Institutional Credentialing Denial</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-3 bg-slate-950 text-slate-500 hover:text-white rounded-2xl transition-all active:scale-90">
                <X size={24} />
              </button>
            </div>

            <div className="mb-10 space-y-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <ClipboardList size={14} /> Formal Policy Documentation
              </label>
              <div className="relative group">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify institutional cause for entry denial..."
                  className="w-full px-8 py-6 bg-slate-950/50 border border-slate-900 rounded-[2rem] text-white placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none font-bold text-sm min-h-[160px] transition-all group-hover:bg-slate-950"
                  rows={4}
                />
                <div className="absolute right-6 bottom-6 flex items-center gap-2">
                  <Zap className="text-slate-800" size={14} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="py-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-950/40 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Send size={16} />
                Confirm Refusal
              </button>
              <button
                onClick={handleClose}
                className="py-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                Abort Protocol
              </button>
            </div>

            <div className="mt-10 p-6 bg-slate-950/50 border border-slate-900 rounded-3xl flex items-center gap-4">
              <Activity className="text-slate-600 animate-pulse" size={16} />
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                DENIAL ACTION WILL BE LOGGED AS A PERMANENT SYSTEM DIAGNOSTIC EVENT AND TRANSMITTED TO THE APPLICANT.
              </p>
            </div>
          </div>

          {/* Background Gradient */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/5 blur-[120px] pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
