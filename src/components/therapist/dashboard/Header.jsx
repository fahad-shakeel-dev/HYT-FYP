"use client";

import { motion } from "framer-motion";
import {
  LucideBell,
  LucideMenu,
  LucideSearch,
  LucideLogOut,
  LucideSettings,
  LucideShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Header({ activeSection, toggleSidebar }) {
  const router = useRouter();

  const getSectionTitle = () => {
    const titles = {
      dashboard: "Analytics Overview",
      students: "Patient Portfolios",
      classes: "Session Schedules",
      assignments: "Therapy Tasks",
      quizzes: "Assessments",
      content: "Clinical Resources",
      communications: "Consultations",
    };
    return titles[activeSection] || "Clinical Portal";
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Session End",
      text: "Are you sure you want to log out of the clinical portal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#primary-600",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Logout",
      background: "#ffffff",
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        router.push("/therapist");
      }
    });
  };

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-90"
        >
          <LucideMenu size={22} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
            {getSectionTitle()}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Clinical Node
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 group focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all">
          <LucideSearch size={18} className="text-slate-400 group-focus-within:text-primary-600" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-transparent border-none focus:outline-none ml-3 text-sm font-medium text-slate-700 placeholder-slate-400 w-48 lg:w-64"
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all relative">
            <LucideBell size={22} />
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all">
            <LucideSettings size={22} />
          </button>

          <div className="w-[1px] h-8 bg-slate-100 mx-2"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-black text-sm group"
          >
            <LucideLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
