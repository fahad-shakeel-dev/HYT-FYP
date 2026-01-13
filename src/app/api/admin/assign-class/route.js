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
      return NextResponse.json({ message: "All fields are required, including at least one schedule" }, { status: 400 });
    }

    await connectToDatabase();

    // Auto-migrate: Drop old index if it exists (one-time cleanup)
    try {
      const db = mongoose.connection.db;
      const collection = db.collection('classsections');
      await collection.dropIndex('classId_1_section_1_subject_1');
      console.log('✅ Dropped legacy index: classId_1_section_1_subject_1');
    } catch (error) {
      // Ignore if index doesn't exist (code 27) or already dropped
      if (error.code !== 27) {
        console.log('ℹ️  Legacy index cleanup:', error.message);
      }
    }

    const teacher = await User.findById(teacherId);
    const classData = await Class.findById(classId);

    if (!teacher) throw new Error("Teacher not found");
    if (!classData) throw new Error("Therapy Group not found");

    // Validate that requested schedules exist in the class
    // 'sections' in payload corresponds to 'schedules' in DB
    const invalidSchedules = sections.filter((schedule) => !classData.schedules.includes(schedule));
    if (invalidSchedules.length > 0) {
      throw new Error(`Invalid schedules: ${invalidSchedules.join(", ")}`);
    }

    // Check for existing assignments
    const existingAssignments = await ClassSection.find({
      classId,
      schedule: { $in: sections },
      activity: subject,
      assignedTeacher: { $ne: null },
    });

    if (existingAssignments.length > 0) {
      throw new Error(
        `Activity '${subject}' already assigned for schedules: ${existingAssignments.map((a) => a.schedule).join(", ")}`
      );
    }

    // Update/Create ClassSection documents
    for (const schedule of sections) {
      const existingSection = await ClassSection.findOne({
        classId,
        schedule,
        activity: subject,
      });

      if (!existingSection) {
        console.log(`📝 Creating ClassSection for classId: ${classId}, schedule: ${schedule}, activity: ${subject}`);
        await ClassSection.create({
          classId,
          schedule,
          activity: subject,
          category: classData.category,
          room: "Therapy Room 1",
          enrolledStudents: 0,
          assignedTeacher: teacherId,
          assignedAt: new Date(),
        });
      } else {
        console.log(`📝 Updating ClassSection for classId: ${classId}, schedule: ${schedule}, activity: ${subject}`);
        await ClassSection.updateOne(
          { classId, schedule, activity: subject },
          {
            $set: {
              assignedTeacher: teacherId,
              assignedAt: new Date(),
              category: classData.category,
            },
          }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(credentials.password, 12);

    // Prepare assignment data
    const classDisplayName = `${classData.className} (${classData.category}) - ${sections.join(", ")}`;
    const assignmentData = {
      classId: classId.toString(),
      sections, // Keeping key as 'sections' for frontend compatibility or general list naming
      subject,
      classDisplayName,
      classCredentials: {
        username: credentials.username,
        password: hashedPassword,
      },
      assignedAt: new Date(),
    };

    console.log("📝 Saving assignment for therapist:", {
      teacherId,
      assignment: { ...assignmentData, classCredentials: { username: credentials.username, password: "[HIDDEN]" } },
    });

    await User.findByIdAndUpdate(
      teacherId,
      {
        $push: { classAssignments: assignmentData },
      }
    );

    const emailContent = `
      <div style="max-width: 700px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; background-color: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🎓 Therapy Management</h1>
          <p style="color: #e2e8f0; font-size: 16px;">Clinical Portal</p>
        </div>
        <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <h2 style="color: #1a202c; font-size: 28px;">🎉 New Assignment</h2>
          <p style="color: #2d3748; font-size: 18px;">Dear <strong>${teacher.name}</strong>,</p>
          <div style="background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%); padding: 25px; border-radius: 12px; border-left: 5px solid #38a169;">
            <p style="color: #2d3748; font-size: 16px;">
              You have been assigned to:
            </p>
            <p><strong>Group:</strong> ${classData.className}</p>
            <p><strong>Category:</strong> ${classData.category}</p>
            <p><strong>Activity:</strong> ${subject}</p>
            <p><strong>Schedule:</strong> ${sections.join(", ")}</p>
          </div>
          <div style="background: linear-gradient(135deg, #fef5e7 0%, #fefcf3 100%); padding: 25px; border-radius: 12px; border-left: 5px solid #ed8936;">
            <h3 style="color: #c05621; font-size: 20px;">🔐 Session Credentials</h3>
            <p><strong>Username:</strong> ${credentials.username}</p>
            <p><strong>Password:</strong> [Sent separately]</p>
          </div>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: teacher.email,
        subject: "New Therapy Group Assignment",
        html: emailContent,
      });
    } catch (mailError) {
      console.error("Failed to send email:", mailError);
      // Don't fail the request just because email failed
    }

    return NextResponse.json({
      message: "Therapy Group assigned successfully",
      assignment: {
        teacher: teacher.name,
        class: classDisplayName,
        subject,
        sections,
        classCredentials: { username: credentials.username },
      },
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error assigning therapy group:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
