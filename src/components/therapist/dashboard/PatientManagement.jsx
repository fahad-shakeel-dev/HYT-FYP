"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ChildClinicalFile from "./ChildClinicalFile"
import ShareResourceModal from "./ShareResourceModal"
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareRecipient, setShareRecipient] = useState(null);

  const handlePrivateMessage = (patient) => {
    setShareRecipient({ id: patient._id, name: patient.name });
    setIsModalOpen(true);
  };

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

  if (selectedPatient) {
    return <ChildClinicalFile patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
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
                  <button
                    onClick={() => handlePrivateMessage(patient)}
                    className="p-3.5 bg-primary-600 text-white rounded-[1.2rem] hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center active:scale-95"
                    title="Send Private Message/Resource"
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
              <div>
                <h4 className="text-xl font-bold text-slate-800">No matching records</h4>
                <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Patient Detail Modal */}
      <ShareResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipient={shareRecipient}
        onSend={() => console.log("Sent!")}
      />
    </div>
  )
}
