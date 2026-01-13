"use client"

import { useState, useMemo } from "react"
import { Search, Edit, Trash2, User, Mail, Phone, Calendar, CheckCircle, XCircle, Users, ShieldCheck, Activity, Filter, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
            {/* Clinician Registry Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-primary-500" size={24} />
                        <h1 className="text-4xl font-black text-white tracking-tighter">Clinician Registry</h1>
                    </div>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Authorized Therapeutic Workforce Database</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Total Registry Count </span>
                        <p className="text-lg font-black text-white">{filteredTeachers.length}</p>
                    </div>
                </div>
            </div>

            {/* Registry Search & Filtering */}
            <div className="bg-slate-900/20 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-900 flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search Clinician Registry (Name, Email, or Subject)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-slate-950/40 border border-slate-900 rounded-3xl text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold text-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-5 bg-slate-900 border border-slate-800 text-slate-400 font-black rounded-3xl hover:bg-slate-800 hover:text-white transition-all flex items-center gap-3 active:scale-95">
                        <Filter size={18} />
                        <span className="text-[10px] uppercase tracking-widest">Filters</span>
                    </button>
                </div>
            </div>

            {/* Registry Feed */}
            <div className="space-y-4">
                {filteredTeachers.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800"
                    >
                        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mx-auto mb-6">
                            <Users size={40} />
                        </div>
                        <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">Registry Null</h2>
                        <p className="text-slate-600 font-bold mt-2">No clinician query results found in the database.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredTeachers.map((teacher, index) => (
                            <motion.div
                                key={teacher._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-7 border border-slate-900 hover:border-slate-800 transition-all group overflow-hidden relative"
                            >
                                {editingTeacher === teacher._id ? (
                                    <div className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Legal Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-primary-500 font-bold text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Email Hash</label>
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-primary-500 font-bold text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Contact Link</label>
                                                <input
                                                    type="tel"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-primary-500 font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={handleSaveEdit} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Update Credentials</button>
                                            <button onClick={handleCancelEdit} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative z-10">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Registry Name</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500">
                                                        <User size={18} />
                                                    </div>
                                                    <span className="text-white font-black tracking-tight">{teacher.name}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Institutional Email</label>
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="text-slate-500" size={16} />
                                                    <span className="text-slate-300 font-bold text-sm truncate max-w-[150px]">{teacher.email}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Registry Status</label>
                                                <div className="flex items-center space-x-3">
                                                    {teacher.isApproved ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                            <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Verified Clinician</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                            <span className="text-rose-500 font-black uppercase text-[10px] tracking-widest">Verification Halted</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Node Assignment</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${teacher.assignedClass ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-500'}`}>
                                                        {teacher.assignedClass || "Unassigned"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-800/50">
                                            <button
                                                onClick={() => handleEditClick(teacher)}
                                                className="flex-1 xl:flex-none p-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-800 active:scale-95"
                                                title="Edit Credentials"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTeacher(teacher._id)}
                                                className="flex-1 xl:flex-none p-4 bg-slate-900 hover:bg-rose-900 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-95"
                                                title="Purge Entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="flex-1 xl:flex-none p-4 bg-slate-950 text-slate-600 rounded-2xl">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute right-0 top-0 w-32 h-32 bg-primary-600/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
