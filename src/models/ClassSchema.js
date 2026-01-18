import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  className: {
    type: String, // Therapy Group Name
    required: true,
    trim: true,
    unique: true,
  },
  // semester field removed as it's not relevant for therapy groups
  schedules: {
    type: [String], // e.g., ["Monday 10:00 AM", "Wednesday 2:00 PM"] or specific dates
    required: true,
    validate: {
      validator: (v) => v.length > 0 && v.every((s) => s.trim().length > 0),
      message: "At least one schedule is required",
    },
  },
  activities: { // Replaces subjects
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length > 0 && v.every((s) => s.trim().length > 0),
      message: "At least one activity is required",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assignedAt: {
    type: Date,
  },
});

// Prevent Mongoose overwrite warning but force update for HMR
if (mongoose.models.Class) {
  delete mongoose.models.Class;
}

export default mongoose.model("Class", ClassSchema);
