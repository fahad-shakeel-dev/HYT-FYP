import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Graduate from "@/models/Graduate";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const program = searchParams.get("program");
    const search = searchParams.get("search");

    const query = {};
    if (year) query.graduationYear = parseInt(year);
    if (program) query.program = program;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const graduates = await Graduate.find(query).lean();
    const graduationYears = await Graduate.distinct("graduationYear");
    const programs = await Graduate.distinct("program");

    return NextResponse.json({
      graduates,
      graduationYears: graduationYears.sort((a, b) => b - a),
      programs: programs.sort(),
    });
  } catch (error) {
    console.error("Error fetching graduates:", error);
    return NextResponse.json({ message: "Failed to fetch graduates", error: error.message }, { status: 500 });
  }
}
