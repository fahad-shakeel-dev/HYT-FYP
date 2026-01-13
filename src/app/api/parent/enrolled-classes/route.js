import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";
import Class from "@/models/ClassSchema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret";
const COOKIE_NAME = "auth_token";

export async function GET(request) {
  try {
    await connectDB();

    // Get JWT from cookie
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Find student and populate enrollments
    const student = await Student.findById(decoded.id)
      .select("enrollments")
      .populate({
        path: "enrollments.classSectionId",
        select: "program semester section room subject enrolledStudents assignedTeacher classId",
        populate: [
          { path: "assignedTeacher", select: "name email" },
          { path: "classId", select: "className" },
        ],
      });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Map enrollments to enrolledClasses format
    const enrolledClasses = student.enrollments.map((enrollment, index) => ({
      id: enrollment.classSectionId?._id.toString(),
      name: enrollment.classSectionId?.classId?.className || `${enrollment.semester}${enrollment.section} ${enrollment.subject}`,
      program: enrollment.program,
      semester: enrollment.semester,
      section: enrollment.section,
      room: enrollment.classSectionId?.room,
      subject: enrollment.subject,
      enrolledStudents: enrollment.classSectionId?.enrolledStudents,
      teacher: enrollment.classSectionId?.assignedTeacher
        ? {
            name: enrollment.classSectionId.assignedTeacher.name,
            email: enrollment.classSectionId.assignedTeacher.email,
          }
        : null,
      color: ["bg-blue-500", "bg-green-500", "bg-purple-500"][index % 3],
    }));

    return NextResponse.json({ enrolledClasses }, { status: 200 });
  } catch (error) {
    console.error("Fetch enrolled classes error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
