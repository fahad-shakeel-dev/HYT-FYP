
import mongoose from "mongoose"

const RegistrationRequestSchema = new mongoose.Schema({
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
        enum: ["teacher", "therapist"],
        default: "therapist",
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// TTL Index: Automatically delete unverified requests after 24 hours (86400 seconds)
// This will delete documents where isVerified is false and createdAt is older than 1 day
RegistrationRequestSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 86400,
        partialFilterExpression: { isVerified: false }
    }
)

export default mongoose.models.RegistrationRequest || mongoose.model("RegistrationRequest", RegistrationRequestSchema)
