import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Class from "@/models/ClassSchema";
import ClassSection from "@/models/ClassSection";

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

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const sections = searchParams.get("sections")?.split(",") || [];

    if (!classId) {
      return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
    }

    const classData = await Class.findById(classId).lean();
    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    // Validate sections
    const invalidSections = sections.length > 0 ? sections.filter((section) => !classData.sections.includes(section)) : [];
    if (invalidSections.length > 0) {
      return NextResponse.json({ message: `Invalid sections: ${invalidSections.join(", ")}` }, { status: 400 });
    }

    // Get subjects that are not assigned for ALL selected sections
    const assignedSections = await ClassSection.find({
      classId,
      section: { $in: sections.length > 0 ? sections : classData.sections },
      assignedTeacher: { $ne: null },
    }).lean();

    const assignedSubjects = [...new Set(assignedSections.map((section) => section.subject))];
    const availableSubjects = classData.subjects.filter((subject) => !assignedSubjects.includes(subject));

    return NextResponse.json({ availableSubjects }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching available subjects:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
