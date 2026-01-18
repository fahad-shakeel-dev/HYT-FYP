"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LucideUser, LucideUsers, LucideActivity, LucideShieldCheck, LucideChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [hoveredCard, setHoveredCard] = useState(null)
    const router = useRouter()

    const cards = [
        {
            id: "therapist",
            title: "Therapist Portal",
            subtitle: "Clinical Administration",
            description: "Secure gateway for therapists to orchestrate therapy nodes and monitor patient neurological progress.",
            icon: LucideUser,
            secondaryIcon: LucideActivity,
            color: "primary",
            route: "/therapist",
            stats: "1.2k+ Sessions Logged",
            buttonLabel: "Login as Therapist"
        },
        {
            id: "parent",
            title: "Parent Portal",
            subtitle: "Caregiver Access",
            description: "Dedicated access for parents to review clinical milestones, session logs, and therapeutic growth metrics.",
            icon: LucideUsers,
            secondaryIcon: LucideShieldCheck,
            color: "secondary",
            route: "/parent",
            stats: "Real-time Progress Tracking",
            buttonLabel: "Login as Parent"
        },
    ]

    const handleCardClick = (route) => {
        router.push(route)
    }

    return (
        <div className="min-h-screen w-full max-w-screen bg-[#f8fafc] flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-x-hidden overflow-y-auto font-outfit">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 80, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-[80px]"
                />
                <motion.div
                    animate={{
                        x: [0, -60, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-[70px]"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -80, 0]
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] bg-indigo-100/20 rounded-full blur-[80px]"
                />
            </div>

            {/* Content Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-10 sm:mb-16 z-10 relative"
            >
                <motion.div
                    className="inline-flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3 bg-white shadow-xl shadow-slate-200/50 rounded-full mb-6 sm:mb-10 border border-slate-50"
                    whileHover={{ scale: 1.05, y: -2 }}
                >
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-200 animate-pulse">
                        <LucideActivity size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Lumos Milestone Care</span>
                </motion.div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-4 sm:mb-6">
                    Lumos Milestone <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">Care Portal</span>
                </h1>

                <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-500 font-bold text-base sm:text-lg max-w-2xl mx-auto mb-2">
                        Connect with experienced therapists and receive personalized clinical care online.
                    </p>
                </div>
            </motion.div>

            {/* Portal Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-6xl z-10 relative px-2 sm:px-4">
                {cards.map((card, idx) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => setHoveredCard(card.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="group relative"
                    >
                        {/* Card Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${card.id === 'therapist' ? 'from-primary-600 to-indigo-600' : 'from-teal-500 to-primary-600'} rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>

                        <div
                            onClick={() => handleCardClick(card.route)}
                            className="relative bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3rem] p-4 sm:p-6 md:p-8 lg:p-12 h-full flex flex-col justify-between cursor-pointer shadow-xl transition-all duration-500 group-hover:-translate-y-3"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div>
                                <div className="flex items-start justify-between mb-8 sm:mb-12">
                                    <motion.div
                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] sm:rounded-[2.5rem] ${card.id === 'therapist' ? 'bg-primary-600 shadow-primary-200' : 'bg-slate-900 shadow-slate-400'} flex items-center justify-center text-white shadow-2xl relative overflow-hidden`}
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                    >
                                        <card.icon size={28} className="relative z-10 sm:hidden" />
                                        <card.icon size={36} className="relative z-10 hidden sm:block" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                                    </motion.div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1 leading-none">{card.subtitle}</p>
                                        <p className="text-sm font-black text-slate-400 leading-none">{card.stats}</p>
                                    </div>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 sm:mb-4 tracking-tight group-hover:text-primary-600 transition-colors">
                                    {card.title}
                                </h2>
                                <p className="text-slate-500 font-bold text-xs sm:text-sm leading-relaxed mb-6 sm:mb-10 max-w-xs">
                                    {card.description}
                                </p>
                            </div>

                            <div className="relative w-full">
                                <motion.div
                                    className={`w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 ${card.id === 'therapist' ? 'bg-primary-600 hover:bg-primary-700' : 'bg-slate-900 hover:bg-slate-950'} text-white font-outfit rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center gap-2 sm:gap-3 group/btn overflow-hidden relative transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 text-[11px] sm:text-xs md:text-sm lg:text-base uppercase tracking-[0.12em] font-black">{card.buttonLabel}</span>
                                    <LucideChevronRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform hidden sm:block" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                </motion.div>

                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-4">
                                    <div className="flex items-center gap-2 text-slate-600 font-black text-xs sm:text-sm uppercase tracking-wide">
                                        <card.secondaryIcon size={16} />
                                        Verified & Safe
                                    </div>
                                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                                    <div className="flex items-center gap-2 text-slate-600 font-black text-xs sm:text-sm uppercase tracking-wide">
                                        <LucideShieldCheck size={16} />
                                        Secure & Protected
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Institutional Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-20 z-10 flex flex-col items-center gap-4"
            >
                <div className="flex items-center gap-6">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1">Branding Unit</p>
                        <p className="text-sm font-black text-slate-700 leading-none">Lumos Milestone Care • 2025</p>
                    </div>
                </div>

                <div className="px-6 py-2 bg-slate-100/50 backdrop-blur-sm rounded-full border border-slate-50">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Institutional Milestone Tracker & Patient Care Network</p>
                </div>
            </motion.div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;700;900&display=swap');
                
                .font-outfit {
                    font-family: 'Outfit', sans-serif;
                }
            `}</style>
        </div>
    )
}
