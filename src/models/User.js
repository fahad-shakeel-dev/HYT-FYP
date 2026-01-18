
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
    subject: {
      type: String,
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    registrationRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegistrationRequest",
      default: null,
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
    strict: false,
  }
);

// Clear cached model to ensure schema updates are applied
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
