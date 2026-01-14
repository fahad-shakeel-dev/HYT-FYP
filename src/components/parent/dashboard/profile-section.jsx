"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LucideUser,
    LucideMail,
    LucidePhone,
    LucideShieldCheck,
    LucideActivity,
    LucideStethoscope,
    LucideSave,
    LucideEdit,
    LucideX,
    LucideLoader2
} from "lucide-react";
import Swal from "sweetalert2";

export default function ProfileSection({ studentData, onProfileUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: studentData?.student?.name || "",
        email: studentData?.student?.email || "",
        phone: studentData?.student?.phone || "",
        registrationNumber: studentData?.student?.registrationNumber || "",
        program: studentData?.student?.program || "",
        semester: studentData?.student?.semester || "",
        section: studentData?.student?.section || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch("/api/parent/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Profile Updated",
                    text: "Your clinical profile has been successfully updated.",
                    icon: "success",
                    confirmButtonColor: "#2563eb",
                });
                setIsEditing(false);
                if (onProfileUpdate) onProfileUpdate(); // Refresh parent data
            } else {
                Swal.fire({
                    title: "Update Failed",
                    text: data.message || "Could not update profile.",
                    icon: "error",
                    confirmButtonColor: "#ef4444",
                });
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                title: "System Error",
                text: "Communication with the server failed.",
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Patient Record</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600 hover:bg-primary-50 hover:text-primary-600'}`}
                        >
                            {isEditing ? <LucideX size={20} /> : <LucideEdit size={20} />}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                            <div className="w-24 h-24 bg-primary-100 rounded-[2.5rem] flex items-center justify-center text-primary-600 text-3xl font-black shadow-lg shadow-primary-50 shrink-0">
                                {formData.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                            </div>
                            <div className="w-full">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Contact</label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary-600"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{studentData.student.name}</h3>
                                        <p className="text-primary-600 font-bold text-sm">{studentData.student.email}</p>
                                        <div className="mt-2 text-[10px] font-black bg-green-50 text-green-600 px-3 py-1 rounded-full uppercase tracking-widest w-fit">Authorized Profile</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center group min-h-[40px]">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <LucideShieldCheck size={14} /> Registry ID
                                </span>
                                {isEditing ? (
                                    <input
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        className="text-right w-40 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                ) : (
                                    <span className="text-sm font-black text-slate-700 tracking-wider font-mono">{studentData.student.registrationNumber}</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center group min-h-[40px]">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <LucideStethoscope size={14} /> Therapy Type
                                </span>
                                {isEditing ? (
                                    <input
                                        name="program"
                                        value={formData.program}
                                        onChange={handleInputChange}
                                        className="text-right w-40 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                ) : (
                                    <span className="text-sm font-black text-slate-700">{studentData.student.program || "General Care"}</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center group min-h-[40px]">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <LucideActivity size={14} /> Clinical Phase
                                </span>
                                {isEditing ? (
                                    <input
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="text-right w-20 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                ) : (
                                    <span className="text-sm font-black text-slate-700">Phase {studentData.student.semester}</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center group min-h-[40px]">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <LucideActivity size={14} /> Clinical Node
                                </span>
                                {isEditing ? (
                                    <input
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="text-right w-20 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-700 uppercase focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    />
                                ) : (
                                    <span className="text-sm font-black text-slate-700">Node {studentData.student.section}</span>
                                )}
                            </div>
                        </div>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-8 pt-8 border-t border-slate-100"
                                >
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {isSaving ? (
                                            <>
                                                <LucideLoader2 className="animate-spin" size={18} />
                                                Saving Record
                                            </>
                                        ) : (
                                            <>
                                                <LucideSave size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
                    <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Clinical Assignment</h2>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Room</span>
                            <span className="text-lg font-black text-slate-800 block">{studentData.classInfo?.room || "N/A"}</span>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peer Group</span>
                            <span className="text-lg font-black text-slate-800 block">{studentData.classInfo?.totalStudents || "0"} Patients</span>
                        </div>
                    </div>

                    <div className="mb-10 p-8 bg-primary-600 rounded-[2.5rem] shadow-xl shadow-primary-100 relative overflow-hidden">
                        <LucideStethoscope className="absolute right-[-20px] bottom-[-20px] text-white/10 w-40 h-40" />
                        <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">Lead Therapist</h3>
                        <div className="relative z-10">
                            <p className="text-2xl font-black text-white tracking-tight">{studentData.teacher?.name || "Unassigned"}</p>
                            <p className="text-white/80 font-bold text-sm">{studentData.teacher?.email || "No contact info"}</p>
                            <p className="text-white/60 font-black text-[10px] uppercase tracking-widest mt-4">{studentData.teacher?.subject || "Specialization N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
