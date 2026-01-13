"use client";

import { useState, useEffect, useRef } from "react";
import {
  LucideLayoutDashboard,
  LucideUsers,
  LucideCalendar,
  LucideStethoscope,
  LucideChevronLeft,
} from "lucide-react";

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed }) {
  const [therapist, setTherapist] = useState({ name: "Loading...", specialization: "Therapist" });
  const sidebarRef = useRef(null);

  // Fetch therapist data
  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const response = await fetch("/api/therapist/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setTherapist({
            name: data.teacher.name || "Unknown Therapist",
            specialization: data.teacher.department || "Therapist",
            image: data.teacher.image,
          });
        }
      } catch (error) {
        console.error("Sidebar: Error fetching therapist data:", error.message);
        setTherapist({ name: "Error", specialization: "Therapist" });
      }
    };

    fetchTherapistData();
  }, []);

  // Responsive: Close sidebar on outside click if mobile-ish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setCollapsed]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LucideLayoutDashboard },
    { id: "patients", label: "My Patients", icon: LucideUsers }, // This matches the "Therapist selects a child" flow
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 ${collapsed ? "w-[88px]" : "w-80"
        } shadow-[10px_0_30px_rgba(0,0,0,0.02)]`}
    >
      {/* Sidebar Header */}
      <div className="p-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 py-2">
          <div className="min-w-[48px] h-[48px] bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 rotate-3 transition-transform hover:rotate-0">
            <LucideStethoscope size={24} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">
                Therapist
              </span>
              <span className="text-[10px] uppercase font-bold text-primary-600 tracking-widest leading-none">
                Clinical Portal
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all active:scale-90"
          >
            <LucideChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar h-[calc(100vh-200px)]">
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
              className={`flex items-center gap-4 w-full h-14 px-4 rounded-2xl transition-all duration-300 group ${isActive
                ? "bg-primary-600 text-white shadow-xl shadow-primary-100"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary-600"
                }`}
              title={collapsed ? item.label : ""}
            >
              <div className={`min-w-[24px] transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {!collapsed && (
                <span className={`text-sm font-bold tracking-tight whitespace-nowrap transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-80"}`}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer / Profile */}
      <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className={`flex items-center gap-4 p-2 rounded-2xl transition-all ${collapsed ? "justify-center" : "hover:bg-slate-50"}`}>
          <div className="min-w-[48px] h-[48px] rounded-2xl bg-secondary-100 flex items-center justify-center text-secondary-600 font-bold border-2 border-white shadow-sm overflow-hidden">
            {therapist.image ? (
              <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
            ) : (
              therapist.name.charAt(0)
            )}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-sm font-black text-slate-800 truncate">
                {therapist.name}
              </span>
              <span className="text-xs font-bold text-slate-400 truncate uppercase">
                {therapist.specialization}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
