"use client"

import { useState, useMemo } from "react"
import { Search, Edit, Trash2, User, Mail, Phone, GraduationCap, Hash, MapPin, Calendar, Filter, Activity, ShieldCheck, MoreHorizontal, UserCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AllStudents({ allStudents, handleDeleteStudent, handleUpdateStudent, sections }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [semesterFilter, setSemesterFilter] = useState("")
    const [sectionFilter, setSectionFilter] = useState("")
    const [editingStudent, setEditingStudent] = useState(null)
    const [editForm, setEditForm] = useState({})

    const semesters = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8"]
    const sectionsOptions = ["Node A", "Node B", "Node C", "Node D", "Node E", "Node F"]

    const filteredStudents = useMemo(() => {
        return (
            allStudents?.filter((student) => {
                const matchesSearch =
                    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())

                const matchesSemester = !semesterFilter || student.semester === semesterFilter
                const matchesSection = !sectionFilter || student.section === sectionFilter

                return matchesSearch && matchesSemester && matchesSection
            }) || []
        )
    }, [allStudents, searchTerm, semesterFilter, sectionFilter])

    const handleEditClick = (student) => {
        setEditingStudent(student._id)
        setEditForm({
            name: student.name,
            email: student.email,
            phone: student.phone,
            semester: student.semester,
            section: student.section,
            registrationNumber: student.registrationNumber,
        })
    }

    const handleSaveEdit = async () => {
        await handleUpdateStudent(editingStudent, editForm)
        setEditingStudent(null)
        setEditForm({})
    }

    const handleCancelEdit = () => {
        setEditingStudent(null)
        setEditForm({})
    }

    return (
        <div className="space-y-8 font-outfit">
            {/* Patient Registrar Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="text-secondary-400" size={24} />
                        <h1 className="text-4xl font-black text-white tracking-tighter">Patient Registrar</h1>
                    </div>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Institutional Patient Database & Demographics</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Total Registry Count </span>
                        <p className="text-lg font-black text-white">{filteredStudents.length}</p>
                    </div>
                </div>
            </div>

            {/* Advanced Registry Search & Filtering */}
            <div className="bg-slate-900/20 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-900 space-y-6">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search Patients (Legal Name, Identification ID, or Registry Email)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-slate-950/40 border border-slate-900 rounded-3xl text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-secondary-400/5 focus:border-secondary-400 transition-all font-bold text-sm"
                        />
                    </div>
                    <div className="flex gap-4">
                        {/* Phase Filter */}
                        <div className="relative group min-w-[180px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary-400" size={16} />
                            <select
                                value={semesterFilter}
                                onChange={(e) => setSemesterFilter(e.target.value)}
                                className="w-full pl-12 pr-8 py-5 bg-slate-950/40 border border-slate-900 rounded-3xl text-white focus:outline-none focus:ring-4 focus:ring-secondary-400/5 focus:border-secondary-400 transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                            >
                                <option value="">All Phases</option>
                                {semesters.map((sem) => (
                                    <option key={sem} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </div>
                        {/* Node Filter */}
                        <div className="relative group min-w-[180px]">
                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary-400" size={16} />
                            <select
                                value={sectionFilter}
                                onChange={(e) => setSectionFilter(e.target.value)}
                                className="w-full pl-12 pr-8 py-5 bg-slate-950/40 border border-slate-900 rounded-3xl text-white focus:outline-none focus:ring-4 focus:ring-secondary-400/5 focus:border-secondary-400 transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                            >
                                <option value="">All Nodes</option>
                                {sectionsOptions.map((sec) => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Registry Feed */}
            <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800"
                    >
                        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mx-auto mb-6">
                            <GraduationCap size={40} />
                        </div>
                        <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">Registry Null</h2>
                        <p className="text-slate-600 font-bold mt-2">No patient query results found in the institutional database.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-7 border border-slate-900 hover:border-slate-800 transition-all group overflow-hidden relative"
                            >
                                {editingStudent === student._id ? (
                                    <div className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Legal Full Name</label>
                                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-secondary-400 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Registry Email</label>
                                                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-secondary-400 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Contact Link</label>
                                                <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-secondary-400 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Inscribed ID</label>
                                                <input type="text" value={editForm.registrationNumber} onChange={(e) => setEditForm({ ...editForm, registrationNumber: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-secondary-400 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Clinical Phase</label>
                                                <select value={editForm.semester} onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-secondary-400 font-black text-xs uppercase tracking-widest">
                                                    {semesters.map((sem) => (
                                                        <option key={sem} value={sem}>{sem}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Governance Node</label>
                                                <select value={editForm.section} onChange={(e) => setEditForm({ ...editForm, section: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-secondary-400 font-black text-xs uppercase tracking-widest">
                                                    {sectionsOptions.map((sec) => (
                                                        <option key={sec} value={sec}>{sec}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={handleSaveEdit} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Synchronize Update</button>
                                            <button onClick={handleCancelEdit} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative z-10">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Patient Identity</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-secondary-400/10 rounded-xl flex items-center justify-center text-secondary-400">
                                                        <User size={18} />
                                                    </div>
                                                    <span className="text-white font-black tracking-tight">{student.name}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Institutional Email</label>
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="text-slate-500" size={16} />
                                                    <span className="text-slate-300 font-bold text-sm truncate max-w-[150px]">{student.email}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Registry ID</label>
                                                <div className="flex items-center space-x-3">
                                                    <Hash className="text-slate-500" size={16} />
                                                    <span className="text-slate-300 font-black text-xs tracking-widest">{student.registrationNumber}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Cluster Hierarchy</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-3 py-1 bg-secondary-400/10 text-secondary-400 border border-secondary-400/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                        {student.semester}
                                                    </div>
                                                    <div className="px-3 py-1 bg-primary-600/10 text-primary-400 border border-primary-600/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                        {student.section}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-800/50">
                                            <button
                                                onClick={() => handleEditClick(student)}
                                                className="flex-1 xl:flex-none p-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-800 active:scale-95"
                                                title="Edit Records"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStudent(student._id)}
                                                className="flex-1 xl:flex-none p-4 bg-slate-900 hover:bg-rose-900 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-95"
                                                title="Archive Patient"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <div className="flex-1 xl:flex-none p-4 bg-slate-950 text-slate-600 rounded-2xl cursor-default">
                                                <MoreHorizontal size={18} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute right-0 top-0 w-32 h-32 bg-secondary-400/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-10 flex items-center justify-center gap-6 opacity-30">
                <div className="w-12 h-[1px] bg-slate-900" />
                <ShieldCheck size={14} className="text-slate-500" />
                <div className="w-12 h-[1px] bg-slate-900" />
            </div>
        </div>
    )
}
