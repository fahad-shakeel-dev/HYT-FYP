"use client"

import { useState, useMemo } from "react"
import { Search, Edit, Trash2, User, Mail, Users, Hash, Filter, Activity, ShieldCheck, MoreHorizontal, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-primary-600" size={24} />
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Patient Registry</h1>
                    </div>
                    <p className="text-slate-500 font-bold text-sm">Manage enrolled children & therapy details</p>
                </div>
                <div className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Children</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">{filteredStudents.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Patient Name, Case ID, or Parent Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-sm transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative group min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={semesterFilter}
                            onChange={(e) => setSemesterFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
                        >
                            <option value="">All Phases</option>
                            {semesters.map((sem) => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative group min-w-[180px]">
                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={sectionFilter}
                            onChange={(e) => setSectionFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
                        >
                            <option value="">All Groups</option>
                            {sectionsOptions.map((sec) => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
                            <GraduationCap size={32} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">No Records Found</h2>
                        <p className="text-slate-500 text-sm">No child profiles match your search criteria.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-white rounded-[2rem] p-6 border border-slate-200 hover:shadow-lg hover:border-primary-100 transition-all group relative overflow-hidden"
                            >
                                {editingStudent === student._id ? (
                                    <div className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Patient Name</label>
                                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Parent Email</label>
                                                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Parent Phone</label>
                                                <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Case ID</label>
                                                <input type="text" value={editForm.registrationNumber} onChange={(e) => setEditForm({ ...editForm, registrationNumber: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phase</label>
                                                <select value={editForm.semester} onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-sm">
                                                    {semesters.map((sem) => (
                                                        <option key={sem} value={sem}>{sem}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Group</label>
                                                <select value={editForm.section} onChange={(e) => setEditForm({ ...editForm, section: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-sm">
                                                    {sectionsOptions.map((sec) => (
                                                        <option key={sec} value={sec}>{sec}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button onClick={handleSaveEdit} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-200">Save Changes</button>
                                            <button onClick={handleCancelEdit} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                                                        <User size={18} />
                                                    </div>
                                                    <span className="text-slate-800 font-bold text-sm">{student.name}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parent Email</label>
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="text-slate-400" size={16} />
                                                    <span className="text-slate-600 font-medium text-sm truncate max-w-[150px]">{student.email}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Case ID</label>
                                                <div className="flex items-center space-x-3">
                                                    <Hash className="text-slate-400" size={16} />
                                                    <span className="text-slate-700 font-bold text-sm">{student.registrationNumber}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-md text-xs font-bold">
                                                        {student.semester}
                                                    </div>
                                                    <div className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-xs font-bold">
                                                        {student.section}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                                            <button
                                                onClick={() => handleEditClick(student)}
                                                className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
                                                title="Edit Profile"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStudent(student._id)}
                                                className="p-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-sm"
                                                title="Delete Profile"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-8 flex items-center justify-center gap-4 opacity-40">
                <div className="w-8 h-[1px] bg-slate-300" />
                <ShieldCheck size={14} className="text-slate-400" />
                <div className="w-8 h-[1px] bg-slate-300" />
            </div>
        </div>
    )
}
