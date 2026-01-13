import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import RegistrationRequest from "@/models/RegistrationRequest";

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        await connectDB();

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
        }

        // Find user with valid reset token
        const user = await RegistrationRequest.findOne({
            email: decoded.email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
