
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret";
const COOKIE_NAME = "auth_token";

export async function POST(request) {
  let sanitizedUsername = "undefined";
  try {
    await connectDB();

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { message: "No token provided, please log in" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("JWT decoded:", { userId: decoded.id });
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    sanitizedUsername = username.trim().toLowerCase();
    console.log("Enrollment attempt:", { username: sanitizedUsername });

    const session = await mongoose.startSession();
    let result;

    try {
      await session.withTransaction(async () => {
        const student = await Student.findById(decoded.id).session(session);
        if (!student) {
          throw new Error("Student not found");
        }
        console.log("Student found:", {
          id: student._id,
          program: student.program,
          semester: student.semester,
          section: student.section,
        });

        const teacher = await User.findOne(
          {
            "classAssignments.classCredentials.username": sanitizedUsername,
          },
          null,
          { session }
        );
        if (!teacher) {
          throw new Error("Invalid class credentials: Username not found");
        }
        console.log("Teacher found:", {
          teacherId: teacher._id,
          classAssignmentsCount: teacher.classAssignments.length,
        });

        const assignment = teacher.classAssignments.find(
          (assignment) => assignment.classCredentials.username.toLowerCase() === sanitizedUsername
        );
        if (!assignment) {
          throw new Error("Invalid class credentials: Assignment not found");
        }
        console.log("Assignment found:", {
          classId: assignment.classId,
          subject: assignment.subject,
          username: assignment.classCredentials.username,
          isHashed: assignment.classCredentials.password.startsWith("$2a$") || assignment.classCredentials.password.startsWith("$2b$"),
        });

        const isPasswordValid = await bcrypt.compare(password, assignment.classCredentials.password);
        if (!isPasswordValid) {
          console.log("Password verification failed for username:", sanitizedUsername);
          throw new Error("Invalid class credentials: Incorrect password");
        }
        console.log("Password verified for username:", sanitizedUsername);

        // Normalize semester format (e.g., "1st" -> "1")
        const normalizedSemester = student.semester.replace(/st|nd|rd|th/, "");

        // Include subject in the ClassSection query
        const classSection = await ClassSection.findOne(
          {
            classId: assignment.classId,
            program: student.program,
            semester: normalizedSemester,
            section: student.section,
            subject: assignment.subject, // Match the specific subject
          },
          null,
          { session }
        );
        if (!classSection) {
          console.log("ClassSection not found for:", {
            classId: assignment.classId,
            program: student.program,
            semester: normalizedSemester,
            section: student.section,
            subject: assignment.subject,
          });
          throw new Error(
            `No matching class section found for program: ${student.program}, semester: ${student.semester}, section: ${student.section}, subject: ${assignment.subject}`
          );
        }
        console.log("ClassSection found:", {
          classSectionId: classSection._id,
          subject: classSection.subject,
        });

        // Check for duplicate enrollment in this specific ClassSection (by classSectionId)
        const isAlreadyEnrolled = student.enrollments.some(
          (enrollment) => enrollment.classSectionId.toString() === classSection._id.toString()
        );
        if (isAlreadyEnrolled) {
          throw new Error(`You are already enrolled in ${classSection.subject} for section ${classSection.section}`);
        }

        const enrollmentData = {
          classSectionId: classSection._id,
          classId: classSection.classId,
          subject: classSection.subject,
          program: classSection.program,
          semester: classSection.semester,
          section: classSection.section,
          enrolledAt: new Date(),
        };

        await Student.updateOne(
          { _id: student._id },
          {
            $push: { enrollments: enrollmentData },
            $inc: { enrollmentCount: 1 },
          },
          { session }
        );

        await ClassSection.updateOne(
          { _id: classSection._id },
          {
            $push: { students: student._id },
            $inc: { enrolledStudents: 1 },
          },
          { session }
        );

        result = {
          message: `Successfully enrolled in ${classSection.subject} (${classSection.program} - ${classSection.section})`,
          enrollment: {
            classSectionId: classSection._id,
            classId: classSection.classId,
            subject: classSection.subject,
            program: classSection.program,
            semester: classSection.semester,
            section: classSection.section,
            enrolledAt: enrollmentData.enrolledAt,
          },
        };
      });

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Student enroll error:", {
      message: error.message,
      stack: error.stack,
      username: sanitizedUsername,
    });
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
      },
      {
        status:
          error.message.includes("not found") ||
          error.message.includes("already enrolled") ||
          error.message.includes("Invalid class credentials")
            ? 400
            : 500,
      }
    );
  }
}





