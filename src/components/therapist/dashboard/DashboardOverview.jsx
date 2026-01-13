"use client";

import { motion } from "framer-motion";
import {
  Users,
  Activity,
  ClipboardList,
  CalendarCheck,
  Bell,
  PlusCircle,
  FilePlus,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

// Clinical Stats data
const stats = [
  { title: "Active Patients", value: "156", icon: Users, color: "bg-blue-600 shadow-blue-100" },
  { title: "Therapy Groups", value: "08", icon: Activity, color: "bg-teal-600 shadow-teal-100" },
  { title: "Care Plans Pending", value: "12", icon: ClipboardList, color: "bg-amber-600 shadow-amber-100" },
  { title: "Assessments Scheduled", value: "03", icon: CalendarCheck, color: "bg-indigo-600 shadow-indigo-100" },
];

// Recent clinical activities data
const recentActivities = [
  { type: "assessment", title: "Assessment Submitted", message: "Initial assessment uploaded for Patient ID #882", time: "2 hours ago", icon: FilePlus, color: "text-blue-600 bg-blue-50" },
  { type: "report", title: "Progress Report", message: "Monthly progress review completed for Speech Therapy Group A", time: "4 hours ago", icon: TrendingUp, color: "text-teal-600 bg-teal-50" },
  { type: "session", title: "Session Logged", message: "Occupational therapy session notes finalized for today", time: "1 day ago", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { type: "alert", title: "Clinical Alert", message: "Reminder: Review overdue care plans by tomorrow EOD", time: "2 days ago", icon: Bell, color: "text-rose-600 bg-rose-50" },
];

// Clinical Quick actions
const quickActions = [
  { label: "Initiate Care Plan", description: "Create new therapeutic objectives", icon: FilePlus, color: "text-blue-600 bg-blue-50 border-blue-100" },
  { label: "Schedule Assessment", description: "Assign new evaluation session", icon: CalendarCheck, color: "text-teal-600 bg-teal-50 border-teal-100" },
  { label: "Add Clinical Resource", description: "Upload PDF or video materials", icon: ClipboardList, color: "text-amber-600 bg-amber-50 border-amber-100" },
  { label: "Broadcast Alert", description: "Send emergency notice to parents", icon: Bell, color: "text-rose-600 bg-rose-50 border-rose-100" },
];

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl transition-transform group-hover:rotate-6`}>
              <stat.icon size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Recent Activities */}
        <motion.div
          className="xl:col-span-7 bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Timeline</h2>
              <p className="text-slate-400 font-bold text-sm">Recent system events and patient updates</p>
            </div>
            <button className="px-6 py-3 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                className="flex gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-14 h-14 min-w-[56px] ${activity.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <activity.icon size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-800 leading-none">{activity.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.time}</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{activity.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="xl:col-span-5 space-y-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Immediate Actions</h2>
            <p className="text-slate-400 font-bold text-sm mb-8">Streamlined clinical workflows</p>

            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-6 p-5 rounded-[2rem] border-2 ${action.color} transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden`}
                >
                  <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm text-current">
                    <action.icon size={24} />
                  </div>
                  <div className="text-left font-black">
                    <div className="text-slate-800 text-base mb-0.5">{action.label}</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider">{action.description}</div>
                  </div>
                  <ArrowRight size={20} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-[3rem] p-10 shadow-xl shadow-primary-100 text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-32 blur-3xl transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl font-black mb-2">Need Clinical Support?</h3>
            <p className="text-primary-100/80 font-medium text-sm mb-8 leading-relaxed">Access documentation or contact the administrator for system permissions.</p>
            <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-primary-50 transition-all active:scale-95">
              Contact Admin
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
