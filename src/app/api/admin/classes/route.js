import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Class from "@/models/ClassSchema";

export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find().lean();
    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
