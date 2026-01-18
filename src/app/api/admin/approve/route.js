import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RegistrationRequest from "@/models/RegistrationRequest";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { requestId } = await request.json();

    await connectDB();

    const registrationRequest = await RegistrationRequest.findById(requestId);
    if (!registrationRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    const user = new User({
      name: registrationRequest.name,
      email: registrationRequest.email,
      phone: registrationRequest.phone,
      password: registrationRequest.password,
      image: registrationRequest.image,
      role: registrationRequest.role || "therapist", // Use role from request, default to therapist
      isApproved: true,
    });

    await user.save();

    registrationRequest.status = "approved";
    await registrationRequest.save();

    await sendEmail({
      to: registrationRequest.email,
      subject: "Registration Approved - Lumos Milestone care",
      html: `
        <h2>Congratulations!</h2>
        <p>Your registration request has been approved by the admin.</p>
        <p>You can now login to the Lumos Milestone care with your credentials.</p>
        <p>Welcome to our platform!</p>
      `,
    });

    return NextResponse.json({ message: "Request approved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
