import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Class from "@/models/ClassSchema";
import ClassSection from "@/models/ClassSection";

export async function POST(request) {
  try {
    const { category, className, schedules, activities } = await request.json();

    // Validate input
    if (!category || !className || !schedules || !activities) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const validCategories = ["Speech Therapy", "Occupational Therapy", "Behavioral Therapy", "Physical Therapy", "Social Skills Group"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ message: "Invalid category" }, { status: 400 });
    }

    if (!Array.isArray(schedules) || schedules.length === 0 || schedules.some((s) => !s.trim())) {
      return NextResponse.json({ message: "At least one valid schedule is required" }, { status: 400 });
    }

    if (!Array.isArray(activities) || activities.length === 0 || activities.some((s) => !s.trim())) {
      return NextResponse.json({ message: "At least one valid activity is required" }, { status: 400 });
    }

    await connectDB();

    // Check for duplicate class (Therapy Group Name)
    const existingClass = await Class.findOne({ className });
    if (existingClass) {
      return NextResponse.json({ message: `Therapy Group '${className}' already exists` }, { status: 400 });
    }

    // Create new class (Therapy Group)
    const newClass = new Class({
      category,
      className,
      schedules,
      activities,
      createdAt: new Date(),
    });

    await newClass.save();

    // Create ClassSection documents for each Schedule-Activity pair
    // This allows assigning teachers/students to specific sub-units if needed, 
    // or we can treat them as just 'instances' of the group.
    const classSections = [];
    for (const schedule of schedules) {
      for (const activity of activities) {
        classSections.push({
          category,
          schedule,
          classId: newClass._id.toString(),
          room: "Therapy Room 1", // Default, could be made dynamic later
          enrolledStudents: 0,
          students: [],
          activity: activity.trim(),
          createdAt: new Date(),
        });
      }
    }

    await ClassSection.insertMany(classSections);

    return NextResponse.json(
      { message: "Therapy Group created successfully", classId: newClass._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating therapy group:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate key error. A group with this name already exists." },
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
