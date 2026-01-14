"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/therapist/dashboard/Sidebar"
import Header from "@/components/therapist/dashboard/Header"
import DashboardOverview from "@/components/therapist/dashboard/DashboardOverview"
import PatientManagement from "@/components/therapist/dashboard/PatientManagement"
import GroupPatientManagement from "@/components/therapist/dashboard/GroupPatientManagement"
import SentHistory from "@/components/therapist/dashboard/SentHistory"

export default function TherapistDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("tab") || "dashboard";

  const [activeSection, setActiveSection] = useState(initialSection);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [therapistData, setTherapistData] = useState(null)

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const response = await fetch("/api/therapist/me");
        const data = await response.json();
        if (response.ok) {
          setTherapistData(data.therapist);
        }
      } catch (e) {
        console.error("Dashboard data fetch error", e);
      }
    };
    fetchTherapistData();
  }, []);

  // Sync state with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveSection(tab);
    }
  }, [searchParams]);

  const updateUrl = (section) => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", section);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    updateUrl(section);
  };

  const renderContent = () => {
    if (activeSection.startsWith("group-")) {
      const groupIndex = parseInt(activeSection.split("-")[1]);
      // Use assignedClasses which has nested students
      const group = therapistData?.assignedClasses?.[groupIndex];

      return <GroupPatientManagement
        groupId={group?.classSectionId}
        groupSubject={group?.subject}
        groupName={`${group?.program} - ${group?.section}`} // Construct display name
        preloadedStudents={group?.students || []} // Pass strict student list
      />
    }

    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview setActiveSection={handleSectionChange} />
      case "patients":
        return <PatientManagement />
      case "sent-history":
        return <SentHistory />
      default:
        return <DashboardOverview setActiveSection={handleSectionChange} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        therapistData={therapistData}
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
