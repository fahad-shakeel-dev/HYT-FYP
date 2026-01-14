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
  LogOut,
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
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "System Overview",
      icon: LayoutDashboard,
      count: null,
      desc: "Dashboard & Analytics"
    },
    {
      id: "pending-teachers",
      label: "Therapist Requests",
      icon: Clock,
      count: teacherRequests?.length || 0,
      desc: "Pending approval queue"
    },
    {
      id: "all-teachers",
      label: "Manage Therapists",
      icon: Users,
      count: allTeachers?.length || 0,
      desc: "Active accounts"
    },
    {
      id: "all-students",
      label: "Child Profiles",
      icon: GraduationCap,
      count: allStudents?.length || 0,
      desc: "Enrolled children"
    },
    {
      id: "make-class",
      label: "Create Group",
      icon: Plus,
      count: null,
      desc: "New therapy groups"
    },
    {
      id: "assign-classes",
      label: "Assign Therapist",
      icon: UserCheck,
      count: null,
      desc: "Link therapists"
    },
    {
      id: "class-sections",
      label: "Therapy Groups",
      icon: BookOpen,
      count: classes?.length || 0,
      desc: "Active sections"
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`
        fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200
        transform transition-all duration-300 ease-in-out font-outfit
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Institutional Header */}
          <div className="p-8 pb-6 flex-none">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-primary-600/20">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Clinic Admin</h1>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Clinical Management</p>
              </div>
            </div>


          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full group flex flex-col p-4 rounded-2xl text-left transition-all relative
                    ${isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-4 ring-primary-50"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-primary-500 transition-colors"} />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span
                        className={`
                        text-[9px] font-bold px-2 py-0.5 rounded-full
                        ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm"}
                      `}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-medium leading-none pl-7 ${isActive ? "text-white/80" : "text-slate-400"}`}>
                    {item.desc}
                  </p>
                </button>
              )
            })}
          </nav>

          {/* Footer & Sign Out */}
          <div className="p-8 pt-6 flex-none mt-auto border-t border-slate-100 bg-white z-20">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full p-4 rounded-2xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center gap-3 group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider">Sign Out</p>
                <p className="text-[10px] font-medium opacity-60">End session</p>
              </div>
            </button>
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
            className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
