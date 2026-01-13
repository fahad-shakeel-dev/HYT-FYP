
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import RegistrationRequest from "@/models/RegistrationRequest"
import User from "@/models/User"
import nodemailer from "nodemailer"

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function POST(request) {
    try {
        await connectDB()

        const { requestId } = await request.json()

        if (!requestId) {
            return NextResponse.json({ message: "Request ID is required" }, { status: 400 })
        }

        // Find the registration request
        const registrationRequest = await RegistrationRequest.findById(requestId)
        if (!registrationRequest) {
            return NextResponse.json({ message: "Registration request not found" }, { status: 404 })
        }

        // Check if already processed
        if (registrationRequest.status !== "pending") {
            return NextResponse.json({ message: "Request has already been processed" }, { status: 400 })
        }

        // Check if user already exists
        let newUser = await User.findOne({ email: registrationRequest.email })

        if (newUser) {
            // Update existing user
            newUser.role = "therapist"
            newUser.isApproved = true
            // Update other fields to match the request if necessary
            newUser.name = registrationRequest.name
            newUser.phone = registrationRequest.phone
            newUser.image = registrationRequest.image
            // Only update password if needed, or assume the request has the correct one? 
            // For safety in this context (approval), let's ensure the requested password is valid if checking/hashing isn't complex, 
            // but here we are storing plain/hashed strings directly. Let's update it to ensure login works with what they just submitted.
            newUser.password = registrationRequest.password

            await newUser.save()
            console.log("Updated existing user:", newUser.email)
        } else {
            // Create new user from registration request
            newUser = new User({
                name: registrationRequest.name,
                email: registrationRequest.email,
                phone: registrationRequest.phone,
                password: registrationRequest.password,
                image: registrationRequest.image,
                role: "therapist",
                isApproved: true,
            })
            await newUser.save()
        }

        // Update registration request status
        registrationRequest.status = "approved"
        await registrationRequest.save()

        // Send approval email
        let emailSent = false
        try {
            const emailContent = `
        <h2>Registration Approved!</h2>
        <p>Dear ${registrationRequest.name},</p>
        <p>Your teacher registration has been approved. You can now login to the system.</p>
        <p>Login Details:</p>
        <ul>
          <li><strong>Email:</strong> ${registrationRequest.email}</li>
          <li><strong>Password:</strong> Use the password you provided during registration</li>
        </ul>
        <p>Welcome to our teaching platform!</p>
        <p>Best regards,<br>Admin Team</p>
      `

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: registrationRequest.email,
                subject: "Teacher Registration Approved",
                html: emailContent,
            })

            emailSent = true
        } catch (emailError) {
            console.error("Email sending failed:", emailError)
        }

        return NextResponse.json(
            {
                message: "Teacher request approved successfully",
                emailSent,
                teacher: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Error approving teacher request:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
