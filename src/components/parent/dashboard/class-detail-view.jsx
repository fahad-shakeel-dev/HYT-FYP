"use client"

import { motion } from "framer-motion"
import { toast } from "react-toastify"
import {
  LucideArrowLeft,
  LucideClipboardList,
  LucideAward,
  LucideClock,
  LucideEye,
  LucideDownload,
  LucideUpload,
  LucideMoreVertical,
  LucideActivity,
  LucideShieldCheck,
  LucideChevronRight,
  LucideStethoscope
} from "lucide-react"

export default function NodeDetailView({ selectedClass, recentAssignments, onBack }) {
  if (!selectedClass) return null

  // Mapping subject to clinical focus filter
  const nodeTasks = recentAssignments.filter((task) =>
    task.focus.toLowerCase().includes(selectedClass.name.toLowerCase().split(" ")[0]) ||
    selectedClass.name.toLowerCase().includes(task.focus.toLowerCase().split(" ")[0])
  )

  const handleTaskAction = (action, task) => {
    toast.success(`${action}: ${task.title}`, {
      position: "top-right",
      autoClose: 2000,
      theme: "light"
    })
  }

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "submitted":
        return "bg-green-50 text-green-600 border-green-100"
      case "ongoing":
      case "in-progress":
        return "bg-amber-50 text-amber-600 border-amber-100"
      case "awaiting initiation":
      case "pending":
        return "bg-rose-50 text-rose-600 border-rose-100"
      default:
        return "bg-slate-50 text-slate-600 border-slate-100"
    }
  }

  const getUrgencyStyles = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-rose-600 text-white shadow-lg shadow-rose-100"
      case "medium":
        return "bg-slate-800 text-white"
      case "low":
        return "bg-teal-600 text-white"
      default:
        return "bg-slate-400 text-white"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto space-y-8 pb-12"
    >
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-3 text-slate-400 hover:text-primary-600 font-black text-xs uppercase tracking-widest px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-50 transition-all hover:border-primary-100 group"
      >
        <LucideArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Return to Care Summary
      </button>

      {/* Node Header */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary-50 rounded-bl-[10rem] -mr-40 -mt-40 transition-transform group-hover:scale-105 duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className={`w-20 h-20 rounded-[2rem] bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-100 shrink-0`}>
            <LucideStethoscope size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{selectedClass.name}</h1>
              <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-100">Live Optimization</div>
            </div>
            <p className="text-primary-600 font-bold text-lg leading-none mb-4">Lead Therapist: {selectedClass.teacher}</p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-[0.15em]">
                <LucideActivity size={14} className="text-primary-400" />
                Node ID: {selectedClass.code}
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-[0.15em]">
                <LucideShieldCheck size={14} className="text-primary-400" />
                Clinical Node: {selectedClass.section}
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-[0.15em]">
                <LucideAward size={14} className="text-primary-400" />
                Room: {selectedClass.room}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex items-center gap-6 group hover:border-primary-100 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
            <LucideClipboardList size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 leading-none">{selectedClass.assignments}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorized Tasks</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex items-center gap-6 group hover:border-teal-100 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
            <LucideAward size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 leading-none">{selectedClass.completed}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Milestones Achieved</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex items-center gap-6 group hover:border-rose-100 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
            <LucideClock size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 leading-none">{selectedClass.pending}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Awaiting Initiation</p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
              <LucideClipboardList size={24} />
            </div>
            Node Therapy Tasks
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Focus:</span>
            <span className="px-4 py-2 bg-slate-900 text-teal-400 text-[10px] font-black uppercase tracking-widest rounded-xl">Pediatric Neuro-Rehab</span>
          </div>
        </div>

        <div className="space-y-6">
          {nodeTasks.length > 0 ? (
            nodeTasks.map((task) => (
              <div key={task.id} className="relative bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-primary-100 transition-all duration-300 group">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(task.status)} transition-colors`}>
                        {task.status}
                      </span>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getUrgencyStyles(task.urgency)}`}>
                        {task.urgency} Urgency
                      </span>
                      <span className="px-4 py-1.5 bg-white text-slate-400 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {task.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{task.title}</h3>
                      <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <LucideCalendar size={14} className="text-slate-300" />
                        Target Date: {task.dueDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative">
                    <button
                      onClick={() => handleTaskAction("Reviewing Protocol", task)}
                      className="px-6 py-4 bg-white text-slate-600 hover:bg-primary-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-100 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                    >
                      <LucideEye size={16} />
                      Review Protocol
                    </button>

                    <div className="relative group/menu">
                      <button className="p-4 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                        <LucideMoreVertical size={20} />
                      </button>

                      <div className="absolute right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible translate-y-2 group-hover/menu:translate-y-0 transition-all duration-300 z-50 overflow-hidden min-w-[240px]">
                        <div className="p-3 grid gap-1">
                          <button
                            onClick={() => handleTaskAction("Exporting Clinical Log", task)}
                            className="flex items-center gap-4 w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-2xl transition-all"
                          >
                            <LucideDownload className="h-4 w-4" />
                            Export Clinical Log
                          </button>
                          {task.status.toLowerCase() !== "completed" && task.status.toLowerCase() !== "submitted" && (
                            <button
                              onClick={() => handleTaskAction("Uploading Performance Log", task)}
                              className="flex items-center gap-4 w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-lg shadow-primary-50 transition-all"
                            >
                              <LucideUpload className="h-4 w-4" />
                              Upload Performance Log
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
              <LucideClipboardList className="h-16 w-16 text-slate-100 mb-6" />
              <p className="text-slate-300 font-black uppercase tracking-widest text-xs">No active therapy tasks found for this node</p>
              <button className="mt-6 text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline transition-all">Refresh Node Data</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
