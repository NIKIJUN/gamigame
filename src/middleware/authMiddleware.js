const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Token tidak ditemukan", []);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, "User tidak ditemukan", []);
    }

    if (!user.is_active) {
      return errorResponse(res, 403, "Akun tidak aktif", []);
    }

    req.user = {
      id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    return errorResponse(res, 401, "Token tidak valid", []);
  }
};

module.exports = {
  authenticate,
};