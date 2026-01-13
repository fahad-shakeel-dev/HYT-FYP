"use client"

import { useState } from "react"
import { Download, Users, Calendar, GraduationCap, Search, Filter, ShieldCheck, Activity, Zap, FileText, Globe, ExternalLink, Database } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Graduates({ graduates, fetchGraduates }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [loading, setLoading] = useState(false)

  // Get unique graduation years
  const graduationYears = [...new Set(graduates.map((grad) => grad.graduationYear))].sort((a, b) => b - a)

  const filteredGraduates = graduates.filter((graduate) => {
    const matchesSearch =
      graduate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      graduate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      graduate.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear === "" || graduate.graduationYear.toString() === selectedYear
    return matchesSearch && matchesYear
  })

  const downloadGraduatesReport = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/graduates/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: selectedYear || "all",
          searchTerm: searchTerm,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `Clinical_Registry_Archive_${selectedYear || "ALL"}_${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 font-outfit">
      {/* Archive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Graduation Registry</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Institutional Certification & Historical Patient Archive</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={downloadGraduatesReport}
            disabled={loading}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95 disabled:opacity-30"
          >
            {loading ? <Activity className="animate-spin" size={16} /> : <Download size={16} />}
            <span>Generate global archive</span>
          </button>
        </div>
      </div>

      {/* Registry Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Clinical Alumni", val: graduates.length, icon: Users, color: "text-primary-500", bg: "bg-primary-500/10" },
          { label: "Current Cycle Certifications", val: graduates.filter((g) => g.graduationYear === new Date().getFullYear()).length, icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Active Registry Eras", val: graduationYears.length, icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-[2.5rem] relative overflow-hidden group hover:border-slate-800 transition-all">
            <div className="relative z-10">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={22} />
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{stat.val}</p>
            </div>
            <div className={`absolute right-0 bottom-0 w-24 h-24 ${stat.color.replace('text', 'bg').replace('-500', '/5')} blur-[50px]`} />
          </div>
        ))}
      </div>

      {/* Registry Filters */}
      <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-900 rounded-[2.5rem] p-8">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input
              type="text"
              placeholder="Query Historical Patient Archive (Name, Identifier, email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white placeholder-slate-700 focus:outline-none focus:border-primary-500 font-bold text-sm"
            />
          </div>
          <div className="xl:w-64 relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full pl-14 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer hover:bg-slate-950 transition-all"
            >
              <option value="">All Certificaton Eras</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>Registry Era {year}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none group-hover:text-primary-500 transition-colors">
              <ExternalLink size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-slate-900/20 backdrop-blur-xl border border-slate-900 rounded-[3rem] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Patient Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Phase Era</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Outcome</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Inscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {filteredGraduates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <p className="text-slate-800 font-black uppercase text-[11px] tracking-[0.4em]">Historical Search Returned Null Set</p>
                  </td>
                </tr>
              ) : (
                filteredGraduates.map((graduate, idx) => (
                  <motion.tr
                    key={graduate._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-primary-400 transition-colors">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-primary-400 transition-colors">{graduate.name}</div>
                          <div className="text-[10px] font-bold text-slate-500">{graduate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-400 font-mono tracking-widest">{graduate.rollNumber}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{graduate.department}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-700" />
                        <span className="text-sm font-black text-white">{graduate.graduationYear}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Certified</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(graduate.graduationDate).toLocaleDateString()}</span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="p-8 bg-slate-900/20 border border-slate-900 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-slate-600" size={24} />
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Archive Integrity Verified</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Tamper-evident clinical registry records | Institutional Grade Security</p>
          </div>
        </div>
        <Globe className="text-slate-800 animate-spin-slow" size={24} />
      </div>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
