"use client"

import { useState } from "react"
import Sidebar from "@/components/therapist/dashboard/Sidebar"
import Header from "@/components/therapist/dashboard/Header"
import DashboardOverview from "@/components/therapist/dashboard/DashboardOverview"
import PatientManagement from "@/components/therapist/dashboard/PatientManagement"
import SessionScheduleManagement from "@/components/therapist/dashboard/SessionScheduleManagement"
import TherapyTaskManagement from "@/components/therapist/dashboard/TherapyTaskManagement"
import ClinicalAssessmentManagement from "@/components/therapist/dashboard/ClinicalAssessmentManagement"
import ClinicalResourceSharing from "@/components/therapist/dashboard/ClinicalResourceSharing"
import ClinicalConsultations from "@/components/therapist/dashboard/ClinicalConsultations"

export default function TherapistDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "patients":
        return <PatientManagement />
      case "sessions":
        return <SessionScheduleManagement />
      case "tasks":
        return <TherapyTaskManagement />
      case "assessments":
        return <ClinicalAssessmentManagement />
      case "resources":
        return <ClinicalResourceSharing />
      case "consultations":
        return <ClinicalConsultations />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "pl-20" : "pl-72"}`}>
        <Header activeSection={activeSection} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="p-8">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
