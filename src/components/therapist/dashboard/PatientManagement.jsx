"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LucideUsers,
  LucideSearch,
  LucideFileDown,
  LucideFilter,
  LucideStethoscope,
  LucideMessageCircle,
  LucideMoreVertical,
  LucideChevronRight,
  LucideCalendar,
  LucideActivity,
  LucideMail,
  LucidePhone,
  LucideMapPin,
  LucideClipboard
} from "lucide-react"

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("")
  const [filterPhase, setFilterPhase] = useState("")
  const [filterNode, setFilterNode] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Reusing the existing endpoint but mentally mapping student -> patient
        const res = await fetch("/api/therapist/dashboard/students")
        const data = await res.json()
        if (data.success) {
          setPatients(data.data)
        }
      } catch (err) {
        console.error("Error fetching clinical data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const handleViewDetails = async (patientId) => {
    try {
      const res = await fetch(`/api/therapist/dashboard/students/${patientId}`)
      const data = await res.json()
      if (data.success) {
        setSelectedPatient(data.data)
      }
    } catch (err) {
      console.error("Error fetching patient file:", err)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    return (
      (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterSpecialty === "" || patient.program === filterSpecialty) &&
      (filterPhase === "" || patient.semester.toString() === filterPhase) &&
      (filterNode === "" || patient.section === filterNode)
    )
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LucideActivity className="animate-spin text-primary-600" size={48} />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Secure Records...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
              <LucideUsers size={28} />
            </div>
            Patient Registry
          </h2>
          <p className="text-slate-400 font-bold text-sm ml-12">Authorized clinical database for rehabilitation tracking</p>
        </div>

        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 group">
          <LucideFileDown size={20} className="group-hover:translate-y-1 transition-transform" />
          <span>Export Medical Records</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <LucideSearch className="absolute left-5 top-4.5 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or Case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>

          <div className="relative">
            <LucideStethoscope className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            >
              <option value="">All Specialties</option>
              <option value="Speech Therapy">Speech Therapy</option>
              <option value="Occupational Therapy">Occupational Therapy</option>
              <option value="Clinical Psychology">Clinical Psychology</option>
            </select>
          </div>

          <div className="relative">
            <LucideActivity className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            >
              <option value="">All Phases</option>
              <option value="1">Intake/Assessment</option>
              <option value="2">Early Intervention</option>
              <option value="3">Intensive Therapy</option>
              <option value="4">Maintenance</option>
            </select>
          </div>

          <div className="relative">
            <LucideCalendar className="absolute left-5 top-4.5 text-slate-400 pointer-events-none" size={20} />
            <select
              value={filterNode}
              onChange={(e) => setFilterNode(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            >
              <option value="">Global Schedule</option>
              <option value="A">Morning Node (A)</option>
              <option value="B">Afternoon Node (B)</option>
              <option value="C">Weekend Node (C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <motion.div
                key={patient._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.01)] border border-slate-50 p-6 flex flex-col items-center group relative overflow-hidden transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                    <LucideMoreVertical size={20} />
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg relative z-10">
                    <img
                      src={patient.image || `https://ui-avatars.com/api/?name=${patient.name}&background=eff6ff&color=2563eb&size=200`}
                      alt={patient.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full z-20"></div>
                </div>

                <div className="text-center space-y-2 mb-8">
                  <h3 className="font-black text-slate-800 text-lg leading-tight tracking-tight px-2">{patient.name}</h3>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">
                      {patient.program || "General Care"}
                    </span>
                    <span className="text-xs font-bold text-slate-400 capitalize">
                      {patient.section === "A" ? "Morning" : patient.section === "B" ? "Afternoon" : "Weekend"} Session • Phase {patient.semester}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Clinic ID #</span>
                  <span className="text-sm font-black text-slate-600 tracking-wider font-mono">{patient.registrationNumber || "REC-2025-000"}</span>
                </div>

                <div className="flex gap-3 w-full mt-auto">
                  <button
                    className="flex-1 py-3.5 text-xs font-black text-slate-600 border border-slate-100 rounded-[1.2rem] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    onClick={() => handleViewDetails(patient._id)}
                  >
                    View File
                  </button>
                  <button className="p-3.5 bg-primary-600 text-white rounded-[1.2rem] hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center active:scale-95">
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
              <div>
                <h4 className="text-xl font-bold text-slate-800">No matching records</h4>
                <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-teal-500"></div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <LucideActivity className="rotate-45" size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-1/3 flex flex-col items-center space-y-6">
                  <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-inner">
                    <img
                      src={selectedPatient.image || `https://ui-avatars.com/api/?name=${selectedPatient.name}&background=eff6ff&color=2563eb&size=400`}
                      alt={selectedPatient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Stable Profile
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div>
                    <h4 className="text-3xl font-black text-slate-800 mb-1 leading-tight">{selectedPatient.name}</h4>
                    <p className="text-primary-600 font-black text-sm uppercase tracking-widest">Patient Record Profile</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <LucideMail size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Primary Email</span>
                          <span className="text-sm font-bold text-slate-700 truncate">{selectedPatient.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <LucidePhone size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Contact</span>
                          <span className="text-sm font-bold text-slate-700">{selectedPatient.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <LucideClipboard size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Specialty</span>
                          <span className="text-sm font-bold text-slate-700">{selectedPatient.program}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <LucideActivity size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Treatment Phase</span>
                          <span className="text-sm font-bold text-slate-700">Phase {selectedPatient.semester}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <LucideCalendar size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Clinical Node</span>
                          <span className="text-sm font-bold text-slate-700">Node {selectedPatient.section}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <LucideMapPin size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">Location</span>
                          <span className="text-sm font-bold text-slate-700">{selectedPatient.room || "Room 000"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                      Download Clinical File
                    </button>
                    <button className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">
                      Edit Records
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
