import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import RegistrationRequest from "@/models/RegistrationRequest"
import { sendEmail } from "@/lib/email"

export async function POST(request) {
    try {
        const { requestId } = await request.json()

        await connectDB()

        const registrationRequest = await RegistrationRequest.findById(requestId)
        if (!registrationRequest) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 })
        }

        // Update request status
        registrationRequest.status = "rejected"
        await registrationRequest.save()

        // Send rejection email
        await sendEmail({
            to: registrationRequest.email,
            subject: "Registration Request Update - Lumos Milestone care",
            html: `
        <h2>Registration Request Update</h2>
        <p>We regret to inform you that your registration request has been cancelled by the admin.</p>
        <p>If you believe this is an error, please contact our support team.</p>
        <p>Thank you for your interest in our platform.</p>
      `,
        })

        return NextResponse.json({ message: "Request rejected successfully" }, { status: 200 })
    } catch (error) {
        console.error("Rejection error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
