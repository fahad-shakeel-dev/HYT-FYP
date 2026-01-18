import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import RegistrationRequest from "@/models/RegistrationRequest";
import connectDB from "@/lib/mongodb";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { name, email, phone, password, image, subject } = await request.json();

    // Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: "All required clinical identifiers must be provided" }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists in RegistrationRequest
    const existingRequest = await RegistrationRequest.findOne({ email });
    
    // If existing request found, check if it's verified or expired
    if (existingRequest) {
      // If verified, don't allow re-registration
      if (existingRequest.isVerified) {
        return NextResponse.json(
          { message: "Email already verified. Please login or contact support." },
          { status: 400 }
        );
      }
      
      // If unverified, check if it's older than 1 day
      const createdDate = new Date(existingRequest.createdAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      if (createdDate > oneDayAgo) {
        // Less than 1 day old, still within verification window
        return NextResponse.json(
          { message: "Registration already exists. Please check your email for verification link. You can register again after 24 hours if not verified." },
          { status: 400 }
        );
      } else {
        // Older than 1 day, delete it and allow new registration
        await RegistrationRequest.deleteOne({ _id: existingRequest._id });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate JWT verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || "fallback-clinical-secret",
      { expiresIn: "1d" }
    );

    // Create registration request with clinical terminology
    const registrationRequest = new RegistrationRequest({
      name,
      email,
      phone,
      password: hashedPassword,
      image,
      subject, // Storing specialization
      status: "pending",
      isVerified: false,
      verificationToken,
      createdAt: new Date(),
    });

    await registrationRequest.save();

    // Verification email content
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verificationUrl = `${baseURL}/verify-email?token=${verificationToken}`;

    // Attempt SMTP verification and email dispatch
    try {
      await transporter.verify();
      const mailOptions = {
        from: `"Institutional Governance" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verification Required - Clinical Professional Network",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Outfit', sans-serif; background-color: #fcfcfd; padding: 40px; border-radius: 20px; border: 1px solid #f1f5f9;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.05em;">LUMOS MILESTONE CARE</h1>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">Professional Caregiver Network</p>
            </div>
            
            <h2 style="color: #1e293b; margin-bottom: 20px; font-weight: 800;">Welcome, ${name}</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 25px; font-size: 14px;">
              Your clinical registration request has been received. To proceed with credentialing and activate your node access, 
              please verify your professional email identity by selecting the authorization link below:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 18px 36px; background-color: #0ea5e9; 
                        color: white; text-decoration: none; border-radius: 12px; font-weight: 900;
                        text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px;
                        box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);">
                ✅ AUTHORIZE IDENTITY
              </a>
            </div>
            
            <div style="background-color: #fefce8; padding: 20px; border-radius: 16px; border: 1px solid #fef08a; margin: 20px 0;">
              <p style="color: #854d0e; margin: 0; font-size: 12px; font-weight: 700;">
                ⏰ SECURITY ALERT: This authorization link is valid for 24 hours only. Undocumented requests will be purged from the registry.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #94a3b8; font-size: 10px; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">
                © 2025 Lumos Milestone Care • Institutional Governance Registry
              </p>
            </div>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.warn("SMTP failure, but registry record saved:", emailError.message);
      // We still return 201 because the record is in the DB, but maybe the user won't get the email.
      // In a production app, we might want to handle this more gracefully.
    }

    return NextResponse.json(
      {
        message: "Institutional registry updated. Please check your professional email to verify your identity.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Clinical Registry Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal registry failure" },
      { status: 500 }
    );
  }
}
