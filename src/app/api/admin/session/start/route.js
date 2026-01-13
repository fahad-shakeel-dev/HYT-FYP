import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export async function POST(request) {
  try {
    await connectDB();

    const { sessionType, year } = await request.json();

    if (!sessionType || !year) {
      return NextResponse.json({ message: "Session type and year are required" }, { status: 400 });
    }

    const existingSession = await Session.findOne({ isActive: true });
    if (existingSession) {
      return NextResponse.json({ message: "An active session already exists" }, { status: 400 });
    }

    const newSession = new Session({
      sessionType,
      year: parseInt(year),
      startDate: new Date(),
      isActive: true,
      createdAt: new Date(),
    });

    await newSession.save();

    return NextResponse.json({ message: "Session started successfully", session: newSession });
  } catch (error) {
    console.error("Error starting session:", error);
    return NextResponse.json({ message: "Failed to start session", error: error.message }, { status: 500 });
  }
}
