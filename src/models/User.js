
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["therapist", "admin"],
      default: "therapist",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    classAssignments: [
      {
        classId: {
          type: String,
          required: true,
        },
        sections: {
          type: [String],
          required: true,
        },
        subject: {
          type: String,
          required: true,
        },
        classDisplayName: {
          type: String,
          required: true,
        },
        classCredentials: {
          username: {
            type: String,
            required: true,
          },
          password: {
            type: String,
            required: true,
          },
        },
        assignedAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
