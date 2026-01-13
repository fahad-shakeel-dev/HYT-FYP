import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import ClassSection from "@/models/ClassSection";
import Class from "@/models/ClassSchema";

const MONGODB_URI = process.env.MONGODB_URI;

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

export async function GET(request) {
  try {
    await connectToDatabase();

    const assignedTeachers = await User.find({
      role: { $in: ["teacher", "therapist"] },
      isApproved: true,
      classAssignments: { $exists: true, $ne: [] },
    })
      .select("name email classAssignments")
      .lean();

    console.log("📚 Fetched teachers:", assignedTeachers.length);

    const assignedClassesWithDetails = [];

    for (const teacher of assignedTeachers) {
      for (const assignment of teacher.classAssignments) {
        console.log("🔍 Processing assignment:", {
          teacherId: teacher._id,
          classId: assignment.classId,
          subject: assignment.subject,
          sections: assignment.sections,
          classCredentials: assignment.classCredentials,
          classDisplayName: assignment.classDisplayName,
        });

        const classData = await Class.findById(assignment.classId).lean();
        if (!classData) {
          console.warn("⚠️ Class not found for classId:", assignment.classId);
        }

        const sections = Array.isArray(assignment.sections) && assignment.sections.length > 0
          ? assignment.sections
          : (classData && Array.isArray(classData.sections) && classData.sections.length > 0 ? classData.sections : ["Unknown"]);

        const classSections = await ClassSection.find({
          classId: assignment.classId,
          section: { $in: sections },
          subject: assignment.subject,
        }).lean();

        console.log("📌 Found class sections:", classSections.length, "for classId:", assignment.classId);

        const classDisplayName = assignment.classDisplayName || (classData ? `${classData.className} (${sections.join(", ")})` : "Unknown Class");
        const credentials = assignment.classCredentials && typeof assignment.classCredentials === "object"
          ? {
            username: assignment.classCredentials.username || "N/A",
            password: assignment.classCredentials.password || "N/A",
          }
          : { username: "N/A", password: "N/A" };

        // Create a single entry with all sections
        assignedClassesWithDetails.push({
          teacherId: teacher._id.toString(),
          teacherName: teacher.name || "Unknown Teacher",
          teacherEmail: teacher.email || "N/A",
          assignedClass: classDisplayName,
          subject: assignment.subject || "N/A",
          section: sections.join(", "), // Join sections into a string
          classCredentials: credentials,
          assignedAt: assignment.assignedAt || new Date(),
          classId: assignment.classId?.toString() || "N/A",
          classDetails: classSections.length > 0 || classData
            ? {
              program: classSections[0]?.program || classData?.program || "N/A",
              semester: classSections[0]?.semester || classData?.semester || "N/A",
              section: sections.join(", "),
              room: classSections[0]?.room || "N/A",
              enrolledStudents: classSections[0]?.enrolledStudents || 0,
              classId: (classSections[0]?.classId || assignment.classId)?.toString() || "N/A",
            }
            : {
              program: classData?.program || "N/A",
              semester: classData?.semester || "N/A",
              section: sections.join(", "),
              room: "N/A",
              enrolledStudents: 0,
              classId: assignment.classId?.toString() || "N/A",
            },
        });
      }
    }

    console.log("✅ Processed assignments:", assignedClassesWithDetails.length);

    return NextResponse.json(
      {
        success: true,
        assignedClasses: assignedClassesWithDetails,
        count: assignedClassesWithDetails.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching assigned classes:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
