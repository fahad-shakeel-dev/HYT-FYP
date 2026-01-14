import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Student from "@/models/Student";
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

    console.log(`Unassigning therapist ${teacherId} from class ${classId}, section ${section}, subject ${subject}`);

    // Split sections if comma-separated (e.g., "A, B" -> ["A", "B"])
    const sectionList = section.split(",").map(s => s.trim()).filter(Boolean);
    console.log(`Unassigning sections:`, sectionList);

    let totalUnenrolled = 0;

    for (const sectionItem of sectionList) {
      // 1. Unenroll students from this specific section
      const studentUpdate = await Student.updateMany(
        {
          enrollments: {
            $elemMatch: {
              classId: classId,
              subject: subject,
              section: sectionItem
            }
          }
        },
        {
          $pull: {
            enrollments: {
              classId: classId,
              subject: subject,
              section: sectionItem
            }
          }
        }
      );

      totalUnenrolled += studentUpdate.modifiedCount;

      // 2. Clear patient data in ClassSection for this specific section
      const sectionUpdate = await ClassSection.updateOne(
        {
          classId: new mongoose.Types.ObjectId(classId),
          schedule: sectionItem,
          activity: subject
        },
        {
          $set: {
            assignedTeacher: null,
            assignedAt: null,
            students: [],
            enrolledStudents: 0
          },
        }
      );
      console.log(`[Unassign] ClassSection (${sectionItem}): matched ${sectionUpdate.matchedCount}, modified ${sectionUpdate.modifiedCount}`);
    }

    // 3. Remove assignment from teacher's classAssignments
    // We match by classId and subject. We use $all for sections to be resilient to order.
    const userUpdate = await User.findByIdAndUpdate(
      teacherId,
      {
        $pull: {
          classAssignments: {
            classId: classId,
            subject: subject,
            sections: { $all: sectionList } // Removed $size for better resilience
          },
        },
      },
      { new: true }
    );
    console.log(`[Unassign] User ${teacherId}: assignments remaining ${userUpdate?.classAssignments?.length || 0}`);

    // 4. Final step: Global sync of enrollmentCount for all students to ensure absolute accuracy
    const allStudents = await Student.find({}).select("_id enrollments");
    for (const student of allStudents) {
      if (student.enrollmentCount !== student.enrollments.length) {
        await Student.updateOne(
          { _id: student._id },
          { $set: { enrollmentCount: student.enrollments.length } }
        );
      }
    }

    return NextResponse.json({
      message: "Therapy Group unassigned successfully",
      details: {
        sectionsProcessed: sectionList.length,
        totalStudentsUnenrolled: totalUnenrolled,
        teacherFound: !!userUpdate
      }
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error unassigning therapy group:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
