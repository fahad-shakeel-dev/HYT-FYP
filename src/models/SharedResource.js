import mongoose from "mongoose";

const SharedResourceSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student", // Or User if students are Users, but likely Student model
            default: null, // Null if broadcast
        },
        groupId: {
            type: String, // Storing ClassSection ID or custom Group ID
            default: null, // Null if private
        },
        type: {
            type: String,
            enum: ["file", "video", "image", "message", "report"],
            default: "message",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        url: {
            type: String, // URL to file/image/video
        },
        isPrivate: {
            type: Boolean,
            default: true,
        },
        // Optional: metadata for file size, etc.
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.SharedResource || mongoose.model("SharedResource", SharedResourceSchema);
