"use client"

import { useState, useEffect } from "react"
import { Plus, BookOpen, Save, Trash2, CheckCircle, GraduationCap, Edit3, X, ShieldCheck, Activity, Zap, Layers, ChevronRight, ClipboardList } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MakeClass({ fetchData }) {
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSections, setSelectedSections] = useState([])
  const [subjects, setSubjects] = useState([{ name: "", id: Date.now() }])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [createdClasses, setCreatedClasses] = useState([])
  const [isFetchingClasses, setIsFetchingClasses] = useState(true)
  const [editingClass, setEditingClass] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const programs = ["BSCS", "BBA", "ADP CS"]
  const semesters = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8"]
  const sections = ["Section A", "Section B", "Section C", "Section D", "Section E", "Section F"]

  const generateClassName = (program, semester, sections) => {
    if (!program || !semester || sections.length === 0) return ""
    return `${program} ${semester} ${sections.sort().join("")}`
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsFetchingClasses(true)
        const response = await fetch("/api/admin/classes")
        const data = await response.json()
        if (response.ok) {
          setClasses(data.classes || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsFetchingClasses(false)
      }
    }
    fetchClasses()
  }, [])

  const handleSectionChange = (section) => {
    setSelectedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const addSubject = () => {
    setSubjects([...subjects, { name: "", id: Date.now() }])
  }

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((subject) => subject.id !== id))
    }
  }

  const updateSubject = (id, name) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, name } : subject)))
  }

  const handleEditClass = (classItem) => {
    setIsEditMode(true)
    setEditingClass(classItem)
    setSelectedProgram(classItem.program)
    setSelectedSemester(classItem.semester)
    setSelectedSections([...classItem.sections])
    setSubjects(classItem.subjects.map((subject, index) => ({ name: subject, id: Date.now() + index })))
  }

  const cancelEdit = () => {
    setIsEditMode(false)
    setEditingClass(null)
    setSelectedProgram("")
    setSelectedSemester("")
    setSelectedSections([])
    setSubjects([{ name: "", id: Date.now() }])
  }

  const handleSaveClass = async () => {
    if (!selectedProgram || !selectedSemester || selectedSections.length === 0 || subjects.some((s) => !s.name.trim())) {
      return
    }

    const className = generateClassName(selectedProgram, selectedSemester, selectedSections)
    setLoading(true)

    const endpoint = isEditMode ? "/api/admin/classes/update" : "/api/admin/create-class"
    const method = isEditMode ? "PUT" : "POST"

    try {
      const classData = {
        classId: editingClass?._id,
        program: selectedProgram,
        className,
        semester: selectedSemester,
        sections: selectedSections,
        subjects: subjects.filter((s) => s.name.trim()).map((s) => s.name.trim()),
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      })

      if (response.ok) {
        if (!isEditMode) {
          setCreatedClasses(prev => [{ ...classData, id: Date.now(), createdAt: new Date().toISOString() }, ...prev])
        }
        cancelEdit()
        if (fetchData) await fetchData()
        const classesResponse = await fetch("/api/admin/classes")
        const classesData = await classesResponse.json()
        if (classesResponse.ok) setClasses(classesData.classes || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch("/api/admin/classes/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId }),
      })
      if (response.ok) {
        const classesResponse = await fetch("/api/admin/classes")
        const classesData = await classesResponse.json()
        if (classesResponse.ok) setClasses(classesData.classes || [])
        if (fetchData) await fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-8 font-outfit">
      {/* Node Construction Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Session Configuration</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Architecture & Session Group Management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Total Configured Sessions </span>
            <p className="text-lg font-black text-white">{classes.length}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditMode && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 bg-primary-600/10 border border-primary-600/20 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-500">
                <Edit3 size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">Editing Registry Unit</p>
                <span className="text-white font-black">{editingClass?.className}</span>
              </div>
            </div>
            <button onClick={cancelEdit} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Architect Panel */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-900 relative group overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
              {/* <h2 className="text-xl font-black text-white tracking-tight mb-8 flex items-center gap-3"> */}
              <Plus className="text-primary-500" size={22} />
              Session Architect
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Program / Department</label>
                  <div className="relative group">
                    <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} disabled={isEditMode} className="w-full pl-6 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer hover:bg-slate-950 transition-all disabled:opacity-30">
                      <option value="">Division Taxonomy...</option>
                      {programs.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 rotate-90 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Session Phase</label>
                  <div className="relative">
                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full pl-6 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer">
                      <option value="">Phase Registry...</option>
                      {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Target Sections (Select all that apply)</label>
                <div className="grid grid-cols-3 gap-3">
                  {sections.map(sec => (
                    <button key={sec} onClick={() => handleSectionChange(sec)} className={`px-4 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${selectedSections.includes(sec) ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-950/20' : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800'}`}>
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Activities / Disciplines</label>
                  <button onClick={addSubject} className="text-secondary-400 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                    <Plus size={14} /> Add Activity
                  </button>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                  {subjects.map((s, idx) => (
                    <div key={s.id} className="flex gap-2">
                      <input
                        type="text" value={s.name} onChange={(e) => updateSubject(s.id, e.target.value)}
                        placeholder={`Discipline ${idx + 1}...`}
                        className="flex-1 px-6 py-4 bg-slate-950/50 border border-slate-900 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-primary-500 font-bold text-xs"
                      />
                      {subjects.length > 1 && (
                        <button onClick={() => removeSubject(s.id)} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <button
                onClick={handleSaveClass}
                disabled={loading || !selectedProgram || !selectedSemester || selectedSections.length === 0}
                className="w-full py-5 bg-primary-600 hover:bg-emerald-600 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-950/20 active:scale-95 disabled:opacity-30 group/btn"
              >
                {loading ? <Activity className="animate-spin" size={20} /> : <Save size={20} className="group-hover/btn:scale-110 transition-transform" />}
                <span className="text-[10px] uppercase tracking-[0.2em]">{isEditMode ? "Update Configuration" : "Create Session Group"}</span>
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-primary-600/5 blur-[80px] -z-0" />
        </div>

        {/* Blueprint Viewer */}
        <div className="space-y-8">
          <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden h-full">
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white tracking-tight mb-10 flex items-center gap-4">
                <Activity className="text-teal-400" size={22} />
                Configuration Blueprint
              </h2>

              {selectedProgram && selectedSemester && selectedSections.length > 0 ? (
                <div className="space-y-6">
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Inscribed Identifier</p>
                        <h3 className="text-2xl font-black text-white tracking-tighter">{generateClassName(selectedProgram, selectedSemester, selectedSections)}</h3>
                      </div>
                      <div className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                        <span className="text-[9px] font-black text-teal-500 uppercase">Valid Config</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-2">Hierarchy</p>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-300">{selectedProgram}</p>
                          <p className="text-xs font-bold text-slate-400">{selectedSemester}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-2">Affected Sections</p>
                        <p className="text-xs font-black text-primary-400">{selectedSections.join(", ")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Included Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {subjects.filter(s => s.name.trim()).map(s => (
                        <div key={s.id} className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                          {s.name}
                        </div>
                      ))}
                      {subjects.filter(s => s.name.trim()).length === 0 && <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Null Set</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center border-2 border-dashed border-slate-900 rounded-3xl p-10">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mb-6">
                    <ClipboardList size={32} />
                  </div>
                  <p className="text-slate-600 font-black uppercase text-[11px] tracking-[0.3em] leading-relaxed">CONFIGURE SESSION PARAMETERS TO VIEW BLUEPRINT</p>
                </div>
              )}
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500/5 blur-[100px]" />
          </div>
        </div>
      </div>

      {/* Institutional unit Registry */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Database className="text-primary-500" size={24} />
            <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Active Session Registry</h2>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest"> Registry Phase: {new Date().getFullYear()} </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, idx) => (
            <motion.div
              key={cls._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-[2.5rem] p-7 group hover:border-slate-800 transition-all overflow-hidden relative"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                    <Layers size={22} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(cls)} className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDeleteClass(cls._id)} className="p-2.5 bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-500 rounded-xl transition-all border border-transparent hover:border-rose-900/50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white tracking-tighter mb-4">{cls.className}</h3>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-600">Department</span>
                    <span className="text-slate-300">{cls.program}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-600">Active Sections</span>
                    <span className="text-primary-400">{cls.sections.join(", ")}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50">
                  <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-3">Activities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.subjects.slice(0, 3).map((sub, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-950 rounded-lg text-[8px] font-black text-slate-500 uppercase border border-slate-900">{sub}</span>
                    ))}
                    {cls.subjects.length > 3 && <span className="px-2 py-1 text-[8px] font-black text-primary-600 uppercase">+{cls.subjects.length - 3} More</span>}
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary-600/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
          {classes.length === 0 && !isFetchingClasses && (
            <div className="col-span-full py-20 text-center border border-dashed border-slate-900 rounded-[3rem]">
              <p className="text-slate-700 font-black uppercase text-xs tracking-[0.5em]">No Sessions Configured</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
