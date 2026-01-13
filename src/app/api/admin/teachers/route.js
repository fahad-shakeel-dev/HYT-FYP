


import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request) {
    try {
        await connectDB()

        const teachers = await User.find({
            role: { $in: ["teacher", "therapist"] },
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json(
            {
                teachers,
                count: teachers.length,
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Error fetching teachers:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
