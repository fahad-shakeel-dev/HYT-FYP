"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LucideFileText,
  LucidePlus,
  LucideCalendar,
  LucideUsers,
  LucideClock,
  LucideCheckCircle2,
  LucideAlertCircle,
  LucideTrash2,
  LucideEdit3,
  LucidePlay,
  LucideX,
  LucideActivity,
  LucideStethoscope,
  LucideBarChart3,
  LucideUpload,
  LucideMessageSquare
} from "lucide-react"

export default function ClinicalAssessmentManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [assessmentType, setAssessmentType] = useState("diagnostic")

  // Mock data - mapped to clinical context
  const assessments = [
    {
      id: 1,
      title: "Autism Diagnostic Observation (ADOS)",
      group: "Pediatric Intake Node",
      type: "Evaluation",
      metrics: 15,
      duration: 90,
      scheduledDate: "2024-05-18",
      status: "scheduled",
    },
    {
      id: 2,
      title: "Fine Motor Skills Evaluation",
      group: "Occupational Therapy B",
      type: "Milestone Review",
      metrics: 10,
      duration: 45,
      scheduledDate: "2024-05-22",
      status: "active",
    },
    {
      id: 3,
      title: "Speech Articulation Follow-up",
      group: "Speech Therapy A",
      type: "Progress Review",
      metrics: 8,
      duration: 30,
      scheduledDate: "2024-05-10",
      status: "completed",
    }
  ]

  const filteredAssessments = assessments.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "scheduled") return item.status === "scheduled"
    if (activeTab === "active") return item.status === "active"
    if (activeTab === "completed") return item.status === "completed"
    return true
  })

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <LucideFileText size={28} />
            </div>
            Clinical Assessments
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-12">Manage diagnostic evaluations and milestone check-ins</p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 group"
        >
          <LucidePlus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Initiate Assessment</span>
        </button>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 w-fit rounded-[1.5rem] border border-slate-50">
        {[
          { id: "all", label: "Registry", icon: LucideBarChart3 },
          { id: "scheduled", label: "Planned", icon: LucideCalendar },
          { id: "active", label: "Ongoing", icon: LucideActivity },
          { id: "completed", label: "Finalized", icon: LucideCheckCircle2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                ? "bg-white text-primary-600 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assessments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredAssessments.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 p-8 flex flex-col group relative overflow-hidden h-full border-t-4 border-t-teal-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === "completed" ? "bg-green-50 text-green-600" :
                        item.status === "active" ? "bg-blue-50 text-blue-600 animate-pulse" : "bg-primary-50 text-primary-600"
                      }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight pt-2">{item.title}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Type</span>
                    <span className="text-sm font-black text-slate-700">{item.type}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Metrics</span>
                    <span className="text-sm font-black text-slate-700">{item.metrics} points</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 px-2">
                  <LucideUsers size={18} className="text-slate-300" />
                  <span className="text-sm font-bold">{item.group}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 px-2">
                  <LucideClock size={18} className="text-slate-300" />
                  <span className="text-sm font-bold">{item.duration} Minutes Session</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 px-2">
                  <LucideCalendar size={18} className="text-slate-300" />
                  <span className="text-sm font-bold">Scheduled: {item.scheduledDate}</span>
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-6 border-t border-slate-50">
                <button className={`flex-1 py-4 px-4 ${item.status === 'active' ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-600'} rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2`}>
                  <LucidePlay size={14} />
                  {item.status === 'active' ? 'Resume session' : 'Begin Evaluation'}
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm">
                  <LucideEdit3 size={18} />
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
                  <LucideTrash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Assessment Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Setup Clinical Assessment</h3>
                  <p className="text-slate-400 font-bold text-sm">Define diagnostic parameters and metrics</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LucideX size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Assessment Title</label>
                  <div className="relative">
                    <LucideStethoscope className="absolute left-5 top-4.5 text-slate-400" size={20} />
                    <input
                      type="text"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      placeholder="e.g., ADOS-2 Toddler Module"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Target Patient Group</label>
                    <div className="relative">
                      <LucideUsers className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
                      <select className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium">
                        <option>Pediatric Intake A</option>
                        <option>Occupational Group B</option>
                        <option>Long-term Maintenance C</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Evaluation Methodology</label>
                    <div className="relative">
                      <LucideActivity className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
                      <select
                        value={assessmentType}
                        onChange={(e) => setAssessmentType(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      >
                        <option value="diagnostic">Diagnostic MCQ</option>
                        <option value="behavioral">Behavioral Observation</option>
                        <option value="media">Clinical Media Upload</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Estimated Session Length (min)</label>
                    <div className="relative">
                      <LucideClock className="absolute left-5 top-4.5 text-slate-400" size={20} />
                      <input type="number" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium" placeholder="60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Max Clinical Score</label>
                    <div className="relative">
                      <LucideBarChart3 className="absolute left-5 top-4.5 text-slate-400" size={20} />
                      <input type="number" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium" placeholder="100" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Scheduled Date</label>
                    <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Scheduled Time</label>
                    <input type="time" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium" />
                  </div>
                </div>

                {assessmentType === "diagnostic" && (
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest pl-2">Evaluation Metrics</h4>
                    <div className="space-y-4">
                      <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-3">
                        <input type="text" className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20" placeholder="Diagnostic Question 1" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium placeholder-slate-400" placeholder="Option A" />
                          <input type="text" className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium placeholder-slate-400" placeholder="Option B" />
                        </div>
                      </div>
                    </div>
                    <button type="button" className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-300 hover:text-primary-600 transition-all">
                      Add Diagnostic Metric
                    </button>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button type="button" className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                    Authorize Assessment
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
