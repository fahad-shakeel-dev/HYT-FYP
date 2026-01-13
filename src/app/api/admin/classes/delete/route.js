import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Class from "@/models/ClassSchema";

export async function DELETE(request) {
  try {
    const { classId } = await request.json();
    if (!classId) {
      return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
    }
    await connectDB();
    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Class deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
