
import { NextResponse } from "next/server";

export function middleware(request) {
    const parentToken = request.cookies.get("p_auth_token");
    const therapistToken = request.cookies.get("t_auth_token");
    const { pathname } = request.nextUrl;

    // Protect Parent Dashboard
    if (pathname.startsWith("/parent/dashboard")) {
        if (!parentToken) {
            return NextResponse.redirect(new URL("/parent", request.url));
        }
    }

    // Protect Therapist Dashboard
    if (pathname.startsWith("/therapist/dashboard")) {
        if (!therapistToken) {
            return NextResponse.redirect(new URL("/parent", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/parent/dashboard/:path*", "/therapist/dashboard/:path*"],
};
