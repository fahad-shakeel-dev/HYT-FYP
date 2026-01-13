import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";

export async function GET() {
  try {
    await connectDB();

    const sessions = await Session.find({ isActive: false })
      .sort({ endDate: -1 })
      .lean();

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching session history:", error);
    return NextResponse.json({ message: "Failed to fetch session history", error: error.message }, { status: 500 });
  }
}
