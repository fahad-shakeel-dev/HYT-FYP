import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import RegistrationRequest from "@/models/RegistrationRequest";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request) {
    try {
        // Auto-cleanup: Delete unverified requests older than 1 day
        await connectDB();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await RegistrationRequest.deleteMany({
            isVerified: false,
            createdAt: { $lt: oneDayAgo },
        });

        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ message: "Invalid or missing token" }, { status: 400 });
        }

        await connectDB();

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        const { email } = decoded;
        const user = await RegistrationRequest.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

        if (user.isVerified) {
            return NextResponse.redirect(new URL("/therapist?message=Email already verified", baseURL));
        }

        if (user.verificationToken !== token) {
            return NextResponse.json({ message: "Invalid verification link" }, { status: 400 });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        // Create User account for verified registration
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const userPayload = {
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                password: user?.password,
                image: user?.image || null,
                role: user?.role || "therapist",
                isApproved: false, // Pending admin approval
                isVerified: true, // Email verified
                registrationRequestId: user?._id,
            };
            
            // Add subject only if it exists in registration
            if (user?.subject) {
                userPayload.subject = user.subject;
            }
            
            try {
                const newUser = new User(userPayload);
                await newUser.save();
            } catch (userCreationError) {
                console.error("User creation error:", userCreationError);
                // Log but don't fail - email is already verified
                // User can login after admin approves
            }
        }

        // return NextResponse.redirect(new URL("/therapist?message=Email verified successfully", baseURL));
        return NextResponse.redirect(new URL("/therapist", baseURL));

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
