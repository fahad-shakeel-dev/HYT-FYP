import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  program: {
    type: String,
    required: true,
    enum: ["BSCS", "BBA", "ADP CS"],
  },
  className: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  sections: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length > 0 && v.every((s) => ["A", "B", "C", "D", "E", "F"].includes(s)),
      message: "Sections must be non-empty and contain valid values (A-F)",
    },
  },
  subjects: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length > 0 && v.every((s) => s.trim().length > 0),
      message: "At least one valid subject is required",
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

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
