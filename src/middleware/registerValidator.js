const { body } = require("express-validator");

const registerValidator = [
  body("role")
    .notEmpty().withMessage("Role wajib dipilih")
    .isIn(["student", "teacher"]).withMessage("Role harus siswa atau guru"),

  body("full_name")
    .notEmpty().withMessage("Nama lengkap wajib diisi")
    .isLength({ min: 3, max: 100 }).withMessage("Nama lengkap harus 3–100 karakter"),

  body("username")
    .notEmpty().withMessage("Username wajib diisi")
    .isLength({ min: 3, max: 50 }).withMessage("Username harus 3–50 karakter")
    .matches(/^[A-Za-z0-9_]+$/).withMessage("Username hanya boleh huruf, angka, dan underscore"),

  body("email")
    .notEmpty().withMessage("Email wajib diisi")
    .isEmail().withMessage("Format email tidak valid"),

  body("password")
    .notEmpty().withMessage("Password wajib diisi")
    .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
    .matches(/[A-Z]/).withMessage("Password harus mengandung huruf kapital")
    .matches(/[0-9]/).withMessage("Password harus mengandung angka"),
];

module.exports = registerValidator;
