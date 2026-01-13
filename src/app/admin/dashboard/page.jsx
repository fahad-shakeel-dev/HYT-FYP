"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/admin/Sidebar"
import DashboardOverview from "@/components/admin/DashboardOverview"
import TeacherRequests from "@/components/admin/TeacherRequests"
import AllStudents from "@/components/admin/AllStudents"
import AllTeachers from "@/components/admin/AllTeachers"
import ClassSections from "@/components/admin/ClassSections"
import AssignClasses from "@/components/admin/AssignClasses"
import RejectModal from "@/components/admin/RejectModal"
import BackgroundParticles from "@/components/admin/BackgroundParticles"
import MakeClass from "@/components/admin/MakeClass"
import SessionManagement from "@/components/admin/SessionManagement"
import SessionGuard from "@/components/admin/SessionGuard"
import { useSessionLogger } from "@/hooks/useSessionLogger"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("session-management")
  const [classes, setClasses] = useState([])
  const [teacherRequests, setTeacherRequests] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [allTeachers, setAllTeachers] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [processingRequests, setProcessingRequests] = useState(new Set())
  const [hasActiveSession, setHasActiveSession] = useState(false)

  const { logActivity } = useSessionLogger()

  useEffect(() => {
    checkSessionStatus()
  }, [])

  useEffect(() => {
    if (hasActiveSession) {
      fetchData()
    }
  }, [hasActiveSession])

  const checkSessionStatus = async () => {
    try {
      const response = await fetch("/api/admin/session/status")
      const data = await response.json()
      setHasActiveSession(data.hasActiveSession)
      setLoading(false)
    } catch (error) {
      console.error("Error checking session status:", error)
      setLoading(false)
    }
  }

  const fetchData = async () => {
    if (!hasActiveSession) return

    try {
      console.log("🔄 Fetching dashboard data...")
      const [teachersRes, studentsRes, sectionsRes, allTeachersRes, classesRes] = await Promise.all([
        fetch("/api/admin/teachers/requests"),
        fetch("/api/admin/students"),
        fetch("/api/admin/sections"),
        fetch("/api/admin/teachers"),
        fetch("/api/admin/classes"),
      ])

      const teachersData = await teachersRes.json()
      const studentsData = await studentsRes.json()
      const sectionsData = await sectionsRes.json()
      const allTeachersData = await allTeachersRes.json()
      const classesData = await classesRes.json()

      setTeacherRequests(teachersData.requests || [])
      setAllStudents(studentsData.students || [])
      setSections(sectionsData.sections || [])
      setAllTeachers(allTeachersData.teachers || [])
      setClasses(classesData.classes || [])

      console.log("✅ Dashboard data loaded")
    } catch (error) {
      console.error("❌ Error fetching data:", error)
    }
  }

  const handleApprove = async (request, type) => {
    const requestId = request._id || request.id

    if (!requestId) {
      console.error("❌ No request ID found")
      alert("Error: Request ID not found")
      return
    }

    if (processingRequests.has(requestId)) return

    setProcessingRequests((prev) => new Set(prev).add(requestId))

    try {
      const response = await fetch(`/api/admin/${type}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`${type === "teachers" ? "Teacher" : "Student"} request approved successfully!`)

        // Log activity
        await logActivity("teacher_approved", `Teacher ${request.name} was approved`, {
          teacherId: requestId,
          teacherName: request.name,
          teacherEmail: request.email,
        })

        await fetchData()
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error("❌ Error approving request:", error)
      alert("Error approving request. Please try again.")
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleRejectClick = (request, type) => {
    const requestId = request._id || request.id
    setSelectedRequest({ ...request, type, requestId })
    setShowRejectModal(true)
  }

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    try {
      const response = await fetch(`/api/admin/${selectedRequest.type}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.requestId,
          reason: rejectReason,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Request rejected successfully!")
        setShowRejectModal(false)
        setRejectReason("")
        setSelectedRequest(null)
        await fetchData()
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error("❌ Error rejecting request:", error)
      alert("Error rejecting request. Please try again.")
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`/api/admin/students/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        })

        if (response.ok) {
          alert("Student deleted successfully!")
          await fetchData()
        }
      } catch (error) {
        console.error("❌ Error deleting student:", error)
      }
    }
  }

  const handleDeleteTeacher = async (teacherId) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        const response = await fetch(`/api/admin/teachers/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherId }),
        })

        if (response.ok) {
          alert("Teacher deleted successfully!")
          await fetchData()
        }
      } catch (error) {
        console.error("❌ Error deleting teacher:", error)
      }
    }
  }

  const handleUpdateStudent = async (studentId, updateData) => {
    try {
      const response = await fetch(`/api/admin/students/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, updateData }),
      })

      if (response.ok) {
        alert("Student updated successfully!")
        await fetchData()
      }
    } catch (error) {
      console.error("❌ Error updating student:", error)
    }
  }

  const handleUpdateTeacher = async (teacherId, updateData) => {
    try {
      const response = await fetch(`/api/admin/teachers/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherId, updateData }),
      })

      if (response.ok) {
        alert("Teacher updated successfully!")
        await fetchData()
      }
    } catch (error) {
      console.error("❌ Error updating teacher:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-slate-600 text-xl font-bold">Loading...</div>
      </div>
    )
  }

  const renderActiveComponent = () => {
    // Always allow session management
    if (activeTab === "session-management") {
      return <SessionManagement onSessionChange={setHasActiveSession} />
    }

    // Guard other components
    if (!hasActiveSession) {
      return <SessionGuard hasActiveSession={hasActiveSession} />
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            teacherRequests={teacherRequests}
            allStudents={allStudents}
            allTeachers={allTeachers}
            classes={classes}
            setActiveTab={setActiveTab}
          />
        )
      case "pending-teachers":
        return (
          <TeacherRequests
            teacherRequests={teacherRequests}
            handleApprove={handleApprove}
            handleRejectClick={handleRejectClick}
            processingRequests={processingRequests}
          />
        )
      case "all-students":
        return (
          <AllStudents
            allStudents={allStudents}
            handleDeleteStudent={handleDeleteStudent}
            handleUpdateStudent={handleUpdateStudent}
            sections={sections}
          />
        )
      case "all-teachers":
        return (
          <AllTeachers
            allTeachers={allTeachers}
            handleDeleteTeacher={handleDeleteTeacher}
            handleUpdateTeacher={handleUpdateTeacher}
          />
        )
      case "make-class":
        return <MakeClass fetchData={fetchData} sections={sections} logActivity={logActivity} />
      case "assign-classes":
        return (
          <AssignClasses allTeachers={allTeachers} classes={classes} fetchData={fetchData} logActivity={logActivity} />
        )
      case "class-sections":
        return (
          <ClassSections
            classes={classes}
            allStudents={allStudents}
            handleDeleteStudent={handleDeleteStudent}
            handleUpdateStudent={handleUpdateStudent}
          />
        )
      default:
        return (
          <DashboardOverview
            teacherRequests={teacherRequests}
            allStudents={allStudents}
            allTeachers={allTeachers}
            classes={classes}
            setActiveTab={setActiveTab}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex justify-center font-outfit">
      <BackgroundParticles />
      <div className="flex w-full max-w-[1500px]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          teacherRequests={teacherRequests}
          allStudents={allStudents}
          allTeachers={allTeachers}
          sections={sections}
          hasActiveSession={hasActiveSession}
        />

        <div className="flex-1 p-6 relative z-10 min-w-0">{renderActiveComponent()}</div>
      </div>

      <RejectModal
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        handleRejectSubmit={handleRejectSubmit}
        setSelectedRequest={setSelectedRequest}
      />
    </div>
  )
}
