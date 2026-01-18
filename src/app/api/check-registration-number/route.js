import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UnverifiedStudent from "@/models/UnverifiedStudent";
import Student from "@/models/Student";

export async function POST(request) {
  try {
    await connectDB();

    const { registrationNumber } = await request.json();

    if (!registrationNumber || registrationNumber.trim() === "") {
      return NextResponse.json(
        { message: "Registration number is required" },
        { status: 400 }
      );
    }

    // Check in unverified registrations
    const unverifiedStudent = await UnverifiedStudent.findOne({ 
      registrationNumber: registrationNumber.trim() 
    });

    if (unverifiedStudent) {
      return NextResponse.json(
        { available: false, message: "This registration number is already in use" },
        { status: 200 }
      );
    }

    // Check in verified students
    const verifiedStudent = await Student.findOne({ 
      registrationNumber: registrationNumber.trim() 
    });

    if (verifiedStudent) {
      return NextResponse.json(
        { available: false, message: "This registration number is already in use" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: "Registration number is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check registration number error:", error);
    return NextResponse.json(
      { message: "Failed to check registration number" },
      { status: 500 }
    );
  }
}
