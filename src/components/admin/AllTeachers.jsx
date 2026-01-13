"use client"

import { useState, useMemo } from "react"
import { Search, Edit, Trash2, User, Mail, Users, ShieldCheck, Filter, MoreHorizontal, Check, X } from "lucide-react"
import { motion } from "framer-motion"

export default function AllTeachers({ allTeachers, handleDeleteTeacher, handleUpdateTeacher }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [editingTeacher, setEditingTeacher] = useState(null)
    const [editForm, setEditForm] = useState({})

    const filteredTeachers = useMemo(() => {
        return (
            allTeachers?.filter((teacher) => {
                const matchesSearch =
                    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())

                return matchesSearch
            }) || []
        )
    }, [allTeachers, searchTerm])

    const handleEditClick = (teacher) => {
        setEditingTeacher(teacher._id)
        setEditForm({
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
        })
    }

    const handleSaveEdit = async () => {
        await handleUpdateTeacher(editingTeacher, editForm)
        setEditingTeacher(null)
        setEditForm({})
    }

    const handleCancelEdit = () => {
        setEditingTeacher(null)
        setEditForm({})
    }

    return (
        <div className="space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-teal-600" size={24} />
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Therapists</h1>
                    </div>
                    <p className="text-slate-500 font-bold text-sm">Manage authorized providers</p>
                </div>
                <div className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Staff</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">{filteredTeachers.length}</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search Therapists (Name, Email)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold text-sm transition-all"
                    />
                </div>
                <div>
                    <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm">
                        <Filter size={18} />
                        <span className="text-xs uppercase tracking-wider">Filters</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredTeachers.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
                            <Users size={32} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">No Records Found</h2>
                        <p className="text-slate-500 text-sm">No therapist profiles match your search criteria.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredTeachers.map((teacher, index) => (
                            <motion.div
                                key={teacher._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-white rounded-[2rem] p-6 border border-slate-200 hover:shadow-lg hover:border-teal-100 transition-all group relative overflow-hidden"
                            >
                                {editingTeacher === teacher._id ? (
                                    <div className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone</label>
                                                <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button onClick={handleSaveEdit} className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-teal-200">Save Changes</button>
                                            <button onClick={handleCancelEdit} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 shrink-0">
                                                        <User size={18} />
                                                    </div>
                                                    <span className="text-slate-800 font-bold text-sm">{teacher.name}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="text-slate-400" size={16} />
                                                    <span className="text-slate-600 font-medium text-sm truncate max-w-[150px]">{teacher.email}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                                <div className="flex items-center space-x-3">
                                                    {teacher.isApproved ? (
                                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                                                            <Check size={12} strokeWidth={3} />
                                                            <span className="font-bold text-xs">Active</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md">
                                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                            <span className="font-bold text-xs">Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignment</label>
                                                <div className={`px-2.5 py-1 rounded-md text-xs font-bold inline-block border ${teacher.assignedClass ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                                    {teacher.assignedClass || "Unassigned"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                                            <button
                                                onClick={() => handleEditClick(teacher)}
                                                className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
                                                title="Edit Profile"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTeacher(teacher._id)}
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
