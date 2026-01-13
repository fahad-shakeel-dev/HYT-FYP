import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Class from "@/models/ClassSchema";
import ClassSection from "@/models/ClassSection";

export async function POST(request) {
  try {
    const { program, semester, sections, subjects } = await request.json();

    // Validate input
    if (!program || !semester || !sections || !subjects) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!["BSCS", "BBA", "ADP CS"].includes(program)) {
      return NextResponse.json({ message: "Invalid program" }, { status: 400 });
    }

    if (!Number.isInteger(Number(semester)) || semester < 1 || semester > 8) {
      return NextResponse.json({ message: "Invalid semester (must be 1-8)" }, { status: 400 });
    }

    if (!Array.isArray(sections) || sections.length === 0 || !sections.every((s) => ["A", "B", "C", "D", "E", "F"].includes(s))) {
      return NextResponse.json({ message: "Sections must be non-empty and contain valid values (A-F)" }, { status: 400 });
    }

    if (!Array.isArray(subjects) || subjects.length === 0 || subjects.some((s) => !s.trim())) {
      return NextResponse.json({ message: "At least one valid subject is required" }, { status: 400 });
    }

    // Generate class name
    const className = `${program} ${semester} ${sections.sort().join("")}`;

    await connectDB();

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check for duplicate class
      const existingClass = await Class.findOne({ className }).session(session);
      if (existingClass) {
        await session.abortTransaction();
        return NextResponse.json({ message: `Class '${className}' already exists` }, { status: 400 });
      }

      // Create new class
      const newClass = new Class({
        program,
        className,
        semester,
        sections,
        subjects,
        createdAt: new Date(),
      });

      await newClass.save({ session });

      // Check for existing ClassSection documents to avoid duplicates
      const existingSections = await ClassSection.find({
        classId: newClass._id.toString(),
        section: { $in: sections },
        subject: { $in: subjects },
      }).session(session);

      if (existingSections.length > 0) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            message: `Class sections already exist for: ${existingSections
              .map((s) => `${s.section} (${s.subject})`)
              .join(", ")}`,
          },
          { status: 400 }
        );
      }

      // Create ClassSection documents for each section-subject pair
      const classSections = [];
      for (const section of sections) {
        for (const subject of subjects) {
          classSections.push({
            semester: semester.toString(),
            section,
            classId: newClass._id.toString(),
            room: "TBD",
            enrolledStudents: 0,
            students: [],
            program,
            subject: subject.trim(),
            createdAt: new Date(),
          });
        }
      }

      await ClassSection.insertMany(classSections, { session });

      // Commit the transaction
      await session.commitTransaction();
      return NextResponse.json(
        { message: "Class and sections created successfully", classId: newClass._id },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error creating class:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate key error. A class section with this classId, section, or subject already exists." },
        { status: 400 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: `Validation error: ${error.message}` },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
