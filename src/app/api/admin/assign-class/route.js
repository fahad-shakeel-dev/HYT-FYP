import { NextResponse } from "next/server";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import User from "@/models/User";
import Class from "@/models/ClassSchema";
import ClassSection from "@/models/ClassSection";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  console.log("🔄 Connecting to MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
  return mongoose.connection;
}

async function executeWithRetry(operation, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error.code === 251 && attempt < maxRetries) {
        console.warn(`⚠️ Transaction error (attempt ${attempt}/${maxRetries}):`, error.message);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function POST(request) {
  try {
    const { teacherId, classId, subject, sections, credentials } = await request.json();

    if (!teacherId || !classId || !subject || !sections?.length || !credentials?.username || !credentials?.password) {
      return NextResponse.json({ message: "All fields are required, including at least one section" }, { status: 400 });
    }

    await connectToDatabase();

    const operation = async () => {
      const session = await mongoose.startSession();
      let result;

      try {
        await session.withTransaction(async () => {
          const [teacher, classData] = await Promise.all([
            User.findById(teacherId).session(session),
            Class.findById(classId).session(session),
          ]);

          if (!teacher) {
            throw new Error("Teacher not found");
          }
          if (!classData) {
            throw new Error("Class not found");
          }

          // Validate that requested sections exist in the class
          const invalidSections = sections.filter((section) => !classData.sections.includes(section));
          if (invalidSections.length > 0) {
            throw new Error(`Invalid sections: ${invalidSections.join(", ")}`);
          }

          // Check for existing assignments for the selected sections and subject
          const existingAssignments = await ClassSection.find({
            classId,
            section: { $in: sections },
            subject,
            assignedTeacher: { $ne: null },
          }).session(session);

          if (existingAssignments.length > 0) {
            throw new Error(
              `Subject '${subject}' already assigned for sections: ${existingAssignments.map((a) => a.section).join(", ")}`
            );
          }

          // Create or update ClassSection documents for only the selected sections
          for (const section of sections) {
            const existingSection = await ClassSection.findOne({
              classId,
              section,
              subject,
            }).session(session);

            if (!existingSection) {
              console.log(`📝 Creating ClassSection for classId: ${classId}, section: ${section}, subject: ${subject}`);
              await ClassSection.create(
                [{
                  classId,
                  section,
                  subject,
                  program: classData.program,
                  semester: classData.semester,
                  room: "TBD",
                  enrolledStudents: 0,
                  assignedTeacher: teacherId,
                  assignedAt: new Date(),
                }],
                { session }
              );
            } else {
              console.log(`📝 Updating ClassSection for classId: ${classId}, section: ${section}, subject: ${subject}`);
              await ClassSection.updateOne(
                { classId, section, subject },
                {
                  $set: {
                    assignedTeacher: teacherId,
                    assignedAt: new Date(),
                    program: classData.program,
                    semester: classData.semester,
                  },
                },
                { session }
              );
            }
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(credentials.password, 12);

          // Prepare assignment data with only the selected sections
          const classDisplayName = `${classData.program} ${classData.className} Semester ${classData.semester} (${sections.join(", ")})`;
          const assignmentData = {
            classId: classId.toString(),
            sections,
            subject,
            classDisplayName,
            classCredentials: {
              username: credentials.username,
              password: hashedPassword,
            },
            assignedAt: new Date(),
          };

          console.log("📝 Saving assignment for teacher:", {
            teacherId,
            assignment: { ...assignmentData, classCredentials: { username: credentials.username, password: "[HIDDEN]" } },
          });

          await User.findByIdAndUpdate(
            teacherId,
            {
              $push: { classAssignments: assignmentData },
            },
            { session }
          );

          const emailContent = `
            <div style="max-width: 700px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; background-color: #f8fafc; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 32px;">🎓 UCP Portal</h1>
                <p style="color: #e2e8f0; font-size: 16px;">University of Central Punjab</p>
              </div>
              <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <h2 style="color: #1a202c; font-size: 28px;">🎉 Class Assignment Notification</h2>
                <p style="color: #2d3748; font-size: 18px;">Dear <strong>${teacher.name}</strong>,</p>
                <div style="background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%); padding: 25px; border-radius: 12px; border-left: 5px solid #38a169;">
                  <p style="color: #2d3748; font-size: 16px;">
                    🎊 <strong>Congratulations!</strong> You have been assigned to teach:
                  </p>
                  <p><strong>Class:</strong> ${classDisplayName}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Sections:</strong> ${sections.join(", ")}</p>
                </div>
                <div style="background: linear-gradient(135deg, #fef5e7 0%, #fefcf3 100%); padding: 25px; border-radius: 12px; border-left: 5px solid #ed8936;">
                  <h3 style="color: #c05621; font-size: 20px;">🔐 Student Login Credentials</h3>
                  <p><strong>Username:</strong> ${credentials.username}</p>
                  <p><strong>Password:</strong> [Sent separately for security]</p>
                </div>
                <p style="color: #4a5568; font-size: 16px;">
                  Please contact the Academic Administration Team to receive the password securely.<br>
                  Best regards,<br><strong>Academic Administration Team</strong><br>University of Central Punjab
                </p>
              </div>
            </div>
          `;
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: teacher.email,
            subject: "🎓 Class Assignment - UCP Portal",
            html: emailContent,
          });

          result = {
            message: "Class assigned successfully",
            assignment: {
              teacher: teacher.name,
              class: classDisplayName,
              subject,
              sections,
              classCredentials: { username: credentials.username },
            },
          };
        });

        return result;
      } catch (error) {
        throw error;
      } finally {
        session.endSession();
      }
    };

    const result = await executeWithRetry(operation);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Error assigning class:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.code === 251 ? 400 : 500 }
    );
  }
}
