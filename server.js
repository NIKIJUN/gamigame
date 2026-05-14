const dns = require("dns");

// Paksa Node.js memakai DNS Cloudflare
dns.setServers(["1.1.1.1", "1.0.0.1"]);

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();

app.use(express.json());

// Cek apakah MONGODB_URI terbaca dari .env
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI tidak ditemukan. Cek file .env kamu.");
  process.exit(1);
}

// koneksi database
connectDB();

// route utama
app.get("/", (req, res) => {
  res.send("Server berjalan dan siap konek ke MongoDB");
});

// tambah user
app.post("/users", async (req, res) => {
  try {
    const { nama, email, umur } = req.body;

    const user = await User.create({
      nama,
      email,
      umur,
    });

    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan user",
      error: error.message,
    });
  }
});

// ambil semua user
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      message: "Data user berhasil diambil",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});