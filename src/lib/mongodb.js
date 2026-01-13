import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // Bypassing database connection check during Vercel's static analysis phase
  if (!MONGODB_URI) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn("MONGODB_URI is not defined, but skipping check during production build phase.");
      return null;
    }
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
