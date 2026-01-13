"use client"

import { Users, GraduationCap, Clock, BookOpen, UserCheck, UserX, TrendingUp, Activity, ShieldCheck, Zap, BarChart3, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardOverview({ teacherRequests, allStudents, allTeachers, sections, setActiveTab }) {
  const approvedTeachers = allTeachers?.filter((teacher) => teacher.isApproved) || []
  const assignedTeachers = approvedTeachers?.filter((teacher) => teacher.assignedClass) || []
  const unassignedTeachers = approvedTeachers?.filter((teacher) => !teacher.assignedClass) || []

  const stats = [
    {
      title: "Patient Registrar",
      value: allStudents?.length || 0,
      icon: GraduationCap,
      color: "bg-slate-900",
      accent: "text-primary-400",
      desc: "Total registered patients in network",
      onClick: () => setActiveTab("all-students"),
    },
    {
      title: "Clinician Registry",
      value: approvedTeachers?.length || 0,
      icon: Users,
      color: "bg-slate-900",
      accent: "text-teal-400",
      desc: "Authorized medical professionals",
      onClick: () => setActiveTab("all-teachers"),
    },
    {
      title: "Credentialing Queue",
      value: teacherRequests?.length || 0,
      icon: Clock,
      color: "bg-slate-900",
      accent: "text-amber-400",
      desc: "Applications awaiting verification",
      onClick: () => setActiveTab("pending-teachers"),
    },
    {
      title: "Therapeutic Nodes",
      value: sections?.length || 0,
      icon: BookOpen,
      color: "bg-slate-900",
      accent: "text-primary-400",
      desc: "Active therapy session units",
      onClick: () => setActiveTab("class-sections"),
    },
    {
      title: "Node Saturation",
      value: assignedTeachers?.length || 0,
      icon: UserCheck,
      color: "bg-slate-900",
      accent: "text-emerald-400",
      desc: "Clinicians actively providing care",
      onClick: () => setActiveTab("assign-classes"),
    },
    {
      title: "Available Personnel",
      value: unassignedTeachers?.length || 0,
      icon: UserX,
      color: "bg-slate-900",
      accent: "text-rose-400",
      desc: "Staff ready for node assignment",
      onClick: () => setActiveTab("assign-classes"),
    },
  ]

  return (
    <div className="space-y-8 font-outfit">
      {/* Governance Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Governance Analytics</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Institutional Root Overview • 2025</p>
        </div>
        <div className="flex items-center gap-6 px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">System Status</p>
            <p className="text-xs font-black text-emerald-500 uppercase">Operational</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
          </div>
        </div>
      </div>

      {/* High-Density Metric Grid */}
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
                ${stat.color} border border-slate-800 rounded-3xl p-7 cursor-pointer
                hover:border-primary-500/50 hover:bg-slate-900/50 transition-all duration-300 group relative overflow-hidden
              `}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                    <TrendingUp size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-4 leading-relaxed max-w-[180px]">
                    {stat.desc}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-slate-800/50 ${stat.accent} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-600/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )
        })}
      </div>

      {/* Advanced Diagnostics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real-time Event Stream */}
        <div className="xl:col-span-2 bg-slate-900/30 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-900 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Clinical Infrastructure Activity</h2>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Real-time status stream</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] px-4 py-2 border border-primary-500/20 rounded-full hover:bg-primary-500/10 transition-all">
              Export Global Logs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, label: "Network Growth", val: `${allStudents?.length || 0} Entities Registered`, color: "emerald" },
              { icon: UserCheck, label: "Node Saturation", val: `${assignedTeachers?.length || 0} Clinicians Provisioned`, color: "blue" },
              { icon: Clock, label: "Pending Verification", val: `${teacherRequests?.length || 0} Credentials Awaiting Review`, color: "amber" },
              { icon: Zap, label: "System Latency", val: "Optimal Performance (22ms)", color: "teal" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-950/40 border border-slate-900/50 group hover:border-slate-800 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500 shrink-0`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-black text-slate-200">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Index */}
        <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <BarChart3 className="text-teal-400" size={24} />
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Diagnostic Index</h2>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Institutional performance</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Phase Completion", val: 84 },
                { label: "Clinician Engagement", val: 92 },
                { label: "Data Integrity", val: 100 }
              ].map((bar, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bar.label}</span>
                    <span className="text-xs font-black text-white">{bar.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.val}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full bg-gradient-to-r ${i === 2 ? 'from-teal-500 to-emerald-400' : 'from-primary-600 to-indigo-500'} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-primary-500 animate-spin-slow" size={18} />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Registry Sync</p>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase"> Last Synchronization: <span className="text-white">Active Now</span></p>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-[50px] -z-0" />
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
