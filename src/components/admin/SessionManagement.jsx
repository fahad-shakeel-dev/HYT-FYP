"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Square, Download, Clock, FileText, AlertCircle, CheckCircle, Trash2, ShieldCheck, Activity, Zap, TrendingUp, Filter, Search, Globe, ChevronRight } from "lucide-react";
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
  const [deletingSession, setDeletingSession] = useState(null);
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
    const loadGraduates = async () => {
      setLoading(true);
      try {
        await fetchGraduates();
      } finally {
        setLoading(false);
      }
    };
    if (filters.year || filters.program || filters.search) loadGraduates();
  }, [filters, fetchGraduates]);

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
      {/* Governance Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Phase Governance</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Institutional Clinical Cycle Management</p>
        </div>
        <div className="flex items-center gap-4">
          {sessionStatus?.hasActiveSession ? (
            <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Phase Verified</span>
            </div>
          ) : (
            <div className="px-6 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Propagation Halted</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Phase Controller */}
        <div className="bg-slate-900/30 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-900 overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500">
                  <Clock size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Clinical Propagation</h2>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Control active system cycles</p>
                </div>
              </div>
            </div>

            {sessionStatus?.hasActiveSession ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 bg-slate-950 border border-slate-900 rounded-3xl">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Institutional Phase</span>
                    <Activity size={18} className="text-emerald-500 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Cycle Type</p>
                      <p className="text-lg font-black text-white">{sessionStatus.session?.sessionType}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Audit Year</p>
                      <p className="text-lg font-black text-white">{sessionStatus.session?.year}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Inscribed</p>
                      <p className="text-lg font-black text-white">{sessionStatus.session?.startDate ? new Date(sessionStatus.session.startDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowEndConfirm(true)}
                  disabled={loading}
                  className="w-full py-5 bg-rose-600/10 hover:bg-rose-600 border border-rose-600/20 hover:border-rose-600 text-rose-500 hover:text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-rose-950/10"
                >
                  {loading ? <Activity className="animate-spin" size={20} /> : <Square size={20} className="group-hover/btn:scale-90 transition-transform" />}
                  <span className="text-[10px] uppercase tracking-[0.2em]">Halt Active Phase Propagation</span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Cycle Taxonomy</label>
                    <div className="relative group">
                      <select
                        value={sessionForm.sessionType}
                        onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value })}
                        className="w-full pl-6 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer group-hover:bg-slate-950 transition-all"
                      >
                        <option value="">Select Cycle Type</option>
                        <option value="Spring">Spring Clinical</option>
                        <option value="Fall">Fall Clinical</option>
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Institutional Year</label>
                    <input
                      type="number"
                      value={sessionForm.year}
                      onChange={(e) => setSessionForm({ ...sessionForm, year: parseInt(e.target.value) || "" })}
                      className="w-full px-8 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black text-sm tracking-widest"
                      min="2020" max="2030"
                    />
                  </div>
                </div>

                <button
                  onClick={startSession}
                  disabled={loading || !sessionForm.sessionType}
                  className="w-full py-5 bg-primary-600 hover:bg-emerald-600 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-950/20 active:scale-95 disabled:opacity-30 group/btn"
                >
                  {loading ? <Activity className="animate-spin" size={20} /> : <Play size={20} className="group-hover/btn:translate-x-1 transition-transform" />}
                  <span className="text-[10px] uppercase tracking-[0.2em]">Initiate System Propagation</span>
                </button>
              </div>
            )}
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-primary-600/5 blur-[80px] -z-0" />
        </div>

        {/* Phase Progression Stats */}
        <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 overflow-hidden relative">
          <div className="flex items-center gap-4 mb-8">
            <TrendingUp className="text-teal-500" size={24} />
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Phase Diagnostics</h2>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Progression analytics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Active Nodes", val: "12", color: "primary" },
              { label: "Patient Growth", val: "+14%", color: "teal" },
              { label: "Staff Efficiency", val: "94%", color: "emerald" },
              { label: "Data Latency", val: "22ms", color: "indigo" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl group hover:border-slate-800 transition-all">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-900/40 rounded-3xl border border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="text-slate-500 animate-spin-slow" size={16} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional Oversight Active</span>
            </div>
            <Activity size={12} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Historical Registry & Graduates */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-slate-600" size={20} />
            <h2 className="text-xl font-black text-white tracking-tight leading-none uppercase text-[12px] tracking-widest">Institutional Registry Archive</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={generateGraduatesExcel} disabled={graduates.length === 0} className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 font-black rounded-2xl text-[9px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
              <Download size={14} /> Global Export
            </button>
          </div>
        </div>

        <div className="bg-slate-900/20 backdrop-blur-xl rounded-[2.5rem] border border-slate-900 p-8">
          <div className="flex flex-col xl:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input
                type="text" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Query Historical Patient Registry..."
                className="w-full pl-14 pr-8 py-4 bg-slate-950 border border-slate-900 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-primary-500 font-bold text-sm"
              />
            </div>
            <div className="flex gap-4">
              <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} className="px-6 py-4 bg-slate-950 border border-slate-900 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest focus:outline-none">
                <option value="">Audit Year</option>
                {graduationYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={filters.program} onChange={(e) => setFilters({ ...filters, program: e.target.value })} className="px-6 py-4 bg-slate-950 border border-slate-900 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest focus:outline-none">
                <option value="">Care Division</option>
                {programs.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {graduates.slice(0, 5).map(g => (
              <div key={g._id} className="p-5 bg-slate-950 border border-slate-900/50 rounded-2xl flex justify-between items-center group hover:border-slate-800 transition-all">
                <div className="flex gap-10 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-500">
                      <Activity size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Archived Milestone</p>
                      <p className="text-sm font-black text-white">{g.name}</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Registry ID</p>
                    <p className="text-xs font-bold text-slate-400">{g.registrationNumber}</p>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Phase Outcome</p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">Certified</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-500">{g.graduationYear}</p>
                </div>
              </div>
            ))}
            {graduates.length === 0 && <p className="text-center py-10 text-slate-700 font-black uppercase text-[10px] tracking-widest">Registry Search Latency: Clear</p>}
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6 lg:p-12">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-16 w-full max-w-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-10 animate-pulse">
                  <AlertCircle size={48} />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter mb-6 uppercase">Institutional Risk Warning</h2>
                <p className="text-rose-500/80 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 leading-relaxed max-w-md mx-auto">
                  Halt active phase propagation? This action resets clinical node identifiers and increments patient progression across the repository.
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mb-12 text-left space-y-4">
                  {[
                    "Revocation of clinician node assignments",
                    "Archival of active patient enrollment registry",
                    "Incremental update to global clinical phases",
                    "Generation of institutional governance reports"
                  ].map((point, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={endSession} disabled={loading} className="flex-1 py-6 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-950/40 transition-all active:scale-95">
                    {loading ? "HALTING SYSTEM..." : "CONFIRM PHASE HALT"}
                  </button>
                  <button onClick={() => setShowEndConfirm(false)} className="flex-1 py-6 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95">
                    ABORT ACTION
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
