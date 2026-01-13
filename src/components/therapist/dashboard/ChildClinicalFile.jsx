"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LucideChevronLeft,
    LucideUpload,
    LucideFileText,
    LucideFileVideo,
    LucideDollarSign,
    LucideCalendar,
    LucideCheckCircle,
    LucideDownload,
    LucideX
} from "lucide-react"

export default function ChildClinicalFile({ patient, onBack }) {
    const [activeTab, setActiveTab] = useState("reports")
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM

    // Mock data for files - in a real app, fetch this based on patient._id and selectedMonth
    const [files, setFiles] = useState({
        reports: [],
        videos: [],
        iep: [],
        invoices: []
    })

    const tabs = [
        { id: "reports", label: "Monthly Reports", icon: LucideFileText, color: "bg-blue-500" },
        { id: "videos", label: "Progress Videos", icon: LucideFileVideo, color: "bg-purple-500" },
        { id: "iep", label: "IEP Plans", icon: LucideCalendar, color: "bg-emerald-500" },
        { id: "invoices", label: "Invoices", icon: LucideDollarSign, color: "bg-amber-500" },
    ]

    const handleFileUpload = (e, type) => {
        const uploadedFiles = Array.from(e.target.files)
        const newFiles = uploadedFiles.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            date: new Date().toLocaleDateString(),
            url: URL.createObjectURL(file) // temporary preview
        }))

        setFiles(prev => ({
            ...prev,
            [type]: [...prev[type], ...newFiles]
        }))
    }

    const handleDeleteFile = (type, index) => {
        setFiles(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden min-h-[80vh]"
        >
            {/* Header */}
            <div className="bg-slate-900 text-white p-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
                >
                    <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
                        <LucideChevronLeft size={20} />
                    </div>
                    <span className="font-bold">Back to Patient Registry</span>
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 p-1">
                            <img
                                src={patient.image || `https://ui-avatars.com/api/?name=${patient.name}&background=random`}
                                alt={patient.name}
                                className="w-full h-full rounded-xl object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">{patient.name}</h1>
                            <div className="flex items-center gap-3 text-slate-400 font-medium mt-1">
                                <span>ID: {patient.registrationNumber || "N/A"}</span>
                                <span>•</span>
                                <span>{patient.program || "General Therapy"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10">
                        <div className="p-3 bg-primary-600 rounded-xl">
                            <LucideCalendar size={24} />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block">Viewing Records For</label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-transparent border-none p-0 text-white font-bold focus:ring-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === tab.id
                                    ? `${tab.color} text-white shadow-lg scale-105`
                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-dashed border-slate-200 hover:border-primary-400 transition-colors text-center group">
                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${tabs.find(t => t.id === activeTab).color}`}>
                                <LucideUpload size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Upload {tabs.find(t => t.id === activeTab).label.slice(0, -1)}</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6">
                                Drag and drop or click to upload new files for <span className="text-slate-800 font-bold">{selectedMonth}</span>
                            </p>

                            <label className="block w-full">
                                <input type="file" className="hidden" multiple onChange={(e) => handleFileUpload(e, activeTab)} />
                                <span className="block w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                                    Select Files
                                </span>
                            </label>
                            <p className="mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                Supported: PDF, DOCX, MP4, JPG
                            </p>
                        </div>
                    </div>

                    {/* Files List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                            Existing Files
                            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{files[activeTab].length}</span>
                        </h3>

                        {files[activeTab].length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] border border-slate-100 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                    <LucideFileText size={32} />
                                </div>
                                <p className="text-slate-400 font-medium">No files uploaded for this month yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {files[activeTab].map((file, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${tabs.find(t => t.id === activeTab).color}`}>
                                            {activeTab === 'videos' ? <LucideFileVideo size={20} /> : <LucideFileText size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 truncate">{file.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-slate-400 font-medium">{file.size}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="text-xs text-slate-400 font-medium">{file.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-primary-600 rounded-lg transition-colors" title="Download">
                                                <LucideDownload size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(activeTab, index)}
                                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <LucideX size={18} />
                                            </button>
                                        </div>

                                        {/* Status Badge - Mocking "Parent Visibility" */}
                                        <div className="ml-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                                            <LucideCheckCircle size={10} />
                                            Visible
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
