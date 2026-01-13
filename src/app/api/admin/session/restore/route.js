import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Session from "@/models/Session"

const MONGODB_URI = process.env.MONGODB_URI

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return mongoose.connection
    await mongoose.connect(MONGODB_URI)
    return mongoose.connection
}

// Get specific session data for restore preview
export async function GET(request) {
    try {
        await connectToDatabase()

        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get('sessionId')

        if (!sessionId) {
            return NextResponse.json({ message: "Session ID is required" }, { status: 400 })
        }

        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return NextResponse.json({ message: "Invalid session ID format" }, { status: 400 })
        }

        const session = await Session.findById(sessionId).lean()

        if (!session) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 })
        }

        if (session.isActive) {
            return NextResponse.json({ message: "Cannot restore active session" }, { status: 400 })
        }

        return NextResponse.json({
            message: "Session data retrieved successfully",
            session: {
                id: session._id,
                sessionType: session.sessionType,
                year: session.year,
                startDate: session.startDate,
                endDate: session.endDate,
                hasData: !!session.sessionData,
                dataPreview: session.sessionData ? {
                    teachers: session.sessionData.teachersProcessed || 0,
                    students: session.sessionData.studentsProcessed || 0,
                    classes: session.sessionData.classesProcessed || 0,
                    sections: session.sessionData.sectionsProcessed || 0,
                    activities: session.sessionData.activities?.length || 0
                } : null
            },
            fullData: session.sessionData || null
        })

    } catch (error) {
        console.error("Error retrieving session data:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

// Restore session data (for emergency recovery - use with caution)
export async function POST(request) {
    try {
        await connectToDatabase()

        const { sessionId, confirmRestore } = await request.json()

        if (!sessionId) {
            return NextResponse.json({ message: "Session ID is required" }, { status: 400 })
        }

        if (!confirmRestore) {
            return NextResponse.json({ message: "Please confirm restore operation" }, { status: 400 })
        }

        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return NextResponse.json({ message: "Invalid session ID format" }, { status: 400 })
        }

        // Check if there's an active session
        const activeSession = await Session.findOne({ isActive: true })
        if (activeSession) {
            return NextResponse.json({ 
                message: "Cannot restore while another session is active. Please end current session first." 
            }, { status: 400 })
        }

        const sessionToRestore = await Session.findById(sessionId)
        if (!sessionToRestore) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 })
        }

        if (!sessionToRestore.sessionData) {
            return NextResponse.json({ message: "No backup data available for this session" }, { status: 400 })
        }

        // This is a dangerous operation - it would restore old data
        // For safety, we'll just return the data structure without actually restoring
        console.log(`⚠️  Restore requested for session: ${sessionToRestore.sessionType} ${sessionToRestore.year}`)

        return NextResponse.json({
            message: "Session restore data prepared (restore functionality disabled for safety)",
            warning: "Actual data restore is disabled to prevent data corruption. Use manual import if needed.",
            sessionInfo: {
                sessionType: sessionToRestore.sessionType,
                year: sessionToRestore.year,
                startDate: sessionToRestore.startDate,
                endDate: sessionToRestore.endDate
            },
            availableData: sessionToRestore.sessionData ? {
                teachers: sessionToRestore.sessionData.teachers?.length || 0,
                students: sessionToRestore.sessionData.students?.length || 0,
                classes: sessionToRestore.sessionData.classes?.length || 0,
                sections: sessionToRestore.sessionData.classSections?.length || 0,
                activities: sessionToRestore.sessionData.activities?.length || 0
            } : null
        })

    } catch (error) {
        console.error("Error in restore operation:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
