import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import RegistrationRequest from "@/models/RegistrationRequest";

export async function POST(request) {
    try {
        const { email } = await request.json();

        await connectDB();

        // Check if user exists
        const user = await RegistrationRequest.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "No account found with this email" }, { status: 404 });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Update user with reset token and expiry
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const resetUrl = `${baseURL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request - UCP Portal",
            html: `
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password for UCP Portal.</p>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Send reset email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ 
            message: "Password reset link sent to your email" 
        }, { status: 200 });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
