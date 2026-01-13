"use client";

import { motion } from "framer-motion";
import {
  LucideUser,
  LucideActivity,
  LucideHome,
  LucideBell,
  LucideCalendar,
  LucideShieldCheck,
  LucideStethoscope,
  LucideTrendingUp,
  LucideMapPin,
  LucideClock,
  LucideChevronRight,
  LucideHeart
} from "lucide-react";

export default function OverviewSection({ studentData, enrolledClasses, notifications, recentAssignments }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1600px] mx-auto space-y-8 pb-12"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-primary-600 rounded-[3rem] p-10 shadow-2xl shadow-primary-100 group">
        <LucideHeart className="absolute right-[-40px] top-[-40px] text-white/10 w-64 h-64 rotate-12 transition-transform group-hover:scale-110 duration-700" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Welcome, {studentData.name}!</h1>
            <p className="text-white/80 font-bold text-lg max-w-2xl">
              Access your child's clinical progress, therapy schedules, and secure medical resources through the Digital Care Dashboard.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black">{enrolledClasses.length}</span>
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Active Nodes</span>
            </div>
            <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black">A-</span>
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Current Phase</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-primary-50/50 -mr-12 -mt-12">
            <LucideUser size={160} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                <LucideShieldCheck size={20} />
              </div>
              Patient Authorization
            </h2>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-primary-600 border border-slate-100 shadow-sm relative overflow-hidden group-hover:border-primary-200 transition-colors">
                <img
                  src={`https://ui-avatars.com/api/?name=${studentData.name}&background=eff6ff&color=2563eb&bold=true`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-2">{studentData.name}</h3>
                <p className="text-primary-600 font-bold text-sm">{studentData.email}</p>
                <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-xl w-fit border border-green-100/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Care Profile</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-t border-slate-50 pt-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Registry Number</span>
                <p className="text-sm font-black text-slate-700 tracking-wider font-mono uppercase">{studentData.registrationNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Specialty</span>
                <p className="text-sm font-black text-slate-700">{studentData.program || "General Rehab"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Therapy Phase</span>
                <p className="text-sm font-black text-slate-700">Phase {studentData.semester}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Clinical Node</span>
                <p className="text-sm font-black text-slate-700">Node {studentData.section}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Node Info */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col overflow-hidden group">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <LucideStethoscope size={20} />
            </div>
            Current Therapy Lead & Facility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 group/item hover:border-teal-200 transition-colors">
              <div className="flex items-center gap-3">
                <LucideMapPin size={16} className="text-teal-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Room</span>
              </div>
              <p className="text-lg font-black text-slate-800">{studentData.room || "Room 302 - Clinical Wing"}</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 group/item hover:border-teal-200 transition-colors">
              <div className="flex items-center gap-3">
                <LucideTrendingUp size={16} className="text-teal-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peer Group Load</span>
              </div>
              <p className="text-lg font-black text-slate-800">{studentData.classInfo?.totalStudents || "0"} Registered Patients</p>
            </div>
          </div>

          <div className="flex-1 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-end min-h-[180px]">
            <LucideActivity className="absolute right-[-30px] top-[-30px] text-white/5 w-60 h-60" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-teal-400 rounded-full"></div>
                <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Authorized Lead Therapist</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{studentData.teacher?.name || "Dr. Hafiza Yusra Tariq"}</h3>
                <p className="text-teal-400 font-bold text-sm uppercase tracking-widest">{studentData.teacher?.subject || "Chief Clinical Therapist"}</p>
              </div>
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/60">
                  <LucideClock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Office: 9AM - 2PM</span>
                </div>
                <button className="text-[10px] font-black text-teal-400 uppercase tracking-widest hover:text-teal-300 transition-colors ml-auto">Request Consultation</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authorized Therapy Nodes */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-[8rem] -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shadow-sm">
                <LucideHome size={24} />
              </div>
              Authorized Therapy Nodes
            </h2>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 hover:text-primary-600 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
              View All Nodes
              <LucideChevronRight size={16} />
            </button>
          </div>

          {enrolledClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 group/node"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                      {cls.program}
                    </span>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover/node:text-primary-600 transition-colors">
                      <LucideActivity size={20} />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{cls.subject}</h3>
                  <p className="text-slate-400 font-bold text-sm mb-6 flex items-center gap-2">
                    <LucideUser size={14} className="text-slate-300" />
                    Lead: Dr. {cls.teacher?.name || "N/A"}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Room Alloc.</span>
                      <span className="text-sm font-black text-slate-600">{cls.room}</span>
                    </div>
                    <div className="flex -space-x-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=P+${i}&background=random`} alt="Peer" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-600 text-white flex items-center justify-center text-[10px] font-black">+{cls.enrolledStudents - 3}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
              <LucideHome className="text-slate-200 mb-4" size={60} />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Nodes Authorized Yet</p>
              <p className="text-slate-300 font-bold text-xs mt-2">Visit therapy enrollment to join a clinical node.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clinical Alerts */}
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 flex flex-col">
          <h2 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
              <LucideBell size={24} />
            </div>
            Recent Clinical Alerts
          </h2>
          {notifications.length > 0 ? (
            <div className="space-y-4 flex-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-6 rounded-[2rem] transition-all border ${notification.read ? "bg-slate-50/50 border-slate-50 grayscale-[0.5]" : "bg-white border-blue-100 shadow-lg shadow-blue-50/50 z-10"
                    } flex items-start gap-5 group hover:border-blue-400`}
                >
                  <div className={`mt-2 w-3 h-3 rounded-full shrink-0 ${notification.read ? "bg-slate-200" : "bg-blue-600 animate-pulse ring-4 ring-blue-50"}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{notification.title}</h3>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{notification.time}</span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <LucideBell className="text-slate-100 mb-4" size={64} />
              <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Clinical Dispatch Clear</p>
            </div>
          )}
        </div>

        {/* Therapy Milestones */}
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 flex flex-col">
          <h2 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">
              <LucideCalendar size={24} />
            </div>
            Upcoming Care Milestones
          </h2>
          {recentAssignments.length > 0 ? (
            <div className="space-y-4 flex-1">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-purple-200 hover:bg-white hover:shadow-xl hover:shadow-purple-50 transition-all flex items-center gap-5 group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm shrink-0">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest font-mono">{assignment.dueDate.split('-')[1]}</span>
                    <span className="text-2xl font-black text-slate-800 leading-none">{assignment.dueDate.split('-')[2]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-800 leading-tight">{assignment.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest px-2 py-0.5 bg-purple-50 rounded-md">{assignment.subject}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <LucideActivity size={10} />
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                  <LucideChevronRight className="text-slate-200 group-hover:text-purple-600 transition-colors" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <LucideCalendar className="text-slate-100 mb-4" size={64} />
              <p className="text-slate-300 font-black uppercase tracking-widest text-xs">No Pending Milestones</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
