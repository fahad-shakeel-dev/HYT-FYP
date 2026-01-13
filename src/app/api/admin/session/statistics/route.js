import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Session from "@/models/Session"
import User from "@/models/User"
import Student from "@/models/Student"
import Class from "@/models/ClassSchema"
import ClassSection from "@/models/ClassSection"
import RegistrationRequest from "@/models/RegistrationRequest"

const MONGODB_URI = process.env.MONGODB_URI

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return mongoose.connection
    await mongoose.connect(MONGODB_URI)
    return mongoose.connection
}

export async function GET() {
    try {
        await connectToDatabase()

        const activeSession = await Session.findOne({ isActive: true })

        if (!activeSession) {
            return NextResponse.json({ message: "No active session found" }, { status: 404 })
        }

        // Get real-time statistics
        const [
            totalTeachers,
            approvedTeachers,
            totalStudents,
            totalClasses,
            totalSections,
            totalRequests,
            teachersWithAssignments,
            sectionsWithTeachers,
            sectionsWithStudents
        ] = await Promise.all([
            User.countDocuments({ role: "teacher" }),
            User.countDocuments({ role: "teacher", isApproved: true }),
            Student.countDocuments({}),
            Class.countDocuments({}),
            ClassSection.countDocuments({}),
            RegistrationRequest.countDocuments({}),
            User.countDocuments({ role: "teacher", classAssignments: { $exists: true, $ne: [] } }),
            ClassSection.countDocuments({ assignedTeacher: { $ne: null } }),
            ClassSection.countDocuments({ enrolledStudents: { $gt: 0 } })
        ])

        // Get semester-wise student distribution
        const studentsBySemester = await Student.aggregate([
            { $group: { _id: "$semester", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])

        // Get program-wise student distribution
        const studentsByProgram = await Student.aggregate([
            { $group: { _id: "$program", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        // Get class distribution by semester
        const classesBySemester = await Class.aggregate([
            { $group: { _id: "$semester", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])

        // Calculate session duration
        const sessionDuration = Math.ceil(
            (new Date() - new Date(activeSession.startDate)) / (1000 * 60 * 60 * 24)
        )

        const statistics = {
            sessionInfo: {
                sessionType: activeSession.sessionType,
                year: activeSession.year,
                startDate: activeSession.startDate,
                duration: sessionDuration,
                activitiesCount: activeSession.activities?.length || 0
            },
            counts: {
                totalTeachers,
                approvedTeachers,
                totalStudents,
                totalClasses,
                totalSections,
                totalRequests,
                teachersWithAssignments,
                sectionsWithTeachers,
                sectionsWithStudents
            },
            distributions: {
                studentsBySemester: studentsBySemester.reduce((acc, item) => {
                    acc[item._id] = item.count
                    return acc
                }, {}),
                studentsByProgram: studentsByProgram.reduce((acc, item) => {
                    acc[item._id] = item.count
                    return acc
                }, {}),
                classesBySemester: classesBySemester.reduce((acc, item) => {
                    acc[item._id] = item.count
                    return acc
                }, {})
            },
            percentages: {
                teachersApproved: totalTeachers > 0 ? Math.round((approvedTeachers / totalTeachers) * 100) : 0,
                teachersWithAssignments: totalTeachers > 0 ? Math.round((teachersWithAssignments / totalTeachers) * 100) : 0,
                sectionsWithTeachers: totalSections > 0 ? Math.round((sectionsWithTeachers / totalSections) * 100) : 0,
                sectionsWithStudents: totalSections > 0 ? Math.round((sectionsWithStudents / totalSections) * 100) : 0
            }
        }

        return NextResponse.json({
            message: "Session statistics retrieved successfully",
            statistics
        })

    } catch (error) {
        console.error("Error fetching session statistics:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
