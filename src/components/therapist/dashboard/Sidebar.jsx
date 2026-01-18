"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LucideLayoutDashboard,
  LucideUsers,
  LucideCalendar,
  LucideStethoscope,
  LucideChevronLeft,
  LucideLogOut // Added LogOut icon
} from "lucide-react";

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed, therapistData }) {
  const router = useRouter();
  const [therapist, setTherapist] = useState({ name: "Loading...", specialization: "Therapist" });
  const [assignedGroups, setAssignedGroups] = useState([]);
  const sidebarRef = useRef(null);

  // Sync with prop data
  useEffect(() => {
    if (therapistData) {
      setTherapist({
        name: therapistData.name || "Unknown Therapist",
        specialization: therapistData.department || "Therapist",
        image: therapistData.image,
      });
      setAssignedGroups(therapistData.assignedClasses || []);
    }
  }, [therapistData]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/therapist/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/parent"); // Redirect to login/portal entry
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ... (rest of sidebar code) ...

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LucideLayoutDashboard },
    { id: "patients", label: "My Patients", icon: LucideUsers },
    { id: "sent-history", label: "Sent History", icon: LucideCalendar },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 ${collapsed ? "w-[88px]" : "w-80"
        } shadow-[10px_0_30px_rgba(0,0,0,0.02)]`}
    >
      {/* Sidebar Header */}
      <div className="h-24 flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-[44px] w-11 h-11 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 flex-shrink-0 transition-transform hover:rotate-0 hover:scale-105">
            <LucideStethoscope size={22} />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-black text-slate-800 tracking-tight leading-none truncate">
                Therapist
              </span>
              <span className="text-[9px] uppercase font-bold text-primary-600 tracking-widest leading-none">
                Clinical Portal
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all active:scale-90"
            title="Collapse sidebar"
          >
            <LucideChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto no-scrollbar h-[calc(100vh-240px)] flex flex-col gap-6">
        {/* Main Menu */}
        <div className="space-y-2">
          {!collapsed && (
            <p className="px-3 text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-3">
              Main Menu
            </p>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                }`}
                title={collapsed ? item.label : ""}
              >
                <div className={`min-w-[22px] transition-transform duration-300 flex-shrink-0 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {!collapsed && (
                  <span className={`text-xs font-bold tracking-tight whitespace-nowrap transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-85"
                  }`}>
                    {item.label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Assigned Groups Section */}
        {assignedGroups.length > 0 && (
          <div className="space-y-3">
            {!collapsed && (
              <p className="px-4 text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-3">
                Allocated Groups ({assignedGroups.length})
              </p>
            )}
            {assignedGroups.map((group, idx) => {
              const groupId = `group-${idx}`;
              const isActive = activeSection === groupId;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSection(groupId);
                    if (window.innerWidth < 1024) setCollapsed(true);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer text-left ${
                    isActive
                      ? "bg-teal-50 text-teal-700 shadow-md border border-teal-200"
                      : "text-slate-600 hover:bg-slate-50 hover:border border-slate-100"
                  }`}
                  title={collapsed ? `${group.displayName || group.subject} - ${group.totalStudents} students` : ""}
                >
                  <div className="min-w-[20px] h-5 flex items-center justify-center flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isActive 
                          ? 'bg-teal-600 ring-3 ring-teal-200 scale-100' 
                          : 'bg-slate-300 group-hover:bg-teal-400 scale-90'
                      }`}
                    />
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col items-start overflow-hidden min-w-0 flex-1">
                      <span
                        className={`text-sm font-bold truncate w-full leading-tight ${
                          isActive ? "text-slate-800" : "text-slate-700"
                        }`}
                      >
                        {group.subject || group.displayName?.split('(')[0].trim()}
                      </span>
                      {/* Days - Professional Display */}
                      {group.days && group.days.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 mb-1">
                          {group.days.slice(0, 3).map((day) => (
                            <span
                              key={day}
                              className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md transition-colors ${
                                isActive
                                  ? "bg-teal-600/20 text-teal-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {day.substring(0, 3)}
                            </span>
                          ))}
                          {group.days.length > 3 && (
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md ${
                              isActive ? "bg-teal-600/20 text-teal-700" : "bg-slate-100 text-slate-600"
                            }`}>
                              +{group.days.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1 w-full">
                        <span className="text-[9px] font-medium text-slate-500 truncate">
                          {group.program}
                        </span>
                        {group.section && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="text-[9px] font-medium text-slate-500 truncate">
                              {group.section}
                            </span>
                          </>
                        )}
                      </div>
                      {group.totalStudents > 0 && (
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {group.totalStudents} Student{group.totalStudents !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Sidebar Footer / Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-gradient-to-t from-white to-white/95">
        <div
          className={`relative flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group/profile ${
            collapsed
              ? "justify-center hover:bg-slate-50"
              : "hover:bg-slate-50"
          }`}
        >
          {/* Profile Avatar */}
          <div className="min-w-[44px] w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-md overflow-hidden flex-shrink-0 flex-col items-center justify-center text-sm">
            {therapist.image ? (
              <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-base">
                {therapist.name?.charAt(0)?.toUpperCase() || "T"}
              </span>
            )}
          </div>

          {/* Profile Info */}
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                {therapist.name || "Therapist"}
              </span>
              <span className="text-[8px] font-bold text-slate-500 truncate uppercase tracking-widest">
                {therapist.specialization || "Clinical Staff"}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex-shrink-0 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover/profile:opacity-100 ${
              collapsed ? "absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl" : ""
            }`}
            title="Logout"
          >
            <LucideLogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
