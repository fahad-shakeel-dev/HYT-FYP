import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SharedResource from "@/models/SharedResource";
import Student from "@/models/Student"; // Ensure model is registered
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-jwt-secret";
const COOKIE_NAME = "t_auth_token";

// Helper to get current user
const getCurrentUser = (request) => {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

export async function GET(request) {
    try {
        await connectDB();
        const user = getCurrentUser(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Fetch resources sent by this therapist
        const resources = await SharedResource.find({ senderId: user.id })
            .sort({ createdAt: -1 })
            .populate("recipientId", "name email");

        return NextResponse.json({ success: true, data: resources });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const user = getCurrentUser(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { recipientId, groupId, type, title, description, url, isPrivate } = body;

        const newResource = await SharedResource.create({
            senderId: user.id,
            recipientId: recipientId || null,
            groupId: groupId || null,
            type,
            title,
            description,
            url,
            isPrivate: isPrivate !== undefined ? isPrivate : true,
        });

        return NextResponse.json({ success: true, data: newResource }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
