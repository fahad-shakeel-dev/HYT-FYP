import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Class from "@/models/ClassSchema";
import ClassSection from "@/models/ClassSection";
import User from "@/models/User";
import Student from "@/models/Student";

export async function DELETE(request) {
  try {
    const { classId } = await request.json();
    if (!classId) {
      return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
    }

    await connectDB();

    console.log(`Starting cascading deletion for Class ID: ${classId}`);

    // 1. Unassign this class from all Therapists (Users)
    const userUpdate = await User.updateMany(
      {},
      { $pull: { classAssignments: { classId: classId } } }
    );
    console.log(`Removed assignments from ${userUpdate.modifiedCount} therapists.`);

    // 2. Unenroll students from this class
    // First, identify affected students to sync their counts accurately
    const affectedStudents = await Student.find({ "enrollments.classId": classId }).select("_id");

    const studentUpdate = await Student.updateMany(
      { "enrollments.classId": classId },
      { $pull: { enrollments: { classId: classId } } }
    );

    // Sync enrollmentCount for all affected students
    if (affectedStudents.length > 0) {
      const studentIds = affectedStudents.map(s => s._id);
      for (const studentId of studentIds) {
        const student = await Student.findById(studentId).select("enrollments");
        if (student) {
          await Student.updateOne(
            { _id: studentId },
            { $set: { enrollmentCount: student.enrollments.length } }
          );
        }
      }
    }
    console.log(`Removed enrollments from ${studentUpdate.modifiedCount} students and synced counts.`);

    // 3. Delete all specific Class Sections (Sessions) associated with this class
    const sectionDelete = await ClassSection.deleteMany({
      classId: new mongoose.Types.ObjectId(classId)
    });
    console.log(`Deleted ${sectionDelete.deletedCount} linked class sections.`);

    // 4. Finally, delete the Class definition itself
    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      return NextResponse.json({ message: "Class not found (but related data cleaned)" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Therapy Group and all associated data permanently deleted",
      details: {
        therapistsUpdated: userUpdate.modifiedCount,
        studentsUpdated: studentUpdate.modifiedCount,
        sectionsDeleted: sectionDelete.deletedCount
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting therapy group:", error);
    return NextResponse.json({ message: "Internal server error during cascading delete" }, { status: 500 });
  }
}
