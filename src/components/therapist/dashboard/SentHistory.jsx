"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LucideHistory,
    LucideFileText,
    LucideImage,
    LucideVideo,
    LucideLink,
    LucideSearch,
    LucideCalendar,
    LucideUsers,
    LucideUser,
    LucideActivity,
    LucideExternalLink
} from "lucide-react";

export default function SentHistory() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/therapist/resources");
                const data = await res.json();
                if (data.success) {
                    setResources(data.data);
                }
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredResources = resources.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.recipientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type) => {
        switch (type) {
            case "image": return <LucideImage size={20} />;
            case "video": return <LucideVideo size={20} />;
            case "file": return <LucideLink size={20} />;
            default: return <LucideFileText size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <LucideActivity className="animate-spin text-primary-600" size={48} />
                <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Transmission History...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <LucideHistory size={32} className="text-primary-600" />
                        Sent Resources
                    </h2>
                    <p className="text-slate-400 font-bold text-sm ml-11">Tracking all digital clinical distributions</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative group max-w-md">
                <LucideSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600" size={18} />
                <input
                    type="text"
                    placeholder="Search by title or patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all shadow-sm"
                />
            </div>

            {/* History List */}
            <div className="grid gap-4">
                <AnimatePresence>
                    {filteredResources.length > 0 ? (
                        filteredResources.map((res, idx) => (
                            <motion.div
                                key={res._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col lg:flex-row items-start lg:items-center gap-6 group hover:shadow-xl hover:border-primary-100 transition-all"
                            >
                                {/* Type Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform border border-slate-100 shadow-inner">
                                    {getIcon(res.type)}
                                </div>

                                {/* Metadata */}
                                <div className="flex-1 space-y-1 min-w-0">
                                    <h4 className="font-black text-slate-800 truncate">{res.title}</h4>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <LucideCalendar size={14} />
                                            {new Date(res.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            {res.isPrivate ? <LucideUser size={14} /> : <LucideUsers size={14} />}
                                            {res.isPrivate ? (res.recipientId?.name || "Patient") : "Group Broadcast"}
                                        </span>
                                    </div>
                                </div>

                                {/* Description Snippet */}
                                <div className="hidden xl:block flex-1 border-l border-slate-100 pl-6">
                                    <p className="text-xs font-medium text-slate-500 line-clamp-2 italic">"{res.description || 'No description provided'}"</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    {res.url && (
                                        <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all active:scale-90"
                                        >
                                            <LucideExternalLink size={18} />
                                        </a>
                                    )}
                                    <button className="flex-1 lg:flex-none px-6 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-colors">
                                        Retract
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <LucideHistory size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Sent Resources Found</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
