import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

// GET all students
export async function GET() {
  try {
    await dbConnect();

    const students = await Student.find().select("-password -verificationToken"); // hide sensitive fields

    return NextResponse.json(
      { success: true, count: students.length, data: students },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
