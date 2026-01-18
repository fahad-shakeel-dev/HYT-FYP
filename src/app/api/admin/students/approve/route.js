// import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/mongodb"
// import StudentRequest from "@/models/StudentRequest"
// import Student from "@/models/Student"
// import ClassSection from "@/models/ClassSection"
// import nodemailer from "nodemailer"

// // SMS function using a simple SMS API (you can use any SMS service)
// async function sendSMS(phone, message) {
//     try {
//         // For demo purposes, we'll just log the SMS
//         // In production, you would integrate with SMS services like Twilio, etc.
//         console.log(`📱 SMS to ${phone}: ${message}`)

//         // Simulate SMS sending
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log("✅ SMS sent successfully (simulated)")
//                 resolve(true)
//             }, 1000)
//         })
//     } catch (error) {
//         console.error("❌ Error sending SMS:", error)
//         return false
//     }
// }

// // Email function
// async function sendApprovalEmail(studentData, classData) {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: "ucpedua@gmail.com",
//                 pass: "ywxk djgl cgch ivmq",
//             },
//         })

//         const mailOptions = {
//             from: "ucpedua@gmail.com",
//             to: studentData.email,
//             subject: "🎉 Student Registration Approved - Lumos Milestone care",
//             html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
//           <div style="background: white; padding: 30px; border-radius: 10px;">
//             <div style="text-align: center; margin-bottom: 30px;">
//               <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
//               <p style="color: #6B7280; font-size: 16px; margin: 10px 0;">Your student registration has been approved!</p>
//             </div>
            
//             <div style="background: #F8FAFC; padding: 25px; border-radius: 10px; margin: 20px 0;">
//               <h3 style="color: #1F2937; margin-top: 0;">📋 Your Account Details:</h3>
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Name:</strong></td><td style="color: #1F2937;">${studentData.name}</td></tr>
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Email:</strong></td><td style="color: #1F2937;">${studentData.email}</td></tr>
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Registration Number:</strong></td><td style="color: #7C3AED; font-weight: bold;">${studentData.registrationNumber}</td></tr>
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Semester:</strong></td><td style="color: #1F2937;">${studentData.semester}</td></tr>
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Section:</strong></td><td style="color: #1F2937;">${studentData.section}</td></tr>
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Class ID:</strong></td><td style="color: #1F2937;">${classData.classId}</td></tr>
//                 <tr><td style="padding: 8px 0; color: #4B5563;"><strong>Room Number:</strong></td><td style="color: #1F2937;">${classData.room}</td></tr>
//               </table>
//             </div>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <p style="color: #059669; font-size: 18px; font-weight: bold;">✅ You can now login to the Lumos Milestone care!</p>
//               <p style="color: #6B7280;">Welcome to our academic community. We're excited to have you on board!</p>
//             </div>
            
//             <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
//               <p style="margin: 0; color: #1E40AF;"><strong>Next Steps:</strong></p>
//               <ul style="color: #1F2937; margin: 10px 0;">
//                 <li>Login to your student portal</li>
//                 <li>Complete your profile setup</li>
//                 <li>Check your class schedule</li>
//                 <li>Connect with your classmates</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       `,
//         }

//         await transporter.sendMail(mailOptions)
//         console.log("✅ Approval email sent successfully")
//         return true
//     } catch (error) {
//         console.error("❌ Error sending approval email:", error)
//         return false
//     }
// }

// export async function POST(request) {
//     try {
//         console.log("🔄 Starting student approval process...")

//         const { requestId } = await request.json()
//         console.log("📝 Request ID received:", requestId)

//         if (!requestId) {
//             console.log("❌ No request ID provided")
//             return NextResponse.json({ message: "Request ID is required" }, { status: 400 })
//         }

//         await connectDB()
//         console.log("✅ Database connected")

//         const studentRequest = await StudentRequest.findById(requestId)
//         if (!studentRequest) {
//             console.log("❌ Student request not found for ID:", requestId)
//             return NextResponse.json({ message: "Request not found" }, { status: 404 })
//         }

//         console.log("👤 Student request found:", studentRequest.name)

//         // Check if class section exists, if not create it
//         let classSection = await ClassSection.findOne({
//             semester: studentRequest.semester,
//             section: studentRequest.section,
//         })

//         if (!classSection) {
//             console.log("🏫 Creating new class section...")
//             // Generate class ID and room number
//             const classId = `${studentRequest.semester.toUpperCase()}-${studentRequest.section}`
//             const roomNumber = Math.floor(Math.random() * 200) + 100

//             classSection = new ClassSection({
//                 semester: studentRequest.semester,
//                 section: studentRequest.section,
//                 classId,
//                 room: roomNumber,
//                 enrolledStudents: 0,
//                 students: [],
//             })
//             await classSection.save()
//             console.log("✅ New class section created:", classId)
//         } else {
//             console.log("🏫 Using existing class section:", classSection.classId)
//         }

//         // Create student account
//         console.log("👤 Creating student account...")
//         const student = new Student({
//             name: studentRequest.name,
//             email: studentRequest.email,
//             phone: studentRequest.phone,
//             password: studentRequest.password,
//             image: studentRequest.image,
//             semester: studentRequest.semester,
//             section: studentRequest.section,
//             registrationNumber: studentRequest.registrationNumber,
//             classId: classSection.classId,
//             room: classSection.room,
//             role: "student",
//             isApproved: true,
//         })

//         await student.save()
//         console.log("✅ Student account created")

//         // Add student to class section
//         classSection.students.push(student._id)
//         classSection.enrolledStudents = classSection.students.length
//         await classSection.save()
//         console.log("🏫 Student added to class section. Total students:", classSection.enrolledStudents)

//         // Update request status
//         studentRequest.status = "approved"
//         await studentRequest.save()
//         console.log("✅ Request status updated to approved")

//         // Try to send email first, if fails then send SMS
//         console.log("📧 Attempting to send approval email...")
//         let emailSent = false
//         let smsSent = false

//         try {
//             emailSent = await sendApprovalEmail(studentRequest, classSection)
//         } catch (emailError) {
//             console.log("⚠️ Email failed, trying SMS...")
//         }

//         // If email fails, send SMS
//         if (!emailSent) {
//             console.log("📱 Sending SMS notification...")
//             const smsMessage = `🎉 Congratulations ${studentRequest.name}! Your Lumos Milestone care registration has been APPROVED. Class: ${classSection.classId}, Room: ${classSection.room}. You can now login to the portal.`
//             smsSent = await sendSMS(studentRequest.phone, smsMessage)
//         }

//         const notificationStatus = emailSent
//             ? "Email sent successfully"
//             : smsSent
//                 ? "SMS sent successfully"
//                 : "Notification failed"
//         console.log("📬 Notification status:", notificationStatus)

//         return NextResponse.json(
//             {
//                 message: "Student request approved successfully",
//                 emailSent: emailSent,
//                 smsSent: smsSent,
//                 notificationStatus: notificationStatus,
//                 classDetails: {
//                     classId: classSection.classId,
//                     room: classSection.room,
//                     enrolledStudents: classSection.enrolledStudents,
//                 },
//             },
//             { status: 200 },
//         )
//     } catch (error) {
//         console.error("❌ Student approval error:", error)
//         return NextResponse.json(
//             {
//                 message: "Internal server error",
//                 error: error.message,
//             },
//             { status: 500 },
//         )
//     }
// }
