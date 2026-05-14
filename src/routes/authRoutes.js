const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const loginValidator = require("../middleware/loginValidator");
const registerValidator = require("../middleware/registerValidator");
const validate = require("../middleware/Validate");
const { authenticate } = require("../middleware/authMiddleware");
const { successResponse } = require("../utils/response");

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/verify/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

router.get("/me", authenticate, (req, res) => {
  return successResponse(res, 200, "Data user berhasil diambil", { user: req.user });
});

module.exports = router;
