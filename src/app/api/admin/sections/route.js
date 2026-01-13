import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ClassSection from "@/models/ClassSection"

export async function GET(request) {
    try {
        await connectDB()

        const sections = await ClassSection.find({})
            .populate("students", "name email registrationNumber")
            .sort({ category: 1, schedule: 1 })
            .lean()

        return NextResponse.json(
            {
                sections,
                count: sections.length,
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Error fetching sections:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
