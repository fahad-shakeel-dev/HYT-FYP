"use client";

import { motion } from "framer-motion";
import {
    Users,
    Activity,
    ClipboardList,
    CalendarCheck,
    Bell,
    FilePlus,
    ArrowRight,
    TrendingUp,
    Clock
} from "lucide-react";

// Simplified stats for the therapist
const stats = [
    { title: "Active Patients", value: "12", icon: Users, color: "from-blue-500 to-blue-600 shadow-blue-200" },
    { title: "Reports Due", value: "05", icon: ClipboardList, color: "from-amber-500 to-amber-600 shadow-amber-200" },
    { title: "Upcoming Sessions", value: "03", icon: CalendarCheck, color: "from-teal-500 to-teal-600 shadow-teal-200" },
    { title: "New Messages", value: "02", icon: Bell, color: "from-indigo-500 to-indigo-600 shadow-indigo-200" },
];

export default function DashboardOverview({ setActiveSection }) {
    return (
        <div className="space-y-12">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Therapist Dashboard</h2>
                    <p className="text-slate-500 font-bold text-lg mt-2">Welcome back to your clinical portal</p>
                </div>
                <button
                    onClick={() => setActiveSection("patients")}
                    className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3"
                >
                    <Users size={20} />
                    View All Patients
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-[1.5rem] flex items-center justify-center text-white mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            <stat.icon size={40} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors duration-500 z-0" />
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                        <Activity className="text-primary-600" />
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <FilePlus size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Report Uploaded</h4>
                                <p className="text-xs text-slate-400 mt-1">Monthly progress report for <span className="text-slate-600 font-bold">Sarah A.</span></p>
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-2 block">2 hours ago</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Session Completed</h4>
                                <p className="text-xs text-slate-400 mt-1">Speech Therapy session with <span className="text-slate-600 font-bold">Mike T.</span></p>
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-2 block">Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <h3 className="text-xl font-black mb-2 relative z-10">Quick Actions</h3>
                    <p className="text-slate-400 text-sm font-medium mb-8 relative z-10">Manage your clinical workflow efficiently.</p>

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        <button
                            onClick={() => setActiveSection("patients")}
                            className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary-500 rounded-xl">
                                    <Users size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-sm">Patient Registry</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">View all profiles</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>

                        <button className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-amber-500 rounded-xl">
                                    <FilePlus size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-sm">Upload Reports</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Batch processing</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
