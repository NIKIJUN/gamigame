const dns = require("dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

require("dotenv").config();

const connectDB = require("./config/db");

// Import app dari src/app.js
const app = require("./src/app");

// Cek apakah MONGODB_URI terbaca dari .env
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI tidak ditemukan. Cek file .env kamu.");
  process.exit(1);
}

// koneksi database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});