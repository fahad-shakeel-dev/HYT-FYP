import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export async function GET() {
  try {
    await connectDB();

    const activeSession = await Session.findOne({ isActive: true }).lean();
    return NextResponse.json({
      hasActiveSession: !!activeSession,
      session: activeSession || null,
    });
  } catch (error) {
    console.error("Error checking session status:", error);
    return NextResponse.json({ message: "Failed to check session status", error: error.message }, { status: 500 });
  }
}
