const bcrypt = require("bcrypt");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, 401, "Email atau password salah", []);
    }

    if (!user.is_active) {
      return errorResponse(res, 403, "Akun tidak aktif", []);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return errorResponse(res, 401, "Email atau password salah", []);
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
      username: user.username,
    });

    const userData = {
      id: user._id,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return successResponse(res, 200, "Login berhasil", {
      token,
      user: userData,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

module.exports = {
  login,
};