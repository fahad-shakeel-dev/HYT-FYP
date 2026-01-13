import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    classId: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "parent",
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    enrollments: [
      {
        classSectionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ClassSection",
          required: true,
        },
        classId: {
          type: String,
          required: true,
        },
        subject: {
          type: String,
          required: true,
        },
        semester: {
          type: String,
          required: true,
        },
        section: {
          type: String,
          required: true,
        },
        program: {
          type: String,
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
