import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";
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
        { message: "No token provided, please log in" },
        { status: 401 }
      );
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Find student
    const student = await Student.findById(decoded.id).select("semester section classId enrollments");
    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Get enrolled classSectionIds
    const enrolledSectionIds = student.enrollments.map((enrollment) => enrollment.classSectionId.toString());

    // Find available class sections
    const classSections = await ClassSection.find({
      semester: student.semester,
      section: student.section,
      classId: student.classId,
      _id: { $nin: enrolledSectionIds },
    }).select("classId subject semester section program room enrolledStudents");

    return NextResponse.json(
      { classSections },
      { status: 200 }
    );
  } catch (error) {
    console.error("Available sections error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
