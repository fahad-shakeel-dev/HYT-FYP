
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret";
const COOKIE_NAME = "p_auth_token";

export async function PUT(request) {
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

        const { name, email, phone, program, semester, section, registrationNumber } = await request.json();

        // Validate required fields
        if (!name || !email || !registrationNumber) {
            return NextResponse.json(
                { message: "Name, Email and Registry ID are required" },
                { status: 400 }
            );
        }

        // Find and update student
        const student = await Student.findByIdAndUpdate(
            decoded.id,
            {
                name,
                email, // Note: Changing email might require re-verification or check for duplicates, staying simple for now as requested
                phone,
                program,
                semester,
                section,
                registrationNumber
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!student) {
            return NextResponse.json(
                { message: "Student not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                student: {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    registrationNumber: student.registrationNumber,
                    program: student.program,
                    semester: student.semester,
                    section: student.section,
                    phone: student.phone
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Profile update error:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "Email or Registry ID already in use" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}
