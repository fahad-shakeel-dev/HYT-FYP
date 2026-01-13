"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LucideCalendar,
  LucideUsers,
  LucideActivity,
  LucideMapPin,
  LucideClock,
  LucidePlus,
  LucideX,
  LucideChevronRight,
  LucideClipboardList,
  LucideMoreVertical,
  LucideUserCheck,
  LucideStethoscope
} from "lucide-react"

export default function SessionScheduleManagement() {
  const [selectedNode, setSelectedNode] = useState(null)

  // Mock data - mapped to clinical context
  const assignedNodes = [
    {
      id: 1,
      nodeId: "Pediatric-Node-A",
      type: "Speech Therapy",
      phase: 6,
      nodeCode: "A",
      subject: "Articulation & Cognitive Milestone",
      patientCount: 35,
      room: "Clinical Wing - Room 101",
      schedule: "Mon, Wed, Fri - 09:00 AM",
    },
    {
      id: 2,
      nodeId: "Early-Interv-B",
      type: "Occupational Therapy",
      phase: 4,
      nodeCode: "B",
      subject: "Fine Motor Skills Development",
      patientCount: 28,
      room: "Neuro-Rehab - Room 205",
      schedule: "Tue, Thu - 11:00 AM",
    }
  ]

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <LucideCalendar size={28} />
            </div>
            Session Schedules
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-12">Manage clinical node allocations and session rotations</p>
        </div>

        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 group">
          <LucidePlus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Update Session Node</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <LucideActivity size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{assignedNodes.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Nodes</div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-center gap-6">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
            <LucideUsers size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{assignedNodes.reduce((sum, cls) => sum + cls.patientCount, 0)}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Patient Load</div>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {assignedNodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 p-8 group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[6rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                  {node.type}
                </span>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight pt-2">{node.nodeId}</h3>
                <p className="text-slate-400 font-bold text-sm tracking-tight">{node.subject}</p>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-primary-600 transition-all">
                <LucideMoreVertical size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-10 relative z-10">
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                  <LucideUserCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none mb-1">Clinic Phase</span>
                  <span className="text-sm font-black text-slate-700">Phase {node.phase} • Node {node.nodeCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                  <LucideUsers size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none mb-1">Patient Load</span>
                  <span className="text-sm font-black text-slate-700">{node.patientCount} Registered</span>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                  <LucideMapPin size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none mb-1">Consultation Room</span>
                  <span className="text-sm font-black text-slate-700 truncate block">{node.room}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                  <LucideClock size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none mb-1">Rotation Schedule</span>
                  <span className="text-sm font-black text-slate-700">{node.schedule}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10 pt-6 border-t border-slate-50">
              <button
                onClick={() => setSelectedNode(node)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
              >
                View Patient Group
                <LucideChevronRight size={14} />
              </button>
              <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                Configure Node
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Patient List Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full p-10 relative overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10 shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Node Integrity Review</h3>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{selectedNode.nodeId} • {selectedNode.type}</p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LucideX size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 no-scrollbar space-y-3">
                {Array.from({ length: selectedNode.patientCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-sm transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary-600 overflow-hidden shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=Patient+${i + 1}&background=eff6ff&color=2563eb`}
                        alt="Patient"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-800 tracking-tight">Patient Authorization ID-{(i + 1).toString().padStart(3, '0')}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID: REC-2025-{(i + 1).toString().padStart(4, '0')}</span>
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md">Verified</span>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-white text-slate-600 border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end shrink-0">
                <button className="flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                  <LucideStethoscope size={18} />
                  Audit Full Node
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
