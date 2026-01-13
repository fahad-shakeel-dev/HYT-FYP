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

// Create manual backup of current session
export async function POST() {
    try {
        await connectToDatabase()

        const activeSession = await Session.findOne({ isActive: true })
        if (!activeSession) {
            return NextResponse.json({ message: "No active session found" }, { status: 404 })
        }

        // Collect all current data
        const [teachers, students, classes, classSections, registrationRequests] = await Promise.all([
            User.find({ role: "teacher" }).lean(),
            Student.find({}).lean(),
            Class.find({}).lean(),
            ClassSection.find({}).lean(),
            RegistrationRequest.find({}).lean(),
        ])

        // Create backup data structure
        const backupData = {
            sessionInfo: {
                sessionType: activeSession.sessionType,
                year: activeSession.year,
                startDate: activeSession.startDate,
                backupDate: new Date(),
            },
            data: {
                teachers,
                students,
                classes,
                classSections,
                registrationRequests,
                activities: activeSession.activities || []
            },
            counts: {
                teachers: teachers.length,
                students: students.length,
                classes: classes.length,
                sections: classSections.length,
                requests: registrationRequests.length,
                activities: activeSession.activities?.length || 0
            }
        }

        // Log backup activity
        activeSession.activities.push({
            type: "manual_backup",
            description: "Manual session backup created",
            details: { counts: backupData.counts },
            timestamp: new Date(),
        })

        await activeSession.save()

        console.log(`💾 Manual backup created for ${activeSession.sessionType} ${activeSession.year}`)

        return NextResponse.json({
            message: "Session backup created successfully",
            backup: {
                sessionInfo: backupData.sessionInfo,
                counts: backupData.counts,
                backupSize: JSON.stringify(backupData).length
            },
            backupData: backupData
        })

    } catch (error) {
        console.error("Error creating session backup:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

// Get list of all session backups
export async function GET() {
    try {
        await connectToDatabase()

        const sessions = await Session.find({ isActive: false })
            .sort({ endDate: -1 })
            .select('sessionType year startDate endDate sessionData')
            .lean()

        const backups = sessions.map(session => ({
            id: session._id,
            sessionType: session.sessionType,
            year: session.year,
            startDate: session.startDate,
            endDate: session.endDate,
            hasBackup: !!session.sessionData,
            dataSize: session.sessionData ? JSON.stringify(session.sessionData).length : 0,
            counts: session.sessionData ? {
                teachers: session.sessionData.teachersProcessed || 0,
                students: session.sessionData.studentsProcessed || 0,
                classes: session.sessionData.classesProcessed || 0,
                sections: session.sessionData.sectionsProcessed || 0
            } : null
        }))

        return NextResponse.json({
            message: "Session backups retrieved successfully",
            backups: backups,
            totalBackups: backups.length
        })

    } catch (error) {
        console.error("Error fetching session backups:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
