import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import ClassSection from "@/models/ClassSection";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  await mongoose.connect(MONGODB_URI);
  return mongoose.connection;
}

export async function DELETE(request) {
  try {
    const { teacherId, classId, section, subject } = await request.json();

    if (!teacherId || !classId || !section || !subject) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Remove assignment from teacher's classAssignments
    // Note: In User model we likely still store 'sections' and 'subject' as keys in the objects pushed
    await User.findByIdAndUpdate(
      teacherId,
      {
        $pull: {
          classAssignments: { classId, subject, "sections": section },
        },
      }
    );

    // Clear assignedTeacher in ClassSection
    // In DB, these are 'schedule' and 'activity'
    await ClassSection.updateOne(
      { classId, schedule: section, activity: subject },
      {
        $set: { assignedTeacher: null, assignedAt: null },
      }
    );

    return NextResponse.json({ message: "Therapy Group unassigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error unassigning therapy group:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
