import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Session from "@/models/Session"

const MONGODB_URI = process.env.MONGODB_URI

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return mongoose.connection
    await mongoose.connect(MONGODB_URI)
    return mongoose.connection
}

export async function POST(request) {
    try {
        await connectToDatabase()

        const { type, description, details } = await request.json()

        if (!type || !description) {
            return NextResponse.json({ message: "Type and description are required" }, { status: 400 })
        }

        const activeSession = await Session.findOne({ isActive: true })

        if (!activeSession) {
            return NextResponse.json({ message: "No active session found" }, { status: 404 })
        }

        // Create activity object
        const activity = {
            type,
            description,
            details: details || {},
            timestamp: new Date(),
        }

        // Add activity to session
        activeSession.activities.push(activity)

        // Keep only last 1000 activities to prevent document size issues
        if (activeSession.activities.length > 1000) {
            activeSession.activities = activeSession.activities.slice(-1000)
        }

        await activeSession.save()

        console.log(`📝 Activity logged: ${type} - ${description}`)

        return NextResponse.json({ 
            message: "Activity logged successfully",
            activity: activity,
            totalActivities: activeSession.activities.length
        }, { status: 200 })
    } catch (error) {
        console.error("❌ Error logging activity:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

// GET method to retrieve recent activities
export async function GET() {
    try {
        await connectToDatabase()

        const activeSession = await Session.findOne({ isActive: true })

        if (!activeSession) {
            return NextResponse.json({ message: "No active session found" }, { status: 404 })
        }

        // Return last 50 activities
        const recentActivities = activeSession.activities.slice(-50).reverse()

        return NextResponse.json({
            activities: recentActivities,
            totalActivities: activeSession.activities.length,
            sessionInfo: {
                sessionType: activeSession.sessionType,
                year: activeSession.year,
                startDate: activeSession.startDate,
            }
        })
    } catch (error) {
        console.error("❌ Error fetching activities:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
