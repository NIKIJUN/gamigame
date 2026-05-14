const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(
  express.static(path.join(__dirname, "../public"), {
    index: false,
  })
);

// API routes
try {
  const materialRoutes = require("./routes/materialRoutes");
  const quizRoutes = require("./routes/quizRoutes");
  const quizResultRoutes = require("./routes/quizResultRoutes");

  app.use("/api/materials", materialRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/quiz-results", quizResultRoutes);
} catch (error) {
  console.log("API routes belum aktif:", error.message);
}

// Page routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});

app.get("/landing", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

app.get("/dashboard-student", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard-student.html"));
});

app.get("/dashboard-teacher", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard-teacher.html"));
});

app.get("/material", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/material.html"));
});

app.get("/quiz", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/quiz.html"));
});

module.exports = app;