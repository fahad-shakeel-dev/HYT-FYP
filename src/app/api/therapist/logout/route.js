import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    );

    // Clear the auth_token cookie
    response.cookies.set("t_auth_token", "", {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        path: "/",
        sameSite: "strict",
    });

    return response;
}
