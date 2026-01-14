"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Link as LinkIcon, FileText, Image as ImageIcon, Video, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ShareResourceModal({ isOpen, onClose, recipient, group, onSend }) {
    const [type, setType] = useState("message");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!title) {
            setError("Please add a title");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Simulate file upload if file is selected
            let finalUrl = url;
            if (file) {
                // In a real app, upload to S3/Cloudinary here
                finalUrl = URL.createObjectURL(file); // Temporary blob URL for demo
            }

            const payload = {
                type,
                title,
                description,
                url: finalUrl,
                recipientId: recipient?.id,
                groupId: group?.id,
                isPrivate: !!recipient
            };

            const res = await fetch("/api/therapist/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSend && onSend();
                    onClose();
                    // Reset form
                    setTitle("");
                    setDescription("");
                    setUrl("");
                    setFile(null);
                    setSuccess(false);
                }, 1000);
            } else {
                setError(data.message || "Failed to send resource");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">
                            {group ? `Broadcast to ${group.name}` : `Send to ${recipient?.name || "Patient"}`}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {group ? "Group Resource Distribution" : "Private Clinical Resource"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Type Selection */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: "message", icon: FileText, label: "Message" },
                            { id: "image", icon: ImageIcon, label: "Image" },
                            { id: "video", icon: Video, label: "Video" },
                            { id: "file", icon: LinkIcon, label: "Link/File" }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setType(t.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${type === t.id
                                        ? "bg-primary-50 border-primary-200 text-primary-600 shadow-inner"
                                        : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                                    }`}
                            >
                                <t.icon size={20} className="mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wide">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Title / Subject</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Weekly Progress Update"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-primary-500 transition-colors placeholder:font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Description / Message</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Add context or instructions..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                            />
                        </div>

                        {type !== 'message' && (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-100/50 transition-colors cursor-pointer group relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                                        <Upload size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-600">{file ? file.name : "Click to upload file"}</p>
                                        <p className="text-xs text-slate-400">or drag and drop here</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === 'file' && !file && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">External Link (Optional)</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 focus:outline-none focus:border-primary-500 transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl text-sm font-bold">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleSend}
                        disabled={loading || success}
                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${success
                                ? "bg-green-500 text-white shadow-green-200"
                                : "bg-primary-600 text-white shadow-primary-200 hover:bg-primary-700"
                            }`}
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : success ? (
                            <>
                                <CheckCircle size={18} /> Sent Successfully
                            </>
                        ) : (
                            <>
                                Send {type === 'message' ? 'Message' : 'Resource'}
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
