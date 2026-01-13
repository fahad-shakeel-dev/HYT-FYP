// stdimport { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret";
const COOKIE_NAME = "auth_token";

// Clear cached model to ensure updated schema is used
delete mongoose.models.Student;

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

    // Find student by ID and populate enrollments
    const student = await Student.findById(decoded.id)
      .select(
        "name email registrationNumber program semester section classId room enrollments enrollmentCount"
      )
      .populate({
        path: "enrollments.classSectionId",
        select: "subject semester section program room enrolledStudents assignedTeacher",
        populate: {
          path: "assignedTeacher",
          select: "name email",
        },
        options: { strictPopulate: false },
      });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Log student data for debugging
    console.log("Student data fetched:", {
      id: student._id,
      name: student.name,
      email: student.email,
      program: student.program,
      semester: student.semester,
      section: student.section,
    });

    // Find class section for the student's primary section
    let classSection = null;
    try {
      classSection = await ClassSection.findOne({
        program: student.program,
        semester: student.semester,
        section: student.section,
      }).populate("assignedTeacher", "name email");
    } catch (error) {
      console.warn("ClassSection query error:", error.message);
    }

    // Get teacher details
    const teacher = classSection?.assignedTeacher || null;

    // Get classmates
    const classmates = await Student.find({
      program: student.program,
      semester: student.semester,
      section: student.section,
      _id: { $ne: student._id },
    }).select("name email registrationNumber");

    return NextResponse.json(
      {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          registrationNumber: student.registrationNumber,
          program: student.program,
          semester: student.semester,
          section: student.section,
          classId: student.classId,
          room: student.room,
          enrollments: student.enrollments.map((enrollment) => ({
            classSectionId: enrollment.classSectionId?._id,
            classId: enrollment.classId,
            subject: enrollment.subject,
            program: enrollment.program,
            semester: enrollment.semester,
            section: enrollment.section,
            enrolledAt: enrollment.enrolledAt,
            classDetails: enrollment.classSectionId
              ? {
                  program: enrollment.classSectionId.program,
                  room: enrollment.classSectionId.room,
                  totalStudents: enrollment.classSectionId.enrolledStudents,
                  teacher: enrollment.classSectionId.assignedTeacher
                    ? {
                        name: enrollment.classSectionId.assignedTeacher.name,
                        email: enrollment.classSectionId.assignedTeacher.email,
                      }
                    : null,
                }
              : null,
          })),
          enrollmentCount: student.enrollmentCount,
        },
        teacher: teacher
          ? {
              name: teacher.name,
              email: teacher.email,
              subject: classSection?.subject,
            }
          : null,
        classmates,
        classInfo: classSection
          ? {
              program: classSection.program,
              semester: classSection.semester,
              section: classSection.section,
              subject: classSection.subject,
              room: classSection.room,
              totalStudents: classSection.enrolledStudents,
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Student me error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server"
// import jwt from "jsonwebtoken"
// import connectDB from "@/lib/mongodb"
// import Student from "@/models/Student"

// export async function GET(request) {
//   try {
//     // Get token from Authorization header or cookies
//     const authHeader = request.headers.get("authorization")
//     const cookieToken = request.cookies.get("token")?.value

//     let token = null

//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       token = authHeader.substring(7)
//     } else if (cookieToken) {
//       token = cookieToken
//     }

//     if (!token) {
//       return NextResponse.json({ message: "No token provided, please log in" }, { status: 401 })
//     }

//     // Verify token
//     let decoded
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
//     } catch (jwtError) {
//       console.error("JWT verification failed:", jwtError)
//       return NextResponse.json({ message: "Invalid token, please log in again" }, { status: 401 })
//     }

//     if (!decoded.id || decoded.role !== "student") {
//       return NextResponse.json({ message: "Invalid token or unauthorized access" }, { status: 401 })
//     }

//     await connectDB()

//     // Find student by ID
//     const student = await Student.findById(decoded.id)
//       .select("-password") // Exclude password from response
//       .lean()

//     if (!student) {
//       return NextResponse.json({ message: "Student not found" }, { status: 404 })
//     }

//     return NextResponse.json({
//       success: true,
//       student: {
//         id: student._id,
//         name: student.name,
//         email: student.email,
//         rollNumber: student.rollNumber,
//         program: student.program,
//         semester: student.semester,
//         section: student.section,
//         isApproved: student.isApproved,
//         createdAt: student.createdAt,
//       },
//     })
//   } catch (error) {
//     console.error("Error in /api/parent/me:", error)
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//   }
// }
