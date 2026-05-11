const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menampilkan file dari folder public
app.use(express.static(path.join(__dirname, "../public")));

// Halaman login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Halaman register
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

// Halaman dashboard siswa
app.get("/dashboard-student", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard-student.html"));
});

// Halaman materi
app.get("/material", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/material.html"));
});

// Halaman kuis
app.get("/quiz", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/quiz.html"));
});

app.get("/dashboard-teacher", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard-teacher.html"));
});

module.exports = app;