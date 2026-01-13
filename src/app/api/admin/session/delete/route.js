import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Session from "@/models/Session"

const MONGODB_URI = process.env.MONGODB_URI

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return mongoose.connection
    await mongoose.connect(MONGODB_URI)
    return mongoose.connection
}

export async function DELETE(request) {
    try {
        await connectToDatabase()

        const { sessionId } = await request.json()

        if (!sessionId) {
            return NextResponse.json({ message: "Session ID is required" }, { status: 400 })
        }

        // Validate session ID format
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return NextResponse.json({ message: "Invalid session ID format" }, { status: 400 })
        }

        // Find the session first to log details
        const sessionToDelete = await Session.findById(sessionId)
        if (!sessionToDelete) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 })
        }

        // Check if it's an active session (prevent deletion)
        if (sessionToDelete.isActive) {
            return NextResponse.json({ message: "Cannot delete active session. Please end it first." }, { status: 400 })
        }

        // Delete the session
        const deletedSession = await Session.findByIdAndDelete(sessionId)

        console.log(`🗑️ Session deleted: ${deletedSession.sessionType} ${deletedSession.year}`)

        return NextResponse.json({ 
            message: "Session deleted successfully",
            deletedSession: {
                sessionType: deletedSession.sessionType,
                year: deletedSession.year,
                startDate: deletedSession.startDate,
                endDate: deletedSession.endDate,
            }
        }, { status: 200 })
    } catch (error) {
        console.error("❌ Error deleting session:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
