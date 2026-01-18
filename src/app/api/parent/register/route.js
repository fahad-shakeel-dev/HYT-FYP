// meamea
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UnverifiedStudent from "@/models/UnverifiedStudent";
import Student from "@/models/Student";
import ClassSection from "@/models/ClassSection";
import Class from "@/models/ClassSchema";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("Request Body:", body); // Log to debug incoming data
    const { name, email, phone, registrationNumber, program, semester = "1", section = "A", image, password } = body;

    // Validate input
    if (!name || !email || !phone || !registrationNumber || !program || !password) {
      return NextResponse.json(
        {
          message: `All fields are required. Missing: ${[
            !name && "name",
            !email && "email",
            !phone && "phone",
            !registrationNumber && "registrationNumber",
            !program && "program",
            !password && "password",
          ].filter(Boolean).join(", ")
            }`,
        },
        { status: 400 }
      );
    }

    // Additional validation for program to ensure it's not an empty string
    if (program.trim() === "") {
      return NextResponse.json(
        { message: "Program field cannot be empty" },
        { status: 400 }
      );
    }

    // Server-side password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Debug environment variables
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

    // Check if unverified student already exists
    const existingRequest = await UnverifiedStudent.findOne({ email });
    if (existingRequest) {
      return NextResponse.json(
        { message: "Registration request with this email already exists" },
        { status: 400 }
      );
    }

    // Check if registration number already exists in UnverifiedStudent
    const existingUnverifiedRegNumber = await UnverifiedStudent.findOne({ registrationNumber });
    if (existingUnverifiedRegNumber) {
      return NextResponse.json(
        { message: "This registration number is already in use" },
        { status: 400 }
      );
    }

    // Check if registration number already exists in verified Student
    const existingVerifiedStudent = await Student.findOne({ registrationNumber });
    if (existingVerifiedStudent) {
      return NextResponse.json(
        { message: "This registration number is already in use" },
        { status: 400 }
      );
    }

    // Find or create ClassSection (Mapping academic terms to clinical schema)
    // program -> category
    // section -> schedule
    // semester -> (unused/deprecated in ClassSection)
    let classSection = await ClassSection.findOne({ category: program, schedule: section });
    if (!classSection) {
      // First, find or create the Class document
      let classDoc = await Class.findOne({ category: program });
      if (!classDoc) {
        classDoc = new Class({
          category: program,
          className: `${program} - Therapy Group ${Date.now()}`,
          schedules: [section],
          activities: [program],
        });
        await classDoc.save();
      }

      const room = `Room-${Math.floor(Math.random() * 100) + 1}`;

      classSection = new ClassSection({
        category: program,
        schedule: section,
        classId: classDoc._id, // Reference the created Class ObjectId
        room,
        enrolledStudents: 0,
        students: [],
      });
      await classSection.save();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate JWT verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    // Create new unverified student
    const newUnverifiedStudent = new UnverifiedStudent({
      name,
      email,
      phone,
      password: hashedPassword,
      program,
      semester,
      section,
      registrationNumber,
      image,
      isVerified: false,
      verificationToken,
    });

    await newUnverifiedStudent.save();

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw new Error("Failed to verify SMTP connection");
    }

    // Send verification email
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const verificationUrl = `${baseURL}/verify-email?token=${verificationToken}&role=parent`;
    const mailOptions = {
      from: `"Lumos Milestone Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Lumos Milestone Care",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🎓 Lumos Milestone care</h1>
            </div>
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              Thank you for joining the Lumos Milestone Care network. To complete your clinical onboarding, 
              please verify your email address by selecting the authorization link below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 15px 30px; background-color: #2563eb; 
                        color: white; text-decoration: none; border-radius: 8px; font-weight: bold;
                        box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);">
                ✅ AUTHORIZE IDENTITY
              </a>
            </div>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⏰ <strong>Important:</strong> This verification link will expire in 24 hours.
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you did not request this registration, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <div style="text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 Lumos Milestone Care • Patient Care Network
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent to:", email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      throw new Error("Failed to send verification email");
    }

    return NextResponse.json(
      {
        message: "Registration request submitted successfully. Please check your email to verify your account.",
        studentRequest: {
          id: newUnverifiedStudent._id,
          name: newUnverifiedStudent.name,
          email: newUnverifiedStudent.email,
          program: newUnverifiedStudent.program,
          semester: newUnverifiedStudent.semester,
          section: newUnverifiedStudent.section,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
