
import mongoose from "mongoose";

const UnverifiedStudentSchema = new mongoose.Schema(
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
      default: "1",
    },
    section: {
      type: String,
      default: "A",
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

export default mongoose.models.UnverifiedStudent || mongoose.model("UnverifiedStudent", UnverifiedStudentSchema);
