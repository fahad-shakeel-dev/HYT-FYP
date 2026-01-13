"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LucideLibrary,
  LucideUpload,
  LucideFileText,
  LucideFileVideo,
  LucideFileAudio,
  LucideBell,
  LucideTrash2,
  LucideEdit3,
  LucideDownload,
  LucidePlus,
  LucideX,
  LucideCalendar,
  LucideShieldCheck,
  LucideUsers,
  LucideInfo
} from "lucide-react"

export default function ClinicalResourceSharing() {
  const [activeTab, setActiveTab] = useState("materials")
  const [showUploadForm, setShowUploadForm] = useState(false)

  // Table Data - Mapped to clinical context
  const materials = [
    {
      id: 1,
      title: "Pediatric Speech Articulation Protocol - Level 1",
      type: "PDF",
      assignedNode: "Morning Session Node",
      uploadDate: "2024-05-10",
      accessCount: 25,
      size: "2.5 MB",
    },
    {
      id: 2,
      title: "Home Support Visual Aids for Parents",
      type: "PPT",
      assignedNode: "Individual Care Node",
      uploadDate: "2024-05-12",
      accessCount: 18,
      size: "5.2 MB",
    }
  ]

  const updates = [
    {
      id: 1,
      title: "Clinic Shutdown for Maintenance",
      assignedNode: "Global Access",
      date: "2024-05-15",
      urgency: "high",
    },
    {
      id: 2,
      title: "New Occupational Therapy Slots Available",
      assignedNode: "Evening Node",
      date: "2024-05-14",
      urgency: "medium",
    }
  ]

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <LucideLibrary size={28} />
            </div>
            Clinical Resources
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-12">Authorized therapeutic materials and clinic-wide updates</p>
        </div>

        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 group"
        >
          <LucidePlus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 w-fit rounded-[1.5rem] border border-slate-50">
        {[
          { id: "materials", label: "Patient Guides", icon: LucideFileText },
          { id: "updates", label: "Clinic Updates", icon: LucideBell },
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

      {activeTab === "materials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {materials.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 p-8 flex group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[4rem] flex items-center justify-center text-primary-300 group-hover:text-primary-600 transition-colors">
                  {item.type === "PDF" && <LucideFileText size={32} />}
                  {item.type === "PPT" && <LucideFileVideo size={32} />}
                  {item.type === "DOC" && <LucideFileAudio size={32} />}
                </div>

                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full w-fit uppercase tracking-widest mb-4">
                    {item.type} • {item.size}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight mb-4 pr-12">{item.title}</h3>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-500">
                      <LucideUsers size={16} className="text-slate-300" />
                      <span className="text-xs font-bold">{item.assignedNode}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <LucideCalendar size={16} className="text-slate-300" />
                      <span className="text-xs font-bold">Uploaded on {item.uploadDate}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button className="flex-1 py-3 px-4 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      <LucideDownload size={14} />
                      Download
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all">
                      <LucideEdit3 size={18} />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all">
                      <LucideTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {activeTab === "updates" && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {updates.map((update, index) => (
              <motion.div
                key={update.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2rem] shadow-sm border border-slate-50 p-6 flex items-center gap-6 group hover:shadow-md transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${update.urgency === 'high' ? 'bg-rose-50 text-rose-600' :
                    update.urgency === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                  }`}>
                  <LucideBell size={24} className={update.urgency === 'high' ? 'animate-bounce' : ''} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{update.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${update.urgency === 'high' ? 'bg-rose-100 text-rose-700' :
                        update.urgency === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                      {update.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <LucideUsers size={14} />
                      <span className="text-xs font-bold">{update.assignedNode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <LucideCalendar size={14} />
                      <span className="text-xs font-bold">{update.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 transition-all">
                    <LucideEdit3 size={18} />
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 transition-all">
                    <LucideTrash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadForm(false)}
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
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Repository</h3>
                  <p className="text-slate-400 font-bold text-sm">Upload therapeutic guides or broadcast clinic updates</p>
                </div>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LucideX size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Content Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Sensory Integration Guidelines"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Assign Node</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium">
                      <option>Morning Session</option>
                      <option>Afternoon Session</option>
                      <option>Global Library</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Resource Type</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium">
                      <option>Therapeutic Guide</option>
                      <option>Clinic Update</option>
                      <option>Training Video</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Secure File Transfer</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary-200 transition-all group cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                        <LucideUpload size={28} />
                      </div>
                      <p className="text-sm font-black text-slate-700">Click to upload or drag clinical files</p>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Supports PDF, MP4, DOCX (Max 50MB)</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-2xl flex gap-4 border border-primary-100">
                  <LucideShieldCheck className="text-primary-600 shrink-0" size={20} />
                  <p className="text-[10px] font-bold text-primary-700 uppercase tracking-wider leading-relaxed">
                    All uploaded content is encrypted and accessible only to authorized clinical nodes and their primary caregivers.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all" onClick={() => setShowUploadForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                    Encrypt & Upload
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
