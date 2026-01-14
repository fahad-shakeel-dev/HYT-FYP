// import { NextResponse } from "next/server"
// import connectDB from "@/lib/mongodb"
// import Student from "@/models/Student"
// import ClassSection from "@/models/ClassSection"

// export async function POST(request) {
//     try {
//         await connectDB()

//         const { email, username, password } = await request.json()

//         if (!email || !username || !password) {
//             return NextResponse.json({ message: "All fields are required" }, { status: 400 })
//         }

//         // Find student by email
//         const student = await Student.findOne({ email })
//         if (!student) {
//             return NextResponse.json({ message: "Student not found with this email" }, { status: 404 })
//         }

//         // Find the class section
//         const classSection = await ClassSection.findOne({
//             semester: student.semester,
//             section: student.section,
//         }).populate("assignedTeacher")

//         if (!classSection || !classSection.assignedTeacher) {
//             return NextResponse.json({ message: "No teacher assigned to your class yet" }, { status: 404 })
//         }

//         // Get teacher details
//         const teacher = classSection.assignedTeacher

//         // Verify credentials match teacher's provided credentials
//         if (
//             !teacher.classCredentials ||
//             teacher.classCredentials.username !== username ||
//             teacher.classCredentials.password !== password
//         ) {
//             return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
//         }

//         // Get all classmates
//         const classmates = await Student.find({
//             semester: student.semester,
//             section: student.section,
//             _id: { $ne: student._id }, // Exclude current student
//         }).select("name email registrationNumber")

//         return NextResponse.json(
//             {
//                 message: "Login successful",
//                 student: {
//                     id: student._id,
//                     name: student.name,
//                     email: student.email,
//                     registrationNumber: student.registrationNumber,
//                     semester: student.semester,
//                     section: student.section,
//                     classId: student.classId,
//                     room: student.room,
//                 },
//                 teacher: {
//                     name: teacher.name,
//                     email: teacher.email,
//                     subject: classSection.subject,
//                 },
//                 classmates,
//                 classInfo: {
//                     semester: classSection.semester,
//                     section: classSection.section,
//                     room: classSection.room,
//                     totalStudents: classSection.enrolledStudents,
//                 },
//             },
//             { status: 200 },
//         )
//     } catch (error) {
//         console.error("Student login error:", error)
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//     }
// }





// import { NextResponse } from "next/server"
// import connectDB from "@/lib/mongodb"
// import Student from "@/models/Student"
// import ClassSection from "@/models/ClassSection"
// import bcrypt from "bcryptjs"

// export async function POST(request) {
//     try {
//         await connectDB()

//         const { email, password } = await request.json()

//         if (!email || !password) {
//             return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
//         }

//         // Find student by email
//         const student = await Student.findOne({ email })
//         if (!student) {
//             return NextResponse.json({ message: "Student not found with this email" }, { status: 404 })
//         }

//         // Verify password
//         const isPasswordValid = await bcrypt.compare(password, student.password)
//         if (!isPasswordValid) {
//             return NextResponse.json({ message: "Invalid password" }, { status: 401 })
//         }

//         // Check if student is verified
//         if (!student.isVerified) {
//             return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 401 })
//         }

//         // Find the class section
//         const classSection = await ClassSection.findOne({
//             semester: student.semester,
//             section: student.section,
//         }).populate("assignedTeacher")

//         // Get teacher details (if available)
//         const teacher = classSection?.assignedTeacher || null

//         // Get all classmates
//         const classmates = await Student.find({
//             semester: student.semester,
//             section: student.section,
//             _id: { $ne: student._id }, // Exclude current student
//         }).select("name email registrationNumber")

//         return NextResponse.json(
//             {
//                 message: "Login successful",
//                 student: {
//                     id: student._id,
//                     name: student.name,
//                     email: student.email,
//                     registrationNumber: student.registrationNumber,
//                     semester: student.semester,
//                     section: student.section,
//                     classId: student.classId,
//                     room: student.room,
//                 },
//                 teacher: teacher
//                     ? {
//                           name: teacher.name,
//                           email: teacher.email,
//                           subject: classSection.subject,
//                       }
//                     : null,
//                 classmates,
//                 classInfo: classSection
//                     ? {
//                           semester: classSection.semester,
//                           section: classSection.section,
//                           room: classSection.room,
//                           totalStudents: classSection.enrolledStudents,
//                       }
//                     : null,
//             },
//             { status: 200 }
//         )
//     } catch (error) {
//         console.error("Student login error:", error)
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//     }
// }





// std

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";
import User from "@/models/User"; // Import User model to avoid MissingSchemaError
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json({ message: "Student not found with this email" }, { status: 404 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Check if student is verified
    if (!student.isVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 401 });
    }

    // Find the class section
    const classSection = await ClassSection.findOne({
      program: student.program,
      semester: student.semester,
      section: student.section,
    }).populate("assignedTeacher");

    // Get teacher details (if available)
    const teacher = classSection?.assignedTeacher || null;

    // Get all classmates
    const classmates = await Student.find({
      program: student.program,
      semester: student.semester,
      section: student.section,
      _id: { $ne: student._id }, // Exclude current student
    }).select("name email registrationNumber");

    // Generate JWT
    const tokenPayload = {
      id: student._id.toString(),
      email: student.email,
      role: student.role || "student",
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "30d", // Token expires in 30 days
    });

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
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
        },
        teacher: teacher
          ? {
            name: teacher.name,
            email: teacher.email,
            subject: classSection.subject,
          }
          : null,
        classmates,
        classInfo: classSection
          ? {
            program: classSection.program,
            semester: classSection.semester,
            section: classSection.section,
            room: classSection.room,
            totalStudents: classSection.enrolledStudents,
          }
          : null,
      },
      { status: 200 }
    );

    // Set JWT as HTTP-only cookie
    response.cookies.set({
      name: "p_auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
