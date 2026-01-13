"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, Send, Key, User, CheckCircle, AlertCircle, RefreshCw, Trash2, ShieldCheck, Activity, Zap, ClipboardList, Database, Lock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

export default function AssignClasses({ allTeachers, classes, fetchData }) {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [activity, setActivity] = useState(""); // Replaces subject
  const [selectedSchedules, setSelectedSchedules] = useState([]); // Replaces selectedSections
  const [availableActivities, setAvailableActivities] = useState([]); // Replaces availableSubjects
  const [classCredentials, setClassCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignedClasses = async () => {
    setLoadingAssigned(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/assigned-classes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setAssignedClasses(data.assignedClasses || []);
      } else {
        setError(data.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoadingAssigned(false);
    }
  };

  useEffect(() => {
    fetchAssignedClasses();
  }, []);

  // Update available activities based on selected class and schedules
  // In the new model, activities are defined per group, but we might want to check overlap/availability?
  // For now, simpler: getting activities from the selected class is enough.
  // The API call 'available-subjects' might fail if backend isn't updated, 
  // so let's rely on class data directly if possible or update the flow.
  // Assuming for now verification of availability happens on assignment or we just show all class activities.
  useEffect(() => {
    if (!selectedClass) {
      setAvailableActivities([]);
      setActivity("");
      return;
    }
    const cls = classes.find(c => c._id === selectedClass);
    if (cls) {
      setAvailableActivities(cls.activities || []);
    }
  }, [selectedClass]);


  const availableTeachers = allTeachers?.filter((teacher) => teacher.isApproved) || [];
  // Filter classes that have schedules (meaning they are valid Therapy Groups)
  const availableClasses = classes?.filter((cls) => cls.schedules && cls.schedules.length > 0) || [];
  const selectedClassData = classes?.find((c) => c._id === selectedClass);

  const scheduleOptions = selectedClassData?.schedules.map((schedule) => ({
    value: schedule,
    label: schedule,
  })) || [];

  const generateCredentials = () => {
    if (selectedClassData && activity && selectedSchedules.length > 0) {
      const schedulePart = selectedSchedules.length === selectedClassData.schedules.length
        ? "all"
        : "multi"; // Simplified for brevity

      // Sanitized username generation
      const safeGroup = selectedClassData.className.replace(/\s+/g, '_').toLowerCase().slice(0, 10);
      const safeActivity = activity.replace(/\s+/g, '_').toLowerCase().slice(0, 10);

      const username = `u_${safeGroup}_${safeActivity}_${Math.floor(Math.random() * 1000)}`;
      const password = Math.random().toString(36).slice(-10).toUpperCase();
      setClassCredentials({ username, password });
    }
  };

  const handleAssignClass = async () => {
    if (!selectedTeacher || !selectedClass || !activity || selectedSchedules.length === 0 || !classCredentials.username || !classCredentials.password) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/assign-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          classId: selectedClass,
          subject: activity, // sending as 'subject' to match likely existing API payload expectation unless we change backend assign-class too
          sections: selectedSchedules, // sending as 'sections' to match likely existing API payload expectation
          credentials: classCredentials,
        }),
      });
      if (response.ok) {
        setSelectedTeacher("");
        setSelectedClass("");
        setActivity("");
        setSelectedSchedules([]);
        setClassCredentials({ username: "", password: "" });
        setAvailableActivities([]);
        await Promise.all([fetchData(), fetchAssignedClasses()]);
      } else {
        alert("Failed to assign.")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignClass = async (teacherId, classId, section, subject) => {
    try {
      const response = await fetch("/api/admin/unassign-class", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, classId, section, subject }),
      });
      if (response.ok) {
        await Promise.all([fetchData(), fetchAssignedClasses()]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(2, 6, 23, 0.4)",
      borderColor: state.isFocused ? "#3b82f6" : "#0f172a",
      color: "#ffffff",
      borderRadius: "1.25rem",
      padding: "0.5rem 0.75rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#1e293b" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0f172a",
      borderRadius: "1.25rem",
      border: "1px solid #1e293b",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "rgba(59, 130, 246, 0.1)" : "transparent",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderRadius: "0.5rem",
      border: "1px solid rgba(59, 130, 246, 0.2)",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#3b82f6",
      fontWeight: "800",
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#3b82f6",
      "&:hover": { backgroundColor: "transparent", color: "#60a5fa" },
    }),
  };

  return (
    <div className="space-y-8 font-outfit">
      {/* Node Provisioning Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-white tracking-tighter">Assign Therapist</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Link Therapists to Groups</p>
        </div>
        <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Total Assignments </span>
          <p className="text-lg font-black text-white">{assignedClasses.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Assignment Engine */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-900 relative group overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
              <Zap className="text-primary-500" size={20} />
              Assignment Manager
            </h2>

            <div className="space-y-6">
              {/* Clinician Select */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <User size={12} /> Select Therapist
                </label>
                <div className="relative group">
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full pl-6 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer hover:bg-slate-950 transition-all"
                  >
                    <option value="">Select Therapist...</option>
                    {availableTeachers.map((t) => (
                      <option key={t._id} value={t._id}>{t.name} (ID: {t._id.slice(-4).toUpperCase()})</option>
                    ))}
                  </select>
                  <RefreshCw className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Unit Select */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <ClipboardList size={12} /> Therapy Group
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setActivity("");
                        setSelectedSchedules([]);
                        setAvailableActivities([]);
                        setClassCredentials({ username: "", password: "" });
                      }}
                      className="w-full pl-6 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
                    >
                      <option value="">Select Group...</option>
                      {availableClasses.map((cls) => (
                        <option key={cls._id} value={cls._id}>{cls.className} ({cls.category})</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Discipline Select */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <BookOpen size={12} /> Activity/Service
                  </label>
                  <div className="relative">
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className="w-full pl-6 pr-10 py-5 bg-slate-950/50 border border-slate-900 rounded-3xl text-white focus:outline-none focus:border-primary-500 font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer disabled:opacity-30"
                      disabled={!selectedClass}
                    >
                      <option value="">Select Activity...</option>
                      {availableActivities.map((act) => (
                        <option key={act} value={act}>
                          {act}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Node Multi-Select */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Calendar size={12} /> Session Schedule
                </label>
                <Select
                  isMulti
                  options={scheduleOptions}
                  value={scheduleOptions.filter((opt) => selectedSchedules.includes(opt.value))}
                  onChange={(sel) => setSelectedSchedules(sel.map((opt) => opt.value))}
                  styles={customSelectStyles}
                  placeholder="SELECT TIME SLOTS..."
                  isDisabled={!selectedClass}
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <button
                onClick={handleAssignClass}
                disabled={loading || !selectedTeacher || !selectedClass || !activity || selectedSchedules.length === 0 || !classCredentials.username}
                className="w-full py-5 bg-primary-600 hover:bg-emerald-600 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-950/20 active:scale-95 disabled:opacity-30 group/btn"
              >
                {loading ? <Activity className="animate-spin" size={20} /> : <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                <span className="text-[10px] uppercase tracking-[0.2em]">Confirm Assignment</span>
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[80px] -z-0" />
        </div>

        {/* Credentials & Registry Status */}
        <div className="space-y-8">
          <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden h-full">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <Lock size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none uppercase text-[12px] tracking-widest">Session Credentials</h2>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Generated login for students</p>
                  </div>
                </div>
                <button
                  onClick={generateCredentials}
                  disabled={!selectedClass || !activity || selectedSchedules.length === 0}
                  className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white font-black rounded-2xl text-[9px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20"
                >
                  Generate New
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 opacity-50">Session Username</label>
                  <div className="px-6 py-5 bg-slate-900/50 border border-slate-800 rounded-3xl font-mono text-primary-400 text-sm font-black break-all">
                    {classCredentials.username || "NODE_AUTH_PENDING"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1 opacity-50">Encryption Key</label>
                  <div className="px-6 py-5 bg-slate-900/50 border border-slate-800 rounded-3xl font-mono text-emerald-500 text-sm font-black tracking-widest break-all">
                    {classCredentials.password || "••••••••••••"}
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-slate-900/40 rounded-3xl border border-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-slate-500" size={16} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Institutional Privacy Active</span>
                </div>
                <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase">
                  These credentials will be automatically emailed to the assigned therapist.
                </p>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/5 blur-[80px] -z-0" />
          </div>
        </div>
      </div>

      {/* Active Resource Registry List */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Activity className="text-primary-500" size={24} />
            <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">Active Assignments Log</h2>
          </div>
          <button onClick={fetchAssignedClasses} className="p-3 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-xl transition-all active:scale-90">
            <RefreshCw size={20} className={loadingAssigned ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="space-y-4">
          {assignedClasses.map((assignment, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/30 backdrop-blur-xl border border-slate-900 rounded-[2rem] p-8 group hover:border-slate-800 transition-all overflow-hidden relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <div className="lg:col-span-4 flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary-600/10 rounded-3xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform flex-shrink-0">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Assigned Therapist</p>
                    <h3 className="text-lg font-black text-white">{assignment.teacherName}</h3>
                    <p className="text-xs font-bold text-slate-500 font-mono mt-1">{assignment.teacherEmail}</p>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-900">
                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-2">Therapy Group</p>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-primary-400 uppercase tracking-widest">
                        {assignment.classDetails?.className || assignment.assignedClass || "Unknown Group"}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-slate-900 rounded text-[9px] font-black text-slate-500">
                          {assignment.section}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-900">
                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-2">Activity</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-black text-white uppercase tracking-widest truncate">{assignment.subject}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 flex items-center justify-end">
                  <button
                    onClick={() => handleUnassignClass(assignment.teacherId, assignment.classDetails?.classId || assignment.classId, assignment.section, assignment.subject)}
                    className="px-8 py-4 bg-slate-800/50 hover:bg-rose-900 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 active:scale-95 group/del"
                  >
                    <Trash2 size={16} className="group-hover/del:rotate-12 transition-transform" />
                    <span className="text-[9px] uppercase tracking-widest">Remove Assignment</span>
                  </button>
                </div>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary-600/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
          {assignedClasses.length === 0 && (
            <div className="text-center py-20 bg-slate-900/10 rounded-[2.5rem] border border-dashed border-slate-800">
              <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em]">No active assignments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
