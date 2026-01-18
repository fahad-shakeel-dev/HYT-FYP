import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import UnverifiedStudent from "@/models/UnverifiedStudent";
import Student from "@/models/Student";

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

        // Find user with valid reset token in UnverifiedStudent
        const unverifiedStudent = await UnverifiedStudent.findOne({
            email: decoded.email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!unverifiedStudent) {
            return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password in UnverifiedStudent and clear reset token
        unverifiedStudent.password = hashedPassword;
        unverifiedStudent.resetPasswordToken = undefined;
        unverifiedStudent.resetPasswordExpires = undefined;
        await unverifiedStudent.save();

        // Also update in Student model if they have been verified
        const student = await Student.findOne({ email: decoded.email });
        if (student) {
            student.password = hashedPassword;
            await student.save();
        }

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
