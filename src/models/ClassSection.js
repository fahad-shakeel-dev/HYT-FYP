import mongoose from "mongoose";

const ClassSectionSchema = new mongoose.Schema(
  {
    category: { // Replaces program
      type: String,
      required: true,
    },
    // semester removed/deprecated
    schedule: { // Replaces section
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    room: {
      type: String,
      required: true,
      default: "Therapy Room 1",
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
    activity: { // Replaces subject
      type: String,
      default: null,
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

ClassSectionSchema.index({ classId: 1, schedule: 1, activity: 1 }, { unique: true, sparse: true });

// Prevent Mongoose overwrite warning but force update for HMR
if (mongoose.models.ClassSection) {
  delete mongoose.models.ClassSection;
}

export default mongoose.model("ClassSection", ClassSectionSchema);
