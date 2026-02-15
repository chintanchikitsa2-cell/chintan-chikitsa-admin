import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL! as string;

if (!MONGO_URL) {
  throw new Error("Please define MONGO_URI in .env");
}


type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};


// Global cache to prevent multiple connections in dev
let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/* ---------------------------------------
   Attach listeners ONCE
--------------------------------------- */

const conn = mongoose.connection;

if (!conn.listeners("connected").length) {
  conn.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  conn.on("error", (err) => {
    console.error("❌ MongoDB error:", err);
  });

  conn.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  // Graceful shutdown (important for prod)
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB disconnected on SIGINT");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB disconnected on SIGTERM");
    process.exit(0);
  });
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}