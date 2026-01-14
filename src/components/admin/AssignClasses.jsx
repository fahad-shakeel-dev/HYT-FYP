"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, Send, Key, User, CheckCircle, AlertCircle, RefreshCw, Trash2, ShieldCheck, Activity, Zap, ClipboardList, Database, Lock, Calendar, Eye, EyeOff, Layers } from "lucide-react";
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

  // Toggle visibility for each assignment's password
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        alert("Therapist assigned successfully!");
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
      backgroundColor: "#f8fafc", // slate-50
      borderColor: state.isFocused ? "#3b82f6" : "#e2e8f0", // slate-200
      color: "#1e293b", // slate-800
      borderRadius: "1rem",
      padding: "0.5rem 0.5rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#cbd5e1" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      borderRadius: "1rem",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      zIndex: 50,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "transparent",
      color: state.isSelected ? "#ffffff" : "#1e293b",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.80rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#eff6ff",
      borderRadius: "0.5rem",
      border: "1px solid #dbeafe",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#2563eb",
      fontWeight: "700",
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#2563eb",
      "&:hover": { backgroundColor: "transparent", color: "#1e40af" },
    }),
    input: (provided) => ({
      ...provided,
      color: '#1e293b'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8',
      fontWeight: '500',
      fontSize: '0.75rem'
    })
  };

  return (
    <div className="space-y-8 font-outfit max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-primary-500" size={24} />
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Therapist Allocation</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest pl-9">Manage Clinical assignments and credentials</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"> Total Links </span>
            <p className="text-lg font-black text-slate-800">{assignedClasses.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Allocation Engine (Left/Top) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 relative group overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="text-primary-500" size={20} />
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  Allocation Controller
                </h2>
              </div>

              <div className="space-y-8">
                {/* Therapist Selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <User size={12} /> Select Therapist
                  </label>
                  <div className="relative group/select">
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-xs appearance-none cursor-pointer shadow-inner transition-all hover:bg-white"
                    >
                      <option value="">Choose a therapist from the registry...</option>
                      {availableTeachers.map((t) => (
                        <option key={t._id} value={t._id}>{t.name} — {t.email}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <RefreshCw size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Group Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
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
                        className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-xs appearance-none cursor-pointer shadow-inner transition-all hover:bg-white"
                      >
                        <option value="">Select Target Group...</option>
                        {availableClasses.map((cls) => (
                          <option key={cls._id} value={cls._id}>{cls.className}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Activity Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                      <BookOpen size={12} /> Activity Module
                    </label>
                    <div className="relative">
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-800 focus:outline-none focus:border-primary-500 font-bold text-xs appearance-none cursor-pointer disabled:opacity-50 shadow-inner transition-all hover:bg-white"
                        disabled={!selectedClass}
                      >
                        <option value="">Select Module...</option>
                        {availableActivities.map((act) => (
                          <option key={act} value={act}>{act}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Calendar size={12} /> Session Schedule
                  </label>
                  <Select
                    isMulti
                    options={scheduleOptions}
                    value={scheduleOptions.filter((opt) => selectedSchedules.includes(opt.value))}
                    onChange={(sel) => setSelectedSchedules(sel.map((opt) => opt.value))}
                    styles={customSelectStyles}
                    placeholder="Select time slots..."
                    isDisabled={!selectedClass}
                    className="text-sm font-medium"
                  />
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={handleAssignClass}
                  disabled={loading || !selectedTeacher || !selectedClass || !activity || selectedSchedules.length === 0 || !classCredentials.username}
                  className="w-full md:w-auto px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn hover:shadow-primary-300 transform"
                >
                  {loading ? <Activity className="animate-spin" size={20} /> : <CheckCircle size={20} className="group-hover/btn:scale-110 transition-transform" />}
                  <span className="uppercase tracking-widest text-[10px] tracking-[0.2em]">Confirm Allocation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Panel (Right) */}
        <div className="xl:col-span-4 space-y-8 h-full">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[500px] flex flex-col justify-between shadow-xl shadow-slate-200/50">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100">
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">Access Keys</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Session Authentication</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Session Username</label>
                    <button
                      onClick={() => navigator.clipboard.writeText(classCredentials.username)}
                      className="text-[10px] font-bold text-teal-600 hover:text-teal-500 flex items-center gap-1 uppercase tracking-wider transition-colors"
                      disabled={!classCredentials.username}
                    >
                      <ClipboardList size={12} /> Copy User
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      value={classCredentials.username}
                      onChange={(e) => setClassCredentials({ ...classCredentials, username: e.target.value })}
                      maxLength={30}
                      placeholder="Auto-generated or type custom..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-teal-700 text-sm font-bold tracking-wide focus:outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {classCredentials.username && <CheckCircle size={14} className="text-teal-500" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key (Password)</label>
                    <button
                      onClick={() => navigator.clipboard.writeText(classCredentials.password)}
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1 uppercase tracking-wider transition-colors"
                      disabled={!classCredentials.password}
                    >
                      <ClipboardList size={12} /> Copy Key
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={classCredentials.password}
                      onChange={(e) => setClassCredentials({ ...classCredentials, password: e.target.value })}
                      placeholder="Auto-generated or type custom..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-amber-600 text-sm font-bold tracking-wide focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {classCredentials.password && <Lock size={14} className="text-amber-500" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 px-1">
                    * Plain text key only. No encryption used.
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={generateCredentials}
                    disabled={!selectedClass || !activity || selectedSchedules.length === 0}
                    className="w-full py-4 bg-amber-50 md:bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-500 hover:text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Generate New Keys
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 relative z-10">
              <div className="flex gap-3">
                <ShieldCheck className="text-teal-600 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Plain Text Storage</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    Credentials can be viewed and copied repeatedly from the history log.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500/5 blur-[100px] -z-0" />
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="pt-10 border-t border-slate-200">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-3">
            <Activity className="text-primary-500" size={24} />
            Allocation History
          </h2>
          <button onClick={fetchAssignedClasses} className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 transition-all shadow-sm">
            <RefreshCw size={18} className={loadingAssigned ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {assignedClasses.map((assignment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 group hover:border-primary-200 transition-all shadow-md hover:shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Therapist Info */}
                  <div className="lg:col-span-3 flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 border border-primary-100 group-hover:scale-105 transition-transform">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Therapist</p>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight">{assignment.teacherName}</h3>
                      <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{assignment.teacherEmail}</p>
                    </div>
                  </div>

                  {/* Assignment Details */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Module & Group</p>
                      <p className="text-xs font-bold text-primary-600 mb-1">{assignment.subject}</p>
                      <p className="text-[10px] font-medium text-slate-500">{assignment.assignedClass}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Scheduled Slot</p>
                      <div className="flex flex-wrap gap-1">
                        {assignment.section && assignment.section.split(',').map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-slate-600 border border-slate-200 shadow-sm">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Credentials Display */}
                  <div className="lg:col-span-3">
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 transition-colors relative overflow-hidden">
                      <div className="flex justify-between items-center mb-3 relative z-10">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Key size={10} className="text-amber-500" /> Access Credentials
                        </p>
                      </div>
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 group/cred pl-4 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 shrink-0">User</span>
                          <code className="text-[13px] font-mono font-bold text-teal-700 select-all truncate">{assignment.classCredentials?.username || "N/A"}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(assignment.classCredentials?.username)}
                            className="text-slate-400 hover:text-teal-600 opacity-0 group-hover/cred:opacity-100 transition-opacity"
                            title="Copy Username"
                          >
                            <ClipboardList size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 group/cred pl-4 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 shrink-0">Key</span>
                          <code className="text-[13px] font-mono font-bold text-amber-600 select-all tracking-wide truncate">
                            {assignment.classCredentials?.password || "NO_KEY"}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(assignment.classCredentials?.password)}
                            className="text-slate-400 hover:text-amber-600 opacity-0 group-hover/cred:opacity-100 transition-opacity"
                            title="Copy Key"
                          >
                            <ClipboardList size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleUnassignClass(assignment.teacherId, assignment.classDetails?.classId || assignment.classId, assignment.section, assignment.subject)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                      title="Remove Allocation"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {assignedClasses.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Allocations Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
