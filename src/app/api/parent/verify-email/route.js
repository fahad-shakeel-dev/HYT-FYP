
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import UnverifiedStudent from "@/models/UnverifiedStudent";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";

console.log("Loading /api/parent/verify-email route");

export async function GET(request) {
  try {
    console.log("Processing GET /api/parent/verify-email");
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Invalid or missing token" }, { status: 400 });
    }

    await connectDB();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
      console.log("Decoded token:", decoded);
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const { email } = decoded;
    const unverifiedStudent = await UnverifiedStudent.findOne({ email });
    console.log("UnverifiedStudent found:", unverifiedStudent);

    if (!unverifiedStudent) {
      return NextResponse.json({ message: "Student request not found" }, { status: 404 });
    }

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ;

    if (unverifiedStudent.isVerified) {
      return NextResponse.redirect(new URL("/student?message=Email%20already%20verified", baseURL));
    }

    if (unverifiedStudent.verificationToken !== token) {
      return NextResponse.json({ message: "Invalid verification link" }, { status: 400 });
    }

    // Find or create ClassSection
    let classSection = await ClassSection.findOne({
      program: unverifiedStudent.program,
      semester: unverifiedStudent.semester,
      section: unverifiedStudent.section,
    });
    if (!classSection) {
      const classId = `${unverifiedStudent.program}_${unverifiedStudent.semester}_${unverifiedStudent.section}_${Date.now()}`;
      const room = `Room-${Math.random() * 100 + 1}`;
      classSection = new ClassSection({
        program: unverifiedStudent.program,
        semester: unverifiedStudent.semester,
        section: unverifiedStudent.section,
        classId,
        room,
        enrolledStudents: 0,
        students: [],
      });
      await classSection.save();
    }

    // Create new Student
    const newStudent = new Student({
      name: unverifiedStudent.name,
      email: unverifiedStudent.email,
      phone: unverifiedStudent.phone,
      password: unverifiedStudent.password,
      program: unverifiedStudent.program,
      semester: unverifiedStudent.semester,
      section: unverifiedStudent.section,
      registrationNumber: unverifiedStudent.registrationNumber,
      classId: classSection.classId,
      room: classSection.room,
      image: unverifiedStudent.image,
      role: "student",
      isApproved: true,
      isVerified: true,
      verificationToken: null,
    });

    await newStudent.save();

    // Update ClassSection
    classSection.students.push(newStudent._id);
    classSection.enrolledStudents = classSection.students.length;
    await classSection.save();

    // Delete UnverifiedStudent
    await UnverifiedStudent.deleteOne({ _id: unverifiedStudent._id });
    console.log("UnverifiedStudent deleted, Student created:", newStudent);

    return NextResponse.redirect(new URL("/student?message=Email%20verified%20successfully", baseURL));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
