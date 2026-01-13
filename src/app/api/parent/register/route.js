// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import { connectDB } from "@/lib/mongodb"
// import StudentRequest from "@/models/StudentRequest"

// export async function POST(request) {
//     try {
//         const { name, email, phone, registrationNumber, password, semester, section, image } = await request.json()

//         await connectDB()

//         // Check if student already exists
//         const existingRequest = await StudentRequest.findOne({
//             $or: [{ email }, { registrationNumber }],
//         })

//         if (existingRequest) {
//             return NextResponse.json(
//                 { message: "Student with this email or registration number already exists" },
//                 { status: 400 },
//             )
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 12)

//         // Create student request
//         const studentRequest = new StudentRequest({
//             name,
//             email,
//             phone,
//             password: hashedPassword,
//             semester,
//             section,
//             registrationNumber,
//             image,
//             status: "pending",
//             createdAt: new Date(),
//         })

//         await studentRequest.save()

//         return NextResponse.json(
//             {
//                 message: "Student registration request submitted successfully",
//                 registrationNumber,
//             },
//             { status: 201 },
//         )
//     } catch (error) {
//         console.error("Student registration error:", error)
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//     }
// }





// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Student from "@/models/Student";
// import ClassSection from "@/models/ClassSection";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//     try {
//         await connectDB();

//         const { name, email, phone, registrationNumber, semester, section, image } =
//             await request.json();

//         if (
//             !name ||
//             !email ||
//             !phone ||
//             !registrationNumber ||
//             !semester ||
//             !section
//         ) {
//             return NextResponse.json(
//                 { message: "All fields are required" },
//                 { status: 400 }
//             );
//         }

//         const existingStudent = await Student.findOne({ email });
//         if (existingStudent) {
//             return NextResponse.json(
//                 { message: "Student with this email already exists" },
//                 { status: 400 }
//             );
//         }

//         const existingRegNumber = await Student.findOne({ registrationNumber });
//         if (existingRegNumber) {
//             return NextResponse.json(
//                 { message: "Registration number already exists" },
//                 { status: 400 }
//             );
//         }

//         let classSection = await ClassSection.findOne({ semester, section });

//         if (!classSection) {
//             const classId = `${semester}_${section}_${Date.now()}`;
//             const room = Math.floor(Math.random() * 100) + 1;

//             classSection = new ClassSection({
//                 semester,
//                 section,
//                 classId,
//                 room,
//                 enrolledStudents: 0,
//                 students: [],
//             });
//             await classSection.save();
//         }

//         const defaultPassword = `${registrationNumber.slice(-4)}@${semester}`;
//         const hashedPassword = await bcrypt.hash(defaultPassword, 12);

//         const newStudent = new Student({
//             name,
//             email,
//             phone,
//             password: hashedPassword,
//             semester,
//             section,
//             registrationNumber,
//             classId: classSection.classId,
//             room: classSection.room,
//             image,
//             role: "student",
//             isApproved: true,
//         });

//         await newStudent.save();

//         classSection.students.push(newStudent._id);
//         classSection.enrolledStudents = classSection.students.length;
//         await classSection.save();

//         return NextResponse.json(
//             {
//                 message:
//                     "Student registered successfully and added to class section",
//                 student: {
//                     id: newStudent._id,
//                     name: newStudent.name,
//                     email: newStudent.email,
//                     semester: newStudent.semester,
//                     section: newStudent.section,
//                     classId: newStudent.classId,
//                 },
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Student registration error:", error);
//         return NextResponse.json(
//             { message: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }



// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Student from "@/models/Student";
// import ClassSection from "@/models/ClassSection";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { name, email, phone, registrationNumber, semester, section, image, password } =
//       await request.json();

//     // Validate input
//     if (!name || !email || !phone || !registrationNumber || !semester || !section || !password) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Server-side password validation
//     if (password.length < 8) {
//       return NextResponse.json(
//         { message: "Password must be at least 8 characters long" },
//         { status: 400 }
//       );
//     }

//     // Debug environment variables
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);
//     console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

//     // Check if student already exists
//     const existingStudent = await Student.findOne({ email });
//     if (existingStudent) {
//       return NextResponse.json(
//         { message: "Student with this email already exists" },
//         { status: 400 }
//       );
//     }

//     const existingRegNumber = await Student.findOne({ registrationNumber });
//     if (existingRegNumber) {
//       return NextResponse.json(
//         { message: "Registration number already exists" },
//         { status: 400 }
//       );
//     }

//     // Find or create ClassSection
//     let classSection = await ClassSection.findOne({ semester, section });
//     if (!classSection) {
//       const classId = `${semester}_${section}_${Date.now()}`;
//       const room = `Room-${Math.floor(Math.random() * 100) + 1}`; // Ensure string format

//       classSection = new ClassSection({
//         semester,
//         section,
//         classId,
//         room,
//         enrolledStudents: 0,
//         students: [],
//         program: "BSCS", // Consistent with admin section
//       });
//       await classSection.save();
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate JWT verification token
//     const verificationToken = jwt.sign(
//       { email },
//       process.env.JWT_SECRET || "fallback-secret",
//       { expiresIn: "1d" }
//     );

//     // Create new student
//     const newStudent = new Student({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       semester,
//       section,
//       registrationNumber,
//       classId: classSection.classId,
//       room: classSection.room,
//       image,
//       role: "student",
//       isApproved: true,
//       isVerified: false,
//       verificationToken,
//     });

//     await newStudent.save();

//     // Update ClassSection
//     classSection.students.push(newStudent._id);
//     classSection.enrolledStudents = classSection.students.length;
//     await classSection.save();

//     // Verify transporter configuration
//     try {
//       await transporter.verify();
//       console.log("SMTP connection verified successfully");
//     } catch (verifyError) {
//       console.error("SMTP verification failed:", verifyError);
//       throw new Error("Failed to verify SMTP connection");
//     }

//     // Send verification email
//     const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//     const verificationUrl = `${baseURL}/verify-email?token=${verificationToken}&role=student`;
//     const mailOptions = {
//       from: `"UCP Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Verify Your Email - UCP Portal",
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
//           <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//             <div style="text-align: center; margin-bottom: 30px;">
//               <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🎓 UCP Portal</h1>
//               <p style="color: #6b7280; margin: 5px 0 0 0;">University of Central Punjab</p>
//             </div>
//             <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}!</h2>
//             <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
//               Thank you for registering as a student at UCP Portal. To complete your registration, 
//               please verify your email address by clicking the button below:
//             </p>
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${verificationUrl}" 
//                  style="display: inline-block; padding: 15px 30px; background-color: #2563eb; 
//                         color: white; text-decoration: none; border-radius: 8px; font-weight: bold;
//                         box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);">
//                 ✅ Verify Email Address
//               </a>
//             </div>
//             <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
//               <p style="color: #92400e; margin: 0; font-size: 14px;">
//                 ⏰ <strong>Important:</strong> This verification link will expire in 24 hours.
//               </p>
//             </div>
//             <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
//               If you did not request this registration, please ignore this email.
//             </p>
//             <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//             <div style="text-align: center;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 © 2025 University of Central Punjab. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       `,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log("Verification email sent to:", email);
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//       throw new Error("Failed to send verification email");
//     }

//     return NextResponse.json(
//       {
//         message: "Student registered successfully. Please check your email to verify your account.",
//         student: {
//           id: newStudent._id,
//           name: newStudent.name,
//           email: newStudent.email,
//           semester: newStudent.semester,
//           section: newStudent.section,
//           classId: newStudent.classId,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Student registration error:", error);
//     return NextResponse.json(
//       { message: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import UnverifiedStudent from "@/models/UnverifiedStudent";
// import ClassSection from "@/models/ClassSection";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { name, email, phone, registrationNumber, semester, section, image, password } =
//       await request.json();

//     // Validate input
//     if (!name || !email || !phone || !registrationNumber || !semester || !section || !password) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Server-side password validation
//     if (password.length < 8) {
//       return NextResponse.json(
//         { message: "Password must be at least 8 characters long" },
//         { status: 400 }
//       );
//     }

//     // Debug environment variables
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);
//     console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

//     // Check if unverified student already exists
//     const existingRequest = await UnverifiedStudent.findOne({ email });
//     if (existingRequest) {
//       return NextResponse.json(
//         { message: "Registration request with this email already exists" },
//         { status: 400 }
//       );
//     }

//     const existingRegNumber = await UnverifiedStudent.findOne({ registrationNumber });
//     if (existingRegNumber) {
//       return NextResponse.json(
//         { message: "Registration number already exists" },
//         { status: 400 }
//       );
//     }

//     // Find or create ClassSection
//     let classSection = await ClassSection.findOne({ semester, section });
//     if (!classSection) {
//       const classId = `${semester}_${section}_${Date.now()}`;
//       const room = `Room-${Math.floor(Math.random() * 100) + 1}`;

//       classSection = new ClassSection({
//         semester,
//         section,
//         classId,
//         room,
//         enrolledStudents: 0,
//         students: [],
//         program: "BSCS",
//       });
//       await classSection.save();
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate JWT verification token
//     const verificationToken = jwt.sign(
//       { email },
//       process.env.JWT_SECRET || "fallback-secret",
//       { expiresIn: "1d" }
//     );

//     // Create new unverified student
//     const newUnverifiedStudent = new UnverifiedStudent({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       semester,
//       section,
//       registrationNumber,
//       image,
//       isVerified: false,
//       verificationToken,
//     });

//     await newUnverifiedStudent.save();

//     // Verify transporter configuration
//     try {
//       await transporter.verify();
//       console.log("SMTP connection verified successfully");
//     } catch (verifyError) {
//       console.error("SMTP verification failed:", verifyError);
//       throw new Error("Failed to verify SMTP connection");
//     }

//     // Send verification email
//     const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//     const verificationUrl = `${baseURL}/verify-email?token=${verificationToken}&role=student`;
//     const mailOptions = {
//       from: `"UCP Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Verify Your Email - UCP Portal",
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
//           <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//             <div style="text-align: center; margin-bottom: 30px;">
//               <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🎓 UCP Portal</h1>
//               <p style="color: #6b7280; margin: 5px 0 0 0;">University of Central Punjab</p>
//             </div>
//             <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}!</h2>
//             <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
//               Thank you for registering as a student at UCP Portal. To complete your registration, 
//               please verify your email address by clicking the button below:
//             </p>
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${verificationUrl}" 
//                  style="display: inline-block; padding: 15px 30px; background-color: #2563eb; 
//                         color: white; text-decoration: none; border-radius: 8px; font-weight: bold;
//                         box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);">
//                 ✅ Verify Email Address
//               </a>
//             </div>
//             <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
//               <p style="color: #92400e; margin: 0; font-size: 14px;">
//                 ⏰ <strong>Important:</strong> This verification link will expire in 24 hours.
//               </p>
//             </div>
//             <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
//               If you did not request this registration, please ignore this email.
//             </p>
//             <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//             <div style="text-align: center;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 © 2025 University of Central Punjab. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       `,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log("Verification email sent to:", email);
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//       throw new Error("Failed to send verification email");
//     }

//     return NextResponse.json(
//       {
//         message: "Registration request submitted successfully. Please check your email to verify your account.",
//         studentRequest: {
//           id: newUnverifiedStudent._id,
//           name: newUnverifiedStudent.name,
//           email: newUnverifiedStudent.email,
//           semester: newUnverifiedStudent.semester,
//           section: newUnverifiedStudent.section,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Student registration error:", error);
//     return NextResponse.json(
//       { message: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



// meamea
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UnverifiedStudent from "@/models/UnverifiedStudent";
import ClassSection from "@/models/ClassSection";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("Request Body:", body); // Log to debug incoming data
    const { name, email, phone, registrationNumber, program, semester, section, image, password } = body;

    // Validate input withBronze
    if (!name || !email || !phone || !registrationNumber || !program || !semester || !section || !password) {
      return NextResponse.json(
        {
          message: `All fields are required. Missing: ${
            [
              !name && "name",
              !email && "email",
              !phone && "phone",
              !registrationNumber && "registrationNumber",
              !program && "program",
              !semester && "semester",
              !section && "section",
              !password && "password",
            ].filter(Boolean).join(", ")
          }`,
        },
        { status: 400 }
      );
    }

    // Additional validation for program to ensure it's not an empty string
    if (program.trim() === "") {
      return NextResponse.json(
        { message: "Program field cannot be empty" },
        { status: 400 }
      );
    }

    // Server-side password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Debug environment variables
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

    // Check if unverified student already exists
    const existingRequest = await UnverifiedStudent.findOne({ email });
    if (existingRequest) {
      return NextResponse.json(
        { message: "Registration request with this email already exists" },
        { status: 400 }
      );
    }

    const existingRegNumber = await UnverifiedStudent.findOne({ registrationNumber });
    if (existingRegNumber) {
      return NextResponse.json(
        { message: "Registration number already exists" },
        { status: 400 }
      );
    }

    // Find or create ClassSection
    let classSection = await ClassSection.findOne({ program, semester, section });
    if (!classSection) {
      const classId = `${program}_${semester}_${section}_${Date.now()}`;
      const room = `Room-${Math.floor(Math.random() * 100) + 1}`;

      classSection = new ClassSection({
        program,
        semester,
        section,
        classId,
        room,
        enrolledStudents: 0,
        students: [],
      });
      await classSection.save();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate JWT verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    // Create new unverified student
    const newUnverifiedStudent = new UnverifiedStudent({
      name,
      email,
      phone,
      password: hashedPassword,
      program,
      semester,
      section,
      registrationNumber,
      image,
      isVerified: false,
      verificationToken,
    });

    await newUnverifiedStudent.save();

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw new Error("Failed to verify SMTP connection");
    }

    // Send verification email
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const verificationUrl = `${baseURL}/verify-email?token=${verificationToken}&role=student`;
    const mailOptions = {
      from: `"UCP Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - UCP Portal",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🎓 UCP Portal</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">University of Central Punjab</p>
            </div>
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering as a student at UCP Portal. To complete your registration, 
              please verify your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 15px 30px; background-color: #2563eb; 
                        color: white; text-decoration: none; border-radius: 8px; font-weight: bold;
                        box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⏰ <strong>Important:</strong> This verification link will expire in 24 hours.
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you did not request this registration, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <div style="text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 University of Central Punjab. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent to:", email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      throw new Error("Failed to send verification email");
    }

    return NextResponse.json(
      {
        message: "Registration request submitted successfully. Please check your email to verify your account.",
        studentRequest: {
          id: newUnverifiedStudent._id,
          name: newUnverifiedStudent.name,
          email: newUnverifiedStudent.email,
          program: newUnverifiedStudent.program,
          semester: newUnverifiedStudent.semester,
          section: newUnverifiedStudent.section,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
