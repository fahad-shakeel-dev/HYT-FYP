import { NextResponse } from "next/server"

export async function POST(request) {
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

    // Clear JWT cookie
    response.cookies.set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
    })

    return response
}
