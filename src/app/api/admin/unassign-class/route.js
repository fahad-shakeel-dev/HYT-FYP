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
       const session = await mongoose.startSession();
       session.startTransaction();

       try {
         // Remove assignment from teacher's classAssignments
         await User.findByIdAndUpdate(
           teacherId,
           {
             $pull: {
               classAssignments: { classId, subject, "sections": section },
             },
           },
           { session }
         );

         // Clear assignedTeacher in ClassSection
         await ClassSection.updateOne(
           { classId, section, subject },
           {
             $set: { assignedTeacher: null, assignedAt: null },
           },
           { session }
         );

         await session.commitTransaction();
         return NextResponse.json({ message: "Class unassigned successfully" }, { status: 200 });
       } catch (error) {
         await session.abortTransaction();
         console.error("❌ Transaction error:", error);
         return NextResponse.json({ message: error.message }, { status: 400 });
       } finally {
         session.endSession();
       }
     } catch (error) {
       console.error("❌ Error unassigning class:", error);
       return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
     }
   }
