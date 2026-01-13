import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import RegistrationRequest from "@/models/RegistrationRequest";

export async function GET(request) {
    try {
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
            return NextResponse.redirect(new URL("/teacher?message=Email already verified", baseURL));
        }

        if (user.verificationToken !== token) {
            return NextResponse.json({ message: "Invalid verification link" }, { status: 400 });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        // return NextResponse.redirect(new URL("/teacher?message=Email verified successfully", baseURL));
        return NextResponse.redirect(new URL("/teacher", baseURL));

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
