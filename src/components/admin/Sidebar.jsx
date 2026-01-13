"use client"

import {
  LayoutDashboard,
  Plus,
  Clock,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Menu,
  X,
  Settings,
  ShieldCheck,
  Activity,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  teacherRequests,
  allStudents,
  allTeachers,
  sections,
  classes,
  hasActiveSession,
}) {
  const menuItems = [
    {
      id: "session-management",
      label: "Phase Governance",
      icon: Settings,
      count: null,
      alwaysEnabled: true,
      desc: "System cycles & active sessions"
    },
    {
      id: "dashboard",
      label: "Governance Analytics",
      icon: LayoutDashboard,
      count: null,
      desc: "High-level diagnostic overview"
    },
    {
      id: "pending-teachers",
      label: "Therapist Verification",
      icon: Clock,
      count: teacherRequests?.length || 0,
      desc: "Awaiting clinical approval"
    },
    {
      id: "all-teachers",
      label: "Clinician Registry",
      icon: Users,
      count: allTeachers?.length || 0,
      desc: "Authorized medical personnel"
    },
    {
      id: "all-students",
      label: "Patient Registrar",
      icon: GraduationCap,
      count: allStudents?.length || 0,
      desc: "Unified patient database"
    },
    {
      id: "make-class",
      label: "Node Architecture",
      icon: Plus,
      count: null,
      desc: "Create new therapy nodes"
    },
    {
      id: "assign-classes",
      label: "Node Provisioning",
      icon: UserCheck,
      count: null,
      desc: "Assign clinicians to nodes"
    },
    {
      id: "class-sections",
      label: "Clinical Node Registry",
      icon: BookOpen,
      count: classes?.length || 0,
      desc: "Active therapeutic sections"
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl active:scale-95 transition-transform"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-900
        transform transition-all duration-300 ease-in-out font-outfit
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Institutional Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-primary-900/40">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1">Governance</h1>
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Institutional Root</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${hasActiveSession ? "bg-slate-900/50 border-slate-800" : "bg-rose-950/20 border-rose-900/30"}`}>
              <div className={`w-2 h-2 rounded-full ${hasActiveSession ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${hasActiveSession ? "text-emerald-400" : "text-rose-400"}`}>
                {hasActiveSession ? "Active Phase Verified" : "System Propagation Halted"}
              </span>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              const isDisabled = !hasActiveSession && !item.alwaysEnabled

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }
                  }}
                  disabled={isDisabled}
                  className={`
                    w-full group flex flex-col p-4 rounded-2xl text-left transition-all relative
                    ${isActive
                      ? "bg-primary-600 text-white shadow-2xl shadow-primary-900/20 active:scale-[0.98]"
                      : isDisabled
                        ? "text-slate-600 cursor-not-allowed opacity-40"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-white" : "group-hover:text-primary-400 transition-colors"} />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span
                        className={`
                        text-[9px] font-black px-2 py-0.5 rounded-full
                        ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}
                      `}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-medium leading-none pl-7 ${isActive ? "text-white/60" : "text-slate-600"}`}>
                    {item.desc}
                  </p>
                </button>
              )
            })}
          </nav>

          {/* Performance Footer */}
          <div className="p-8 pt-4">
            <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-primary-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network Latency</span>
              </div>
              <span className="text-[10px] font-black text-emerald-500">22ms</span>
            </div>
            <p className="text-[7px] font-black text-slate-700 uppercase tracking-[0.4em] text-center mt-6">
              Institutional Ops • 2025
            </p>
          </div>
        </div>
      </div>

      {/* Optimized Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}
