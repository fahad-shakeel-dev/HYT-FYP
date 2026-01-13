"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LucideMessageSquare,
  LucideBell,
  LucideSend,
  LucideMail,
  LucideSearch,
  LucidePlus,
  LucideX,
  LucideCheckCheck,
  LucideClock,
  LucideUsers,
  LucideShieldCheck,
  LucideReply,
  LucideMoreHorizontal,
  LucideStethoscope
} from "lucide-react"

export default function ClinicalConsultations() {
  const [activeTab, setActiveTab] = useState("messages")
  const [showComposeForm, setShowComposeForm] = useState(false)

  // Mock data - mapped to clinical context
  const notifications = [
    {
      id: 1,
      title: "Care Plan Milestone Reminder",
      message: "Daily therapy log for patient #882 is due by tomorrow EOD",
      recipients: "Morning Node (35 parents)",
      sentDate: "2024-05-14",
      status: "sent",
    },
    {
      id: 2,
      title: "New Assessment Protocol Available",
      message: "Diagnostic guidelines for speech therapy updated in resources",
      recipients: "Global Registry (All parents)",
      sentDate: "2024-05-13",
      status: "sent",
    }
  ]

  const messages = [
    {
      id: 1,
      from: "Parent of Alice Johnson",
      subject: "Session Reschedule Request",
      message: "Is it possible to move the Tuesday occupational therapy session to Wednesday afternoon?",
      date: "2024-05-15",
      status: "unread",
    },
    {
      id: 2,
      from: "Parent of Bob Smith",
      subject: "Assessment Clarification",
      message: "We need more information regarding the sensory integration milestones in the last report.",
      date: "2024-05-14",
      status: "read",
    }
  ]

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <LucideMessageSquare size={28} />
            </div>
            Clinical Consultations
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-12">Authorized messaging hub for therapist-parent engagement</p>
        </div>

        <button
          onClick={() => setShowComposeForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 group"
        >
          <LucideSend size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 w-fit rounded-[1.5rem] border border-slate-50">
        {[
          { id: "messages", label: "Parent Consultations", icon: LucideMail },
          { id: "notifications", label: "Broadcast History", icon: LucideBell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                ? "bg-white text-primary-600 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "messages" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 h-[calc(100vh-320px)] min-h-[600px]">
          {/* Chat List */}
          <div className="xl:col-span-4 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50">
              <div className="relative group">
                <LucideSearch className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search consultations..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {messages.map((message) => (
                <button
                  key={message.id}
                  className={`w-full text-left p-4 rounded-3xl transition-all relative group ${message.status === 'unread' ? 'bg-primary-50/50 border border-primary-100' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-100 flex items-center justify-center text-secondary-600 font-black text-sm">
                      {message.from.split(' ').pop().charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-800 truncate">{message.from}</span>
                        <span className="text-[10px] font-bold text-slate-400">{message.date}</span>
                      </div>
                      <span className="text-xs font-bold text-primary-600 truncate block">{message.subject}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 font-medium pl-1">{message.message}</p>
                  {message.status === 'unread' && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary-600 rounded-full border-2 border-white"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation View (Static for UI) */}
          <div className="xl:col-span-8 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
              <LucideMessageSquare size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Select a Consultation</h3>
              <p className="text-slate-400 font-bold text-sm max-w-sm mx-auto">Click on a parent profile to view clinical discussion history and secure message threads.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-6 max-w-4xl">
          <AnimatePresence mode="popLayout">
            {notifications.map((note, index) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-50 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start relative group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <LucideBell size={28} />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{note.title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-50 text-green-600 rounded-lg">
                      {note.status}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">{note.message}</p>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <LucideUsers size={16} />
                      <span className="text-xs font-bold">{note.recipients}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <LucideClock size={16} />
                      <span className="text-xs font-bold">Dispatched on {note.sentDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all">
                    <LucideMoreHorizontal size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Compose Form Modal */}
      <AnimatePresence>
        {showComposeForm && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComposeForm(false)}
          >
            <motion.div
              className="bg-white rounded-[3rem] shadow-2xl max-w-xl w-full p-10 relative overflow-hidden"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Broadcast</h3>
                  <p className="text-slate-400 font-bold text-sm">Send authorized alerts to clinical nodes</p>
                </div>
                <button
                  onClick={() => setShowComposeForm(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LucideX size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Recipient Clinical Nodes</label>
                  <div className="relative">
                    <LucideUsers className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
                    <select className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium">
                      <option>Morning Session Node (All Parents)</option>
                      <option>Afternoon Session Node (All Parents)</option>
                      <option>Individual Parent Selection</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Dispatch Priority</label>
                  <div className="flex gap-2">
                    {['Normal', 'High', 'Urgent'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="flex-1 py-3 px-4 border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Message Content</label>
                  <textarea
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium min-h-[150px]"
                    placeholder="Type authorized clinic message..."
                  ></textarea>
                </div>

                <div className="p-4 bg-primary-50 rounded-2xl flex gap-4 border border-primary-100">
                  <LucideShieldCheck className="text-primary-600 shrink-0" size={20} />
                  <div className="text-[10px] font-black text-primary-700 uppercase tracking-wider leading-relaxed">
                    Encrypted dispatch protocol active. All communications are logged for clinical auditing.
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all" onClick={() => setShowComposeForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                    <LucideSend size={18} />
                    Authorize Dispatch
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
