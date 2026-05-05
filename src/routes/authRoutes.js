const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const loginValidator = require("../middleware/loginValidator");
const validate = require("../middleware/validate");

router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

const { authenticate } = require("../middleware/authMiddleware");

router.get("/me", authenticate, async (req, res) => {
  return successResponse(res, 200, "Data user berhasil diambil", {
    user: req.user,
  });
});
module.exports = router;
