"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  LucideLayoutDashboard,
  LucideClipboardList,
  LucideActivity,
  LucideCalendar,
  LucideShieldCheck,
  LucideLogOut,
  LucideSettings,
  LucideUser,
  LucideBell,
  LucideMenu,
  LucideX,
  LucideHome,
  LucidePlus,
  LucideStethoscope,
  LucideChevronRight,
  LucideTrendingUp,
  LucideHeart,
  LucideChevronUp,
  LucideArrowLeft,
  LucideChevronDown
} from "lucide-react";

import { useStudent } from "@/app/context/StudentContext";
import SidebarClassDropdown from "@/components/ui/sidebar-class-dropdown";
import OverviewSection from "@/components/parent/dashboard/overview-section";
import ClassDetailView from "@/components/parent/dashboard/class-detail-view";
import EnrollSection from "@/components/parent/dashboard/enroll-section";
import ProfileSection from "@/components/parent/dashboard/profile-section";

const recentTherapyTasks = [
  {
    id: 1,
    title: "Motor Skills Exercise - Level 1",
    focus: "Occupational Therapy",
    dueDate: "2024-05-15",
    status: "pending",
    type: "Practice",
    urgency: "high",
  },
  {
    id: 2,
    title: "Speech Articulation Review",
    focus: "Speech Therapy",
    dueDate: "2024-05-18",
    status: "completed",
    type: "Review",
    urgency: "medium",
  },
  {
    id: 3,
    title: "Cognitive Behavioral Milestone",
    focus: "Clinical Psychology",
    dueDate: "2024-05-20",
    status: "ongoing",
    type: "Assessment",
    urgency: "medium",
  },
];

const clinicalAlerts = [
  {
    id: 1,
    title: "New Therapy Task Assigned",
    message: "Motor Skills exercise has been assigned by Therapist Yusra.",
    time: "2 hours ago",
    type: "task",
    read: false,
  },
  {
    id: 2,
    title: "Assessment Scheduled",
    message: "Monthly progress assessment scheduled for May 22nd.",
    time: "1 day ago",
    type: "assessment",
    read: false,
  },
  {
    id: 3,
    title: "Progress Report Updated",
    message: "Your child's weekly progress report is now available.",
    time: "2 days ago",
    type: "report",
    read: true,
  },
];

export default function ParentDashboard() {
  const router = useRouter();
  const { studentData, loading, setStudentData } = useStudent();
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("tab") || "overview";

  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showClassmates, setShowClassmates] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  // Fetch student data on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Update active section when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveSection(tab);
    }
  }, [searchParams]);

  // Fetch enrolled classes and restore selected class if needed
  useEffect(() => {
    async function fetchEnrolledClasses() {
      try {
        const response = await fetch("/api/parent/enrolled-classes", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setEnrolledClasses(data.enrolledClasses);

          // Restore selected class from URL if applicable
          const classId = searchParams.get("classId");
          if (classId && data.enrolledClasses) {
            const cls = data.enrolledClasses.find(c => (c.id === classId || c._id === classId));
            if (cls) {
              setSelectedClass(cls);
              setActiveSection("node-detail");
            }
          }
        } else {
          toast.error("Failed to fetch enrolled clinical nodes");
        }
      } catch (error) {
        console.error("Error fetching enrolled classes:", error);
      }
    }
    if (studentData) fetchEnrolledClasses();
  }, [studentData, searchParams]); // Added searchParams to dependency to re-check on URL change (careful with loops, but fetch logic is guarded)

  // Avoid re-fetching if data exists, just restore selection
  useEffect(() => {
    if (enrolledClasses.length > 0 && searchParams.get("classId")) {
      const classId = searchParams.get("classId");
      const cls = enrolledClasses.find(c => (c.id === classId || c._id === classId));
      if (cls && (!selectedClass || selectedClass.id !== cls.id)) {
        setSelectedClass(cls);
        if (activeSection !== "node-detail") setActiveSection("node-detail");
      }
    }
  }, [enrolledClasses, searchParams]);

  // Fetch student data
  const fetchStudentData = async () => {
    try {
      const response = await fetch("/api/parent/me", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      } else {
        toast.error("Failed to fetch patient data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  // Update URL helper
  const updateUrl = (tab, classId = null) => {
    const params = new URLSearchParams(window.location.search);
    if (tab) params.set("tab", tab);
    if (classId) {
      params.set("classId", classId);
    } else {
      params.delete("classId");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };



  // Show welcome toast
  useEffect(() => {
    if (studentData && !loading) {
      toast.success(`Welcome to the Care Portal, ${studentData.student.name}!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  }, [studentData, loading]);

  // Handle logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Confirm Portal Exit?",
      text: "You will need to re-authenticate to access clinical records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Secure Logout",
      cancelButtonText: "Stay Logged In",
      background: "#ffffff",
      customClass: {
        title: "font-black text-slate-800",
        confirmButton: "rounded-xl font-bold px-8 py-3",
        cancelButton: "rounded-xl font-bold px-8 py-3"
      }
    });

    if (result.isConfirmed) {
      try {
        await fetch("/api/parent/logout", {
          method: "POST",
          credentials: "include",
        });
        router.push("/parent");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Error during secure logout");
      }
    }
  };

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setActiveSection("node-detail");
    updateUrl("node-detail", classData.id || classData._id);
    setIsSidebarOpen(false);
  };

  const handleBackToOverview = () => {
    setSelectedClass(null);
    setActiveSection("overview");
    updateUrl("overview");
  };

  const navigationItems = [
    { id: "overview", label: "Care Summary", icon: LucideHome },
    { id: "enroll", label: "Join Therapy Node", icon: LucidePlus },
    { id: "tasks", label: "Therapy Tasks", icon: LucideClipboardList },
    { id: "calendar", label: "Clinical Calendar", icon: LucideCalendar },
    { id: "progress", label: "Growth Metrics", icon: LucideTrendingUp },
    { id: "profile", label: "Profile", icon: LucideUser },
  ];

  const unreadCount = clinicalAlerts.filter((n) => !n.read).length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <LucideActivity className="animate-spin text-primary-600" size={48} />
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Secure Care Portal...</p>
        </div>
      )
    }
    if (!studentData) return <div className="text-slate-400 text-center font-bold">Session expired. Please log in again.</div>;

    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection
            studentData={studentData.student}
            enrolledClasses={enrolledClasses}
            notifications={clinicalAlerts}
            recentAssignments={recentTherapyTasks}
          />
        );
      case "enroll":
        return <EnrollSection fetchStudentData={fetchStudentData} />;
      case "node-detail":
        return (
          <ClassDetailView
            selectedClass={selectedClass}
            recentAssignments={recentTherapyTasks}
            onBack={handleBackToOverview}
          />
        );
      case "tasks":
        return (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Active Therapy Tasks</h2>
              <div className="grid gap-6">
                {recentTherapyTasks.map((task) => (
                  <div key={task.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 group hover:border-primary-100 transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-50">
                          <LucideClipboardList size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">{task.title}</h3>
                          <p className="text-primary-600 font-bold text-sm">{task.focus}</p>
                          <div className="flex items-center gap-2 mt-1 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <LucideCalendar size={14} />
                            Target: {task.dueDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${task.urgency === "high" ? "bg-rose-50 text-rose-600" : "bg-slate-200 text-slate-600"
                          }`}>
                          {task.urgency} Urgency
                        </span>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${task.status === "completed" ? "bg-green-50 text-green-600" : "bg-primary-50 text-primary-600"
                          }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case "calendar":
        return (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Clinical Rotation Calendar</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-primary-50/50 rounded-[2rem] p-8 border border-primary-100">
                  <h3 className="text-lg font-black text-primary-600 mb-6 uppercase tracking-widest">Upcoming Sessions</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-black text-slate-800">Mid-Phase Evaluations</p>
                        <p className="text-sm font-bold text-slate-500">Scheduled: May 25 - June 05</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-black text-slate-800">Therapy Milestone Review</p>
                        <p className="text-sm font-bold text-slate-500">Scheduled: June 10 - June 15</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50/50 rounded-[2rem] p-8 border border-amber-100">
                  <h3 className="text-lg font-black text-amber-600 mb-6 uppercase tracking-widest">Clinical Notices</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-black text-slate-800">New Phase Registration</p>
                        <p className="text-sm font-bold text-slate-500">Deadline: June 30</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-black text-slate-800">Facility Maintenance Break</p>
                        <p className="text-sm font-bold text-slate-500">July 01 - July 07</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case "progress":
        return (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Growth & Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Stability Score</div>
                  <div className="text-4xl font-black text-primary-600">3.8</div>
                  <div className="text-xs font-bold text-slate-500 mt-2 italic">Calculated clinical average</div>
                </div>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Task Completion</div>
                  <div className="text-4xl font-black text-teal-600">85%</div>
                  <div className="text-xs font-bold text-slate-500 mt-2 italic">Therapeutic compliance</div>
                </div>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Session Nodes</div>
                  <div className="text-4xl font-black text-indigo-600">{studentData.student.enrollmentCount}</div>
                  <div className="text-xs font-bold text-slate-500 mt-2 italic">Active therapy groups</div>
                </div>
              </div>
              <div className="space-y-6">
                {enrolledClasses.map((cls) => (
                  <div key={cls.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                          <LucideActivity size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">{`${cls.program} - ${cls.subject}`}</h3>
                          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-none mt-1">Node {cls.section} • Lead: {cls.teacher?.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-center">
                          <div className="text-xl font-black text-primary-600">A-</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase Grade</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-black text-teal-600">88%</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case "profile":
        return (
          <ProfileSection
            studentData={studentData}
            onProfileUpdate={fetchStudentData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-outfit">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:static md:inset-0`}
        >
          <div className="flex flex-col h-full">
            <div className="h-24 flex items-center gap-4 px-8 border-b border-slate-50">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-100">
                <LucideHeart size={22} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Care Portal</span>
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-none">Parent Dashboard</span>
              </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    updateUrl(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all group ${activeSection === item.id
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-100"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    }`}
                >
                  <item.icon className={`h-5 w-5 ${activeSection === item.id ? "text-white" : "group-hover:text-primary-600 transition-colors"}`} />
                  <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                  {activeSection === item.id && <LucideChevronRight className="ml-auto opacity-50" size={14} />}
                </button>
              ))}

              <div className="pt-8 px-4">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">My Therapy Groups</div>
                <div className="space-y-2">
                  {enrolledClasses && enrolledClasses.length > 0 ? (
                    enrolledClasses.map((cls) => (
                      <button
                        key={cls.id || cls._id}
                        onClick={() => handleClassSelect(cls)}
                        className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all group text-left ${selectedClass?.id === cls.id
                          ? "bg-primary-600 text-white shadow-xl shadow-primary-100"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-primary-600 border border-slate-100"
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${selectedClass?.id === cls.id ? "bg-white/20 text-white" : "bg-white text-primary-600 shadow-sm"
                          }`}>
                          <LucideStethoscope size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-xs uppercase tracking-widest truncate">{cls.subject}</div>
                          <div className={`text-[10px] font-bold truncate ${selectedClass?.id === cls.id ? "text-white/70" : "text-slate-400"}`}>
                            {cls.teacher?.name || "No Instructor"}
                          </div>
                        </div>
                        {selectedClass?.id === cls.id && <LucideChevronRight className="ml-auto opacity-50" size={14} />}
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">No Groups Yet</p>
                      <button
                        onClick={() => setActiveSection('enroll')}
                        className="text-primary-600 text-xs font-black hover:underline"
                      >
                        Join a Group
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            <div className="p-6 border-t border-slate-50">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-4 w-full p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-all text-left relative"
              >
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary-600 text-sm font-black shadow-sm border border-slate-100 uppercase">
                  {studentData?.student.name ? studentData.student.name.split(" ").map((n) => n[0]).join("") : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate">{studentData?.student.name || "Caregiver"}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{studentData?.student.program || "Patient File"}</p>
                </div>
                <LucideChevronUp className={`h-4 w-4 text-slate-300 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setActiveSection("profile");
                          updateUrl("profile");
                        }}
                        className="flex items-center gap-3 w-full px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all border-b border-slate-50"
                      >
                        <LucideUser className="h-4 w-4 text-primary-600" />
                        Care Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-6 py-4 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LucideLogOut className="h-4 w-4" />
                        Secure Exit
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
              >
                {isSidebarOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
              </button>

              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight capitalize leading-none mb-1">
                  {activeSection === "node-detail" && selectedClass
                    ? `${selectedClass.program} - ${selectedClass.subject}`
                    : activeSection.replace("-", " ")}
                </h1>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
                  Live Clinical Node: Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all group">
                <LucideBell className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-black rounded-lg h-5 w-5 flex items-center justify-center border-4 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-3 px-5 py-3 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-100">
                <LucideShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Access</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 sm:p-12 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection + (selectedClass?.id || "")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <ToastContainer
        toastClassName={() => "relative flex p-4 min-h-10 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white border border-slate-100 shadow-2xl"}
        bodyClassName={() => "text-sm font-bold text-slate-800 flex p-3"}
      />
    </div>
  );
}
