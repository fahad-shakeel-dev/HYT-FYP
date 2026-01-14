"use client"

import { Users, ClipboardList, Clock, BookOpen, UserCheck, UserX, TrendingUp, Activity, ShieldCheck, Zap, BarChart3, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardOverview({ teacherRequests, allStudents, allTeachers, sections, setActiveTab }) {
  const approvedTeachers = allTeachers?.filter((teacher) => teacher.isApproved) || []
  const assignedTeachers = approvedTeachers?.filter((teacher) => teacher.assignedClass) || []
  const unassignedTeachers = approvedTeachers?.filter((teacher) => !teacher.assignedClass) || []

  const stats = [
    {
      title: "Patient Registry",
      value: allStudents?.length || 0,
      icon: Users,
      color: "bg-white",
      border: "border-slate-200",
      accent: "text-primary-600",
      iconBg: "bg-primary-50",
      desc: "Total patients enrolled",
      onClick: () => setActiveTab("all-students"),
    },
    {
      title: "Therapists",
      value: approvedTeachers?.length || 0,
      icon: Users,
      color: "bg-white",
      border: "border-slate-200",
      accent: "text-teal-600",
      iconBg: "bg-teal-50",
      desc: "Active therapy providers",
      onClick: () => setActiveTab("all-teachers"),
    },
    {
      title: "Pending Requests",
      value: teacherRequests?.length || 0,
      icon: Clock,
      color: "bg-white",
      border: "border-slate-200",
      accent: "text-amber-500",
      iconBg: "bg-amber-50",
      desc: "Awaiting approval",
      onClick: () => setActiveTab("pending-teachers"),
    },
    {
      title: "Therapy Groups",
      value: sections?.length || 0,
      icon: BookOpen,
      color: "bg-white",
      border: "border-slate-200",
      accent: "text-primary-600",
      iconBg: "bg-primary-50",
      desc: "Active session groups",
      onClick: () => setActiveTab("class-sections"),
    },
    {
      title: "Assigned Staff",
      value: assignedTeachers?.length || 0,
      icon: UserCheck,
      color: "bg-white",
      border: "border-slate-200",
      accent: "text-emerald-600",
      iconBg: "bg-emerald-50",
      desc: "Therapists with sessions",
      onClick: () => setActiveTab("assign-classes"),
    },
    {
      title: "Available Staff",
      value: unassignedTeachers?.length || 0,
      icon: UserX,
      color: "bg-white",
      border: "border-slate-200",
      accent: "text-rose-500",
      iconBg: "bg-rose-50",
      desc: "Ready for assignment",
      onClick: () => setActiveTab("assign-classes"),
    },
  ]

  return (
    <div className="space-y-8 font-outfit">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-primary-600" size={24} />
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Lumos Care • System Overview</p>
        </div>
        <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
            <p className="text-xs font-black text-emerald-600 uppercase">Operational</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={stat.onClick}
              className={`
                ${stat.color} ${stat.border} border rounded-3xl p-7 cursor-pointer
                hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden
              `}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                    <TrendingUp size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-4 leading-relaxed max-w-[180px]">
                    {stat.desc}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.iconBg} ${stat.accent} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
            </motion.div>
          )
        })}
      </div>

      {/* Advanced Diagnostics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real-time Event Stream */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">System Activity</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Real-time updates</p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em] px-4 py-2 border border-primary-100 rounded-full hover:bg-primary-50 transition-all">
              Export Logs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Users, label: "Patient Enrollment", val: `${allStudents?.length || 0} Patients`, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600" },
              { icon: UserCheck, label: "Therapist Assignment", val: `${assignedTeachers?.length || 0} Assigned`, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
              { icon: Clock, label: "Pending Approvals", val: `${teacherRequests?.length || 0} Awaiting`, color: "amber", bg: "bg-amber-50", text: "text-amber-600" },
              { icon: Zap, label: "System Latency", val: "Optimal (22ms)", color: "teal", bg: "bg-teal-50", text: "text-teal-600" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.text} shrink-0`}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-slate-800">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Index */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <BarChart3 className="text-teal-500" size={24} />
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Performance</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">System metrics</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Phase Completion", val: 84, color: "bg-indigo-500" },
                { label: "Clinician Engagement", val: 92, color: "bg-primary-500" },
                { label: "Data Integrity", val: 100, color: "bg-emerald-500" }
              ].map((bar, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bar.label}</span>
                    <span className="text-xs font-bold text-slate-700">{bar.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.val}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full ${bar.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="text-sky-500 animate-spin-slow" size={18} />
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Global Sync</p>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase"> Status: <span className="text-emerald-600">Active</span></p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  )
}
