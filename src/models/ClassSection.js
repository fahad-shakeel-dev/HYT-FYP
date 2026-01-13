import mongoose from "mongoose";

const ClassSectionSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    assignedTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subject: {
      type: String, // Optional to avoid validation error
      default: null,
    },
    program: {
      type: String,
      required: true,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

ClassSectionSchema.index({ classId: 1, section: 1, subject: 1 }, { unique: true, sparse: true });

export default mongoose.models.ClassSection || mongoose.model("ClassSection", ClassSectionSchema);
