import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import RegistrationRequest from "@/models/RegistrationRequest";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        await connectDB();

        // Find user by email in User collection
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid clinical credentials" }, { status: 401 });
        }

        // Find registration request to check verification status
        const regRequest = await RegistrationRequest.findOne({ email });
        if (!regRequest) {
            return NextResponse.json({ message: "Clinical identity not found in registry" }, { status: 404 });
        }

        // Check if email is verified
        if (!regRequest.isVerified) {
            return NextResponse.json({ message: "Professional email verification required" }, { status: 403 });
        }

        // Compare provided password with stored hashed password from User
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid clinical credentials" }, { status: 401 });
        }

        // Check if registration is approved in User
        if (!user.isApproved) {
            return NextResponse.json({ message: "Institutional authorization pending" }, { status: 403 });
        }

        // Generate clinical-grade JWT
        const tokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role || "therapist",
        };
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || "fallback-clinical-secret",
            { expiresIn: "4h" }
        );

        // Create session-authorized response
        const response = NextResponse.json({
            message: "Clinical session authorized",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            },
        }, { status: 200 });

        // Secure auth cookie configuration
        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 4, // 4 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Clinical Session Error:", error);
        return NextResponse.json(
            { message: "Internal institutional failure" },
            { status: 500 }
        );
    }
}
