"use client"

import { useState } from "react"
import { BookOpen, Users, MapPin, Hash, ChevronDown, ChevronUp, User, Mail, Edit, Trash2, Activity, ShieldCheck, Zap, Globe, Layers } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ClassSections({ sections, allStudents, handleDeleteStudent, handleUpdateStudent }) {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const getStudentsInSection = (semester, section) => {
    return allStudents?.filter((student) => student.semester === semester && student.section === section) || []
  }

  return (
    <div className="space-y-8 font-outfit">
      {/* Unit Registry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Unit Registry</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Institutional Clinical Resource Mapping</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Global Active Nodes </span>
            <p className="text-lg font-black text-white">{sections?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Registry Grid */}
      <div className="space-y-4">
        {sections?.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/10 rounded-[3rem] border border-dashed border-slate-800">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-6">
              <BookOpen size={32} />
            </div>
            <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em]">Zero Clinical Units Discovered</p>
          </div>
        ) : (
          sections?.map((section, idx) => {
            const studentsInSection = getStudentsInSection(section.semester, section.section)
            const isExpanded = expandedSection === section._id

            return (
              <motion.div
                key={section._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group border border-slate-900 rounded-[2rem] overflow-hidden transition-all duration-500 ${isExpanded ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-900/20 hover:border-slate-800'}`}
              >
                {/* Section Header */}
                <div
                  className="p-8 cursor-pointer relative"
                  onClick={() => toggleSection(section._id)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="lg:col-span-4 flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40' : 'bg-slate-900 text-primary-500 group-hover:scale-110'}`}>
                        <Activity size={24} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Inscribed Unit</p>
                        <h3 className="text-lg font-black text-white leading-none">{section.semester} - {section.section}</h3>
                      </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-wrap gap-8 items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Resource ID</p>
                          <span className="text-xs font-bold text-slate-400 font-mono">{section.classId}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="text-secondary-400" size={14} />
                        <div>
                          <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Deployment Zone</p>
                          <span className="text-xs font-black text-white uppercase tracking-widest">Station {section.room || "X"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="text-indigo-400" size={14} />
                        <div>
                          <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Patient Census</p>
                          <span className="text-xs font-black text-white uppercase tracking-widest">{studentsInSection.length} Enrolled</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 flex justify-end">
                      <div className={`w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center transition-all ${isExpanded ? 'bg-slate-800 text-white rotate-180' : 'text-slate-600 group-hover:text-white group-hover:bg-slate-800/50'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-primary-600/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Patient Roster */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-950/50 border-t border-slate-900"
                    >
                      <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-6 mb-6">
                          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Users size={16} /> Unit Patient Ensemble
                          </h4>
                          <div className="flex items-center gap-3">
                            <Zap className="text-primary-500 animate-pulse" size={14} />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time Visibility Active</span>
                          </div>
                        </div>

                        {studentsInSection.length === 0 ? (
                          <div className="py-12 text-center">
                            <p className="text-slate-800 font-black uppercase text-[10px] tracking-widest"> Registry Sub-set Null </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studentsInSection.map((student) => (
                              <div
                                key={student._id}
                                className="p-6 bg-slate-900/50 border border-slate-900 rounded-3xl flex justify-between items-center group/card hover:border-slate-800 transition-all"
                              >
                                <div className="flex gap-4 items-center overflow-hidden">
                                  <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-600 group-hover/card:text-primary-400 transition-colors">
                                    <User size={18} />
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="text-sm font-black text-white truncate">{student.name}</p>
                                    <p className="text-[10px] font-bold text-slate-600 font-mono truncate">{student.email}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const newSemester = prompt("Enter new semester:", student.semester)
                                      const newSection = prompt("Enter new section:", student.section)
                                      if (newSemester && newSection) {
                                        handleUpdateStudent(student._id, {
                                          semester: newSemester,
                                          section: newSection,
                                        })
                                      }
                                    }}
                                    className="p-3 bg-slate-950 text-slate-600 hover:text-primary-500 hover:bg-slate-900 rounded-xl transition-all"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteStudent(student._id)
                                    }}
                                    className="p-3 bg-slate-950 text-slate-600 hover:text-rose-500 hover:bg-rose-950/20 rounded-xl transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>

      <div className="p-8 bg-slate-900/20 border border-slate-900 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-slate-600" size={24} />
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Registry Integrity Secured</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Automated audit trails active across all nodes</p>
          </div>
        </div>
        <Globe className="text-slate-800 animate-spin-slow" size={24} />
      </div>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  )
}
