const mongoose = require("mongoose");

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 5;

const connectDB = async (retries = MAX_RETRIES) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      family: 4,
      retryReads: true,
      retryWrites: true,
      maxPoolSize: 10,
    });

    console.log("MongoDB Atlas berhasil terkoneksi");

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB terputus. Mencoba reconnect...");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err.message);
    });
  } catch (error) {
    console.error(`MongoDB gagal terkoneksi: ${error.message}`);

    if (retries > 0) {
      console.log(`Mencoba lagi dalam ${RETRY_DELAY_MS / 1000} detik... (sisa ${retries} percobaan)`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    console.error("Semua percobaan koneksi gagal. Server berhenti.");
    process.exit(1);
  }
};

module.exports = connectDB;
