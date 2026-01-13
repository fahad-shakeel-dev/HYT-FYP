"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LucideClipboardCheck,
  LucidePlus,
  LucideCalendar,
  LucideUsers,
  LucideBookOpen,
  LucideClock,
  LucideCheckCircle2,
  LucideAlertCircle,
  LucideTrash2,
  LucideEdit3,
  LucideBarChart,
  LucideX,
  LucidePaperclip,
  LucideFileText
} from "lucide-react"

export default function TherapyTaskManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock data - mapped to clinical context
  const tasks = [
    {
      id: 1,
      title: "Speech Articulation Exercise - Set A",
      group: "Morning Session Node",
      focus: "Speech Therapy",
      targetDate: "2024-05-15",
      logs: 28,
      totalPatients: 35,
      status: "active",
    },
    {
      id: 2,
      title: "Fine Motor Skills Development",
      group: "Individual Care Node",
      focus: "Occupational Therapy",
      targetDate: "2024-05-20",
      logs: 15,
      totalPatients: 28,
      status: "active",
    },
    {
      id: 3,
      title: "Behavioral Observation Protocol",
      group: "Weekend Group",
      focus: "Clinical Psychology",
      targetDate: "2024-05-10",
      logs: 25,
      totalPatients: 25,
      status: "completed",
    }
  ]

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return task.status === "active"
    if (activeTab === "completed") return task.status === "completed"
    if (activeTab === "delayed") return new Date(task.targetDate) < new Date() && task.status !== "completed"
    return true
  })

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <LucideClipboardCheck size={28} />
            </div>
            Therapy Tasks
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-12">Assign and monitor therapeutic objectives for patients</p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 group"
        >
          <LucidePlus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Initiate New Task</span>
        </button>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 w-fit rounded-[1.5rem] border border-slate-50">
        {[
          { id: "all", label: "All Objectives", icon: LucideBookOpen },
          { id: "active", label: "Current Interventions", icon: LucideClock },
          { id: "completed", label: "Achieved Goals", icon: LucideCheckCircle2 },
          { id: "delayed", label: "Follow-up Required", icon: LucideAlertCircle },
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

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 p-8 flex flex-col group relative overflow-hidden h-full border-t-4 border-t-primary-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${task.status === "completed" ? "bg-green-50 text-green-600" : "bg-primary-50 text-primary-600"
                      }`}>
                      {task.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight pt-2">{task.title}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-500">
                  <LucideUsers size={18} className="text-slate-300" />
                  <span className="text-sm font-bold">{task.group}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <LucideBookOpen size={18} className="text-slate-300" />
                  <span className="text-sm font-bold">{task.focus}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <LucideCalendar size={18} className="text-slate-300" />
                  <span className="text-sm font-bold">Target: {task.targetDate}</span>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-400 font-bold">Progress Tracking</span>
                  <span className="text-primary-600">{Math.round((task.logs / task.totalPatients) * 100)}%</span>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(task.logs / task.totalPatients) * 100}%` }}
                    className="h-full bg-primary-600 rounded-full"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  {task.logs} / {task.totalPatients} Patient logs finalized
                </p>

                <div className="flex gap-2 pt-4 border-t border-slate-50">
                  <button className="flex-1 py-3 px-4 bg-primary-50 text-primary-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-100 transition-all flex items-center justify-center gap-2">
                    <LucideBarChart size={14} />
                    Evaluate
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

      {/* Create Task Modal */}
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
              className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Initiate New objective</h3>
                  <p className="text-slate-400 font-bold text-sm">Fill in the clinical requirements for this task</p>
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
                  <label className="text-sm font-bold text-slate-700 ml-1">Objective Title</label>
                  <div className="relative">
                    <LucideFileText className="absolute left-5 top-4.5 text-slate-400" size={20} />
                    <input
                      type="text"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      placeholder="e.g., Cognitive Behavioral Milestone #04"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Target Patient Group</label>
                    <div className="relative">
                      <LucideUsers className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
                      <select className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium">
                        <option>Morning Node (A)</option>
                        <option>Afternoon Node (B)</option>
                        <option>Specialized Individual Care</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Therapy Specialty</label>
                    <div className="relative">
                      <LucideStethoscope className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
                      <select className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium">
                        <option>Speech Therapy</option>
                        <option>Occupational Therapy</option>
                        <option>Psychology</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Clinical Instructions</label>
                  <textarea
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium min-h-[120px]"
                    placeholder="Provide specific therapeutic instructions..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Target Date</label>
                    <div className="relative">
                      <LucideCalendar className="absolute left-5 top-4.5 text-slate-400" size={20} />
                      <input type="date" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Clinical Attachments</label>
                    <div className="relative">
                      <LucidePaperclip className="absolute left-5 top-4.5 text-slate-400" size={20} />
                      <input type="file" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium cursor-pointer file:hidden" />
                      <span className="absolute right-6 top-4.5 text-xs font-black text-slate-400 uppercase tracking-widest pointer-events-none">Optional</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                    Launch Objective
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
