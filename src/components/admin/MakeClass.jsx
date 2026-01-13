"use client"

import { useState, useEffect } from "react"
import { Plus, Database, Save, Trash2, Edit3, X, Layers, Activity, Calendar, Clock, ClipboardList } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MakeClass({ fetchData }) {
  const [groupName, setGroupName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [schedules, setSchedules] = useState([{ time: "", id: Date.now() }])
  const [activities, setActivities] = useState([{ name: "", id: Date.now() }])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFetchingClasses, setIsFetchingClasses] = useState(true)
  const [editingClass, setEditingClass] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const categories = ["Speech Therapy", "Occupational Therapy", "Behavioral Therapy", "Physical Therapy", "Social Skills Group"]

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

  const addSchedule = () => {
    setSchedules([...schedules, { time: "", id: Date.now() }])
  }

  const removeSchedule = (id) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((s) => s.id !== id))
    }
  }

  const updateSchedule = (id, time) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, time } : s)))
  }

  const addActivity = () => {
    setActivities([...activities, { name: "", id: Date.now() }])
  }

  const removeActivity = (id) => {
    if (activities.length > 1) {
      setActivities(activities.filter((a) => a.id !== id))
    }
  }

  const updateActivity = (id, name) => {
    setActivities(activities.map((a) => (a.id === id ? { ...a, name } : a)))
  }

  const handleEditClass = (classItem) => {
    setIsEditMode(true)
    setEditingClass(classItem)
    setGroupName(classItem.className)
    setSelectedCategory(classItem.category)
    setSchedules(classItem.schedules.map((s, index) => ({ time: s, id: Date.now() + index })))
    setActivities(classItem.activities.map((a, index) => ({ name: a, id: Date.now() + index + 100 })))
  }

  const cancelEdit = () => {
    setIsEditMode(false)
    setEditingClass(null)
    setGroupName("")
    setSelectedCategory("")
    setSchedules([{ time: "", id: Date.now() }])
    setActivities([{ name: "", id: Date.now() }])
  }

  const handleSaveClass = async () => {
    // Filter out empty entries first
    const validSchedules = schedules.filter(s => s.time.trim()).map(s => s.time.trim())
    const validActivities = activities.filter(a => a.name.trim()).map(a => a.name.trim())

    if (!groupName) {
      alert("Please enter a Therapy Group Name")
      return
    }
    if (!selectedCategory) {
      alert("Please select a Clinical Category")
      return
    }
    if (validSchedules.length === 0) {
      alert("Please add at least one valid schedule (e.g., 'Mon 10am')")
      return
    }
    if (validActivities.length === 0) {
      alert("Please add at least one planned activity")
      return
    }

    setLoading(true)

    // const endpoint = isEditMode ? "/api/admin/classes/update" : "/api/admin/create-class" // Use create for now, need implement update later if needed or just use delete/create
    const endpoint = "/api/admin/create-class" // Force create for now to match verified endpoint
    const method = "POST"

    try {
      const classData = {
        // classId: editingClass?._id, // Add back when update endpoint is ready
        category: selectedCategory,
        className: groupName,
        schedules: validSchedules,
        activities: validActivities,
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      })

      if (response.ok) {
        cancelEdit()
        if (fetchData) await fetchData()
        const classesResponse = await fetch("/api/admin/classes")
        const classesData = await classesResponse.json()
        if (classesResponse.ok) setClasses(classesData.classes || [])
        alert("Therapy Group created successfully!")
      } else {
        const err = await response.json()
        alert(`Error: ${err.message}`)
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClass = async (classId) => {
    if (!confirm("Are you sure you want to delete this therapy group?")) return;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Therapy Group Manager</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Clinical Architecture & Session Management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Total Groups </span>
            <p className="text-lg font-black text-slate-800">{classes.length}</p>
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
                <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">Editing Group</p>
                <span className="text-slate-800 font-black">{editingClass?.className}</span>
              </div>
            </div>
            <button onClick={cancelEdit} className="p-2 text-slate-500 hover:text-slate-800 transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Creation Panel */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 relative group overflow-hidden shadow-lg shadow-slate-200/50">
          <div className="relative z-10">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
              <Plus className="text-primary-500" size={22} />
              Create New Group
            </h2>

            <div className="space-y-6">
              {/* Group Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Therapy Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    disabled={isEditMode}
                    placeholder="e.g. Morning Social Skills"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 font-bold text-xs shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Clinical Category</label>
                  <div className="relative group">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-xs appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="">Select Category...</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedules */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Session Schedules</label>
                  <button onClick={addSchedule} className="text-primary-500 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:text-primary-700 transition-colors">
                    <Plus size={14} /> Add Time
                  </button>
                </div>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                  {schedules.map((s, idx) => (
                    <div key={s.id} className="flex gap-2">
                      <div className="relative flex-1">
                        <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text" value={s.time} onChange={(e) => updateSchedule(s.id, e.target.value)}
                          placeholder="e.g. Mon/Wed 10:00 AM"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 font-bold text-xs"
                        />
                      </div>
                      {schedules.length > 1 && (
                        <button onClick={() => removeSchedule(s.id)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Planned Activities</label>
                  <button onClick={addActivity} className="text-teal-500 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:text-teal-700 transition-colors">
                    <Plus size={14} /> Add Activity
                  </button>
                </div>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                  {activities.map((a, idx) => (
                    <div key={a.id} className="flex gap-2">
                      <div className="relative flex-1">
                        <Activity size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text" value={a.name} onChange={(e) => updateActivity(a.id, e.target.value)}
                          placeholder="e.g. Role Playing"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 font-bold text-xs"
                        />
                      </div>
                      {activities.length > 1 && (
                        <button onClick={() => removeActivity(a.id)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <button
                onClick={handleSaveClass}
                disabled={loading}
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                {loading ? <Activity className="animate-spin" size={20} /> : <Save size={20} className="group-hover/btn:scale-110 transition-transform" />}
                <span className="text-[10px] uppercase tracking-[0.2em]">{isEditMode ? "Update Group" : "Create Therapy Group"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Blueprint / Status Panel */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 border border-slate-800 relative overflow-hidden h-full">
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white tracking-tight mb-10 flex items-center gap-4">
                <ClipboardList className="text-teal-400" size={22} />
                Live Preview
              </h2>

              {groupName && selectedCategory ? (
                <div className="space-y-6">
                  <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Group Identifier</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{groupName}</h3>
                    <div className="inline-block px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                      {selectedCategory}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Clock size={12} /> Schedules
                      </p>
                      <div className="space-y-2">
                        {schedules.filter(s => s.time.trim()).map((s, i) => (
                          <div key={i} className="text-xs font-bold text-slate-300">{s.time}</div>
                        ))}
                        {schedules.filter(s => s.time.trim()).length === 0 && <span className="text-xs text-slate-600 italic">None defined</span>}
                      </div>
                    </div>
                    <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Activity size={12} /> Activities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activities.filter(a => a.name.trim()).map((a, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-700 rounded-lg text-[10px] text-white">{a.name}</span>
                        ))}
                        {activities.filter(a => a.name.trim()).length === 0 && <span className="text-xs text-slate-600 italic">None defined</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center border-2 border-dashed border-slate-700 rounded-3xl p-10 opacity-50">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Enter details to generate preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registry */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Database className="text-primary-500" size={24} />
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-widest">Active Groups</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, idx) => (
            <motion.div
              key={cls._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-7 group hover:shadow-xl hover:border-primary-100 transition-all overflow-hidden relative"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                  <Layers size={22} />
                </div>
                <div className="flex gap-2">
                  {/* Edit disabled for now until update endpoint ready */}
                  {/* <button onClick={() => handleEditClass(cls)} className="p-2 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                      <Edit3 size={16} />
                    </button> */}
                  <button onClick={() => handleDeleteClass(cls._id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">{cls.className}</h3>
                <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-6">{cls.category}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                    <div className="flex flex-wrap gap-1">
                      {cls.schedules && cls.schedules.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Activities</p>
                    <div className="flex flex-wrap gap-1">
                      {cls.activities && cls.activities.slice(0, 3).map((a, i) => (
                        <span key={i} className="px-2 py-1 bg-teal-50 rounded-lg text-[10px] font-bold text-teal-600">{a}</span>
                      ))}
                      {cls.activities && cls.activities.length > 3 && <span className="text-[10px] text-slate-400 font-bold">+{cls.activities.length - 3}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {classes.length === 0 && !isFetchingClasses && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">No Therapy Groups Configured</p>
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
