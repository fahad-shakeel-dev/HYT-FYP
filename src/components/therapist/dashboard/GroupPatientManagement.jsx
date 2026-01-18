"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LucideUsers,
    LucideSearch,
    LucideMessageCircle,
    LucideMoreVertical,
    LucideActivity,
    LucideShare2, // For broadcast
    Filter,
    Users
} from "lucide-react";
import ShareResourceModal from "./ShareResourceModal";

export default function GroupPatientManagement({ groupId, groupName, groupSubject, preloadedStudents = [], groupDays = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState(preloadedStudents);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareRecipient, setShareRecipient] = useState(null); // { id, name } or null for broadcast
    const [shareGroup, setShareGroup] = useState(null); // { id, name } or null for private

    useEffect(() => {
        setPatients(preloadedStudents);
    }, [preloadedStudents]);

    const handleBroadcast = () => {
        setShareRecipient(null);
        setShareGroup({ id: groupId, name: groupSubject || "Group" });
        setIsModalOpen(true);
    };

    const handlePrivateMessage = (patient) => {
        setShareGroup(null);
        setShareRecipient({ id: patient._id, name: patient.name });
        setIsModalOpen(true);
    };

    const filteredPatients = patients.filter((patient) => {
        return (
            (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <LucideActivity className="animate-spin text-primary-600" size={48} />
                <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Group Records...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            <ShareResourceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                recipient={shareRecipient}
                group={shareGroup}
                onSend={() => console.log("Sent!")}
            />

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
                            Allocated Group
                        </span>
                        {groupDays && groupDays.length > 0 && (
                            <span className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100">
                                {groupDays.length} Day{groupDays.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    
                    {/* Group Title */}
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">
                            {groupSubject || "Therapy Group"}
                        </h2>
                        
                        {/* Days - Professional Display */}
                        {groupDays && groupDays.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Allocated On:</span>
                                {groupDays.map((day) => (
                                    <div
                                        key={day}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                        <span className="text-sm font-bold text-slate-700">{day}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <p className="text-slate-500 font-bold text-sm">Managing records for {filteredPatients.length} patients</p>
                </div>

                <button
                    onClick={handleBroadcast}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all active:scale-95 group"
                >
                    <LucideShare2 size={20} className="group-hover:-translate-y-1 transition-transform" />
                    <span>Broadcast to Group</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
                <div className="relative group max-w-md">
                    <LucideSearch className="absolute left-5 top-4.5 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search student in this group..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Patient Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence>
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient, index) => (
                            <motion.div
                                key={`${patient._id}-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.01)] border border-slate-50 p-6 flex flex-col items-center group relative overflow-hidden transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]"
                            >
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg relative z-10">
                                        <img
                                            src={patient.image || `https://ui-avatars.com/api/?name=${patient.name}&background=eff6ff&color=2563eb&size=200`}
                                            alt={patient.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                        />
                                    </div>
                                </div>

                                <div className="text-center space-y-2 mb-8">
                                    <h3 className="font-black text-slate-800 text-lg leading-tight tracking-tight px-2">{patient.name}</h3>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                            {patient.program || "Student"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full mt-auto">
                                    <button className="flex-1 py-3.5 text-xs font-black text-slate-600 border border-slate-100 rounded-[1.2rem] hover:bg-slate-50 transition-all">
                                        View File
                                    </button>
                                    <button
                                        onClick={() => handlePrivateMessage(patient)}
                                        className="p-3.5 bg-primary-600 text-white rounded-[1.2rem] hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center active:scale-95"
                                        title="Send Private Message/File"
                                    >
                                        <LucideMessageCircle size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <LucideSearch size={40} />
                            </div>
                            <p className="text-slate-400 font-medium">No students found in this group.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
