import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User"; // Updated to import User model
import ClassSection from "@/models/ClassSection";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret";
const COOKIE_NAME = "auth_token";

// Clear cached model to ensure updated schema is used
delete mongoose.models.User;

export async function GET(request) {
  try {
    await connectDB();
    console.log("API: Connecting to MongoDB - Success");

    // Log all cookies received
    console.log("API: Cookies received:", request.cookies.getAll());

    // Get JWT from cookie
    const token = request.cookies.get(COOKIE_NAME)?.value;
    console.log("API: auth_token value:", token || "No token found");

    if (!token) {
      console.log("API: No token provided, returning 401");
      return NextResponse.json(
        { message: "No token provided, please log in" },
        { status: 401 }
      );
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("API: Decoded JWT:", decoded);
    } catch (error) {
      console.log("API: JWT verification failed:", error.message);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Find teacher by ID and role
    console.log("API: Querying user with ID:", decoded.id, "and role: teacher");
    const teacher = await User.findOne({
      _id: decoded.id,
      role: "teacher",
    }).select("name email role classAssignments");

    if (!teacher) {
      console.log("API: Teacher not found for ID:", decoded.id);
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    // Log teacher data for debugging
    console.log("API: Teacher data fetched:", {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
    });

    // Find class sections assigned to the teacher
    console.log("API: Querying class sections for teacher ID:", teacher._id);
    const classSections = await ClassSection.find({
      assignedTeacher: teacher._id,
    })
      .select("subject semester section program room enrolledStudents")
      .populate({
        path: "enrolledStudents",
        select: "name email registrationNumber",
      });

    console.log("API: Class sections found:", classSections.length);

    // Prepare response data
    const response = {
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.role, // Use role as department for Sidebar compatibility
        assignedClasses: classSections.map((classSection) => ({
          classSectionId: classSection._id,
          subject: classSection.subject,
          program: classSection.program,
          semester: classSection.semester,
          section: classSection.section,
          room: classSection.room,
          totalStudents: classSection.enrolledStudents.length,
          students: classSection.enrolledStudents.map((student) => ({
            id: student._id,
            name: student.name,
            email: student.email,
            registrationNumber: student.registrationNumber,
          })),
        })),
        classCount: classSections.length,
        // Include classAssignments from User model for additional context
        classAssignments: teacher.classAssignments.map((assignment) => ({
          classId: assignment.classId,
          sections: assignment.sections,
          subject: assignment.subject,
          classDisplayName: assignment.classDisplayName,
          assignedAt: assignment.assignedAt,
        })),
      },
    };

    console.log("API: Sending response:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("API: Teacher me error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
