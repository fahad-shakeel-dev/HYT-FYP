import mongoose from "mongoose";

const graduateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    program: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    originalStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    enrollmentYear: {
      type: Number,
      required: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
    graduationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalSemesters: {
      type: Number,
      required: true,
      default: 8,
    },
    degreeStatus: {
      type: String,
      required: true,
      enum: ["Completed", "Incomplete", "Transferred"],
      default: "Completed",
    },
    graduatedInSession: {
      sessionType: String,
      year: Number,
      sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Define indexes explicitly
graduateSchema.index({ graduationYear: 1 });
graduateSchema.index({ program: 1 });
graduateSchema.index({ graduationDate: -1 });
graduateSchema.index({ "graduatedInSession.year": 1, "graduatedInSession.sessionType": 1 });

// Virtual for display name
graduateSchema.virtual("displayName").get(function () {
  return `${this.name} (${this.registrationNumber})`;
});

// Static method to get graduates by year
graduateSchema.statics.getGraduatesByYear = function (year) {
  return this.find({ graduationYear: year }).sort({ graduationDate: -1 });
};

const Graduate = mongoose.models.Graduate || mongoose.model("Graduate", graduateSchema);

export default Graduate;
