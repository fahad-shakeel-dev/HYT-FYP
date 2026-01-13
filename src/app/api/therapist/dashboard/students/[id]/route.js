import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

// GET single student by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const student = await Student.findById(id).select("-password -verificationToken");

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: student },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
