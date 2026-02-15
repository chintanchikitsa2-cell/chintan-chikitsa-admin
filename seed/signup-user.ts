import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "../src/lib/auth";

dotenv.config({
  path: ".env",
});

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
  throw new Error("MONGO_URL missing");
}

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");

  // Create test admin user
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name: "Test Admin",
        email: "admin@test.com",
        password: "admin123456",
      },
    });

    if (data) {
      console.log("✅ Test admin user created successfully!");
      console.log("📧 Email: admin@test.com");
      console.log("🔑 Password: admin123456");
    }
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});