"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Square, Download, Clock, AlertCircle, TrendingUp, Search, Calendar, CheckCircle2, AlertTriangle, Zap, Activity, Globe, ShieldCheck, Trash2, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SessionManagement({ onSessionChange }) {
  const [sessionStatus, setSessionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    sessionType: "",
    year: new Date().getFullYear(),
  });
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [graduates, setGraduates] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filters, setFilters] = useState({ year: "", program: "", search: "" });

  const checkSessionStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session/status");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSessionStatus(data);
      if (onSessionChange) onSessionChange(data.hasActiveSession);
    } catch (error) {
      console.error("Error checking session status:", error);
    }
  }, [onSessionChange]);

  const fetchSessionHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session/history");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSessionHistory(data.sessions || []);
    } catch (error) {
      console.error("Error fetching session history:", error);
    }
  }, []);

  const fetchGraduates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append("year", filters.year);
      if (filters.program) params.append("program", filters.program);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/admin/graduates?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGraduates(data.graduates || []);
      setGraduationYears(data.graduationYears || []);
      setPrograms(data.programs || []);
    } catch (error) {
      console.error("Error fetching graduates:", error);
    }
  }, [filters]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([checkSessionStatus(), fetchSessionHistory(), fetchGraduates()]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [checkSessionStatus, fetchSessionHistory, fetchGraduates]);

  useEffect(() => {
    // Separate effect for graduates filtering to avoid full reload
    const loadGraduates = async () => {
      setLoading(true);
      try {
        await fetchGraduates();
      } finally {
        setLoading(false);
      }
    };
    if (filters.year || filters.program || filters.search) loadGraduates();
  }, [filters.year, filters.program, filters.search, fetchGraduates]);

  const startSession = async () => {
    if (!sessionForm.sessionType || !sessionForm.year) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionForm),
      });
      if (response.ok) {
        await Promise.all([checkSessionStatus(), fetchSessionHistory()]);
        setSessionForm({ sessionType: "", year: new Date().getFullYear() });
      }
    } catch (error) {
      console.error("Error starting session:", error);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.excelReport) downloadFileFromBase64(data.excelReport, { sessionType: data.sessionData.sessionType, year: data.sessionData.year });
        await Promise.all([checkSessionStatus(), fetchSessionHistory(), fetchGraduates()]);
        setShowEndConfirm(false);
      }
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleExportSession = async (session) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/session/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });

      const data = await response.json();

      if (response.ok && data.excelReport) {
        downloadFileFromBase64(data.excelReport, { sessionType: session.sessionType, year: session.year });
      } else {
        console.error("Failed to generate Excel:", data.message);
      }
    } catch (error) {
      console.error("Error exporting session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/session/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionToDelete._id }),
      });

      if (response.ok) {
        await fetchSessionHistory();
        setShowDeleteConfirm(false);
        setSessionToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFileFromBase64 = (base64Data, { sessionType, year, type = "xlsx" }) => {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const mimeType = type === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf";
      const blob = new Blob([bytes], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Report_${sessionType}_${year}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading file:`, error);
    }
  };

  return (
    <div className="space-y-8 font-outfit">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Session Management</h1>
          <p className="text-slate-500 font-medium">Manage academic cycles and archives</p>
        </div>
        <div className="flex items-center gap-4">
          {sessionStatus?.hasActiveSession ? (
            <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Session Active</span>
            </div>
          ) : (
            <div className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">No Active Session</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Session Controls */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-0 opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Clock size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Session Controls</h2>
                <p className="text-sm font-medium text-slate-500">Start or end academic sessions</p>
              </div>
            </div>

            {sessionStatus?.hasActiveSession ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</span>
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</p>
                      <p className="text-lg font-bold text-slate-800">{sessionStatus.session?.sessionType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Year</p>
                      <p className="text-lg font-bold text-slate-800">{sessionStatus.session?.year}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Started</p>
                      <p className="text-lg font-bold text-slate-800">{sessionStatus.session?.startDate ? new Date(sessionStatus.session.startDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-amber-800 text-sm font-medium">
                  <AlertTriangle className="shrink-0" size={18} />
                  <p>Ending the session will archive all current classes. This info cannot be recovered easily.</p>
                </div>

                <button
                  onClick={() => setShowEndConfirm(true)}
                  disabled={loading}
                  className="w-full py-4 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                >
                  {loading ? <Clock className="animate-spin" size={20} /> : <Square size={20} />}
                  <span>End Session</span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Session Type</label>
                    <div className="relative">
                      <select
                        value={sessionForm.sessionType}
                        onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-sm appearance-none cursor-pointer transition-all hover:bg-slate-100"
                      >
                        <option value="">Select Type...</option>
                        <option value="Spring">Spring</option>
                        <option value="Fall">Fall</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Year</label>
                    <input
                      type="number"
                      value={sessionForm.year}
                      onChange={(e) => setSessionForm({ ...sessionForm, year: parseInt(e.target.value) || "" })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-sm transition-all hover:bg-slate-100"
                      min="2020" max="2030"
                    />
                  </div>
                </div>

                <button
                  onClick={startSession}
                  disabled={loading || !sessionForm.sessionType}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  {loading ? <Clock className="animate-spin" size={20} /> : <Play size={20} />}
                  <span>Start New Session</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shadow-sm border border-teal-100">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">System Overview</h2>
              <p className="text-sm font-medium text-slate-500">Key performance metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Active Sections", val: "12", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
              { label: "Total Students", val: "156", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
              { label: "Staff Active", val: "24", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
              { label: "System Status", val: "100%", color: "text-sky-600", bg: "bg-sky-50 border-sky-100" }
            ].map((stat, i) => (
              <div key={i} className={`p-6 ${stat.bg} border rounded-3xl transition-all hover:shadow-md cursor-default group`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-slate-600 transition-colors">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="text-slate-400" size={18} />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Region: US-East</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3 px-2">
          <Clock className="text-slate-400" size={24} />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Session History</h2>
            <p className="text-sm text-slate-500 font-medium">Archive of past academic cycles</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-8">
          {sessionHistory.length > 0 ? (
            <div className="space-y-4">
              {sessionHistory.map((session) => (
                <div key={session._id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100/50 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">{session.sessionType} {session.year}</h3>
                        <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Archived</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span>Ended {session.endDate ? new Date(session.endDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                        <span>•</span>
                        <span>{session.sessionData?.studentsProcessed || 0} Students</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleExportSession(session)}
                      disabled={loading}
                      className="flex-1 md:flex-none px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 text-xs uppercase tracking-wider"
                    >
                      <FileSpreadsheet size={16} />
                      <span>Report</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(session)}
                      disabled={loading}
                      className="flex-1 md:flex-none px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 text-xs uppercase tracking-wider"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Clock size={32} />
              </div>
              <p className="text-slate-400 font-bold">No past sessions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">End Session?</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm mx-auto">
                  This will archive all active classes and student data. <br /> <span className="text-rose-500 font-bold">This action cannot be undone.</span>
                </p>

                <div className="flex flex-col gap-3">
                  <button onClick={endSession} disabled={loading} className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]">
                    {loading ? "Processing..." : "Yes, End Session"}
                  </button>
                  <button onClick={() => setShowEndConfirm(false)} className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all border border-transparent hover:border-slate-200">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-rose-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm">
                  <Trash2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Session Record?</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm mx-auto">
                  You are about to permanently delete the archive for <strong className="text-slate-800">{sessionToDelete?.sessionType} {sessionToDelete?.year}</strong>.
                  <br /><br />
                  <span className="text-rose-500 font-black">WARNING: This data cannot be recovered.</span>
                </p>

                <div className="flex flex-col gap-3">
                  <button onClick={confirmDeleteSession} disabled={loading} className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]">
                    {loading ? "Deleting..." : "Yes, Delete Permanently"}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all border border-transparent hover:border-slate-200">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
