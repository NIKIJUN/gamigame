const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/jwt");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email");

// ── Register ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { role, full_name, username, email, password } = req.body;

    if (await User.findOne({ email })) {
      return errorResponse(res, 409, "Email sudah terdaftar", []);
    }

    if (await User.findOne({ username })) {
      return errorResponse(res, 409, "Username sudah digunakan", []);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      role,
      full_name,
      username,
      email,
      password: hashedPassword,
      is_verified: false,
      verification_token: verificationToken,
      verification_token_expires: verificationExpires,
    });

    try {
      await sendVerificationEmail(email, full_name, verificationToken);
    } catch (emailErr) {
      // Registration succeeded — don't roll back, just warn
      console.error("Gagal kirim email verifikasi:", emailErr.message);
      return successResponse(res, 201, "Pendaftaran berhasil, tetapi email verifikasi gagal dikirim. Hubungi admin.", {
        user: { id: user._id, email: user.email, role: user.role },
      });
    }

    return successResponse(res, 201, "Pendaftaran berhasil! Cek emailmu untuk verifikasi.", {
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [error.message]);
  }
};

// ── Verify Email ─────────────────────────────────────────────────────────────
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verification_token: token,
      verification_token_expires: { $gt: new Date() },
    }).select("+verification_token +verification_token_expires");

    if (!user) {
      return errorResponse(res, 400, "Token tidak valid atau sudah kadaluarsa", []);
    }

    user.is_verified = true;
    user.verification_token = undefined;
    user.verification_token_expires = undefined;
    await user.save();

    return successResponse(res, 200, "Email berhasil diverifikasi! Sekarang kamu bisa login.", {});
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [error.message]);
  }
};

// ── Resend Verification ───────────────────────────────────────────────────────
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 422, "Email wajib diisi", []);
    }

    const user = await User.findOne({ email }).select(
      "+verification_token +verification_token_expires"
    );

    if (!user) {
      // Return success to prevent email enumeration
      return successResponse(res, 200, "Jika email terdaftar, link verifikasi akan dikirim.", {});
    }

    if (user.is_verified) {
      return errorResponse(res, 400, "Email ini sudah diverifikasi. Silakan login.", []);
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    user.verification_token = newToken;
    user.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.full_name, newToken);

    return successResponse(res, 200, "Email verifikasi telah dikirim ulang. Cek inbox kamu.", {});
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [error.message]);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return errorResponse(res, 401, "Email atau password salah", []);
    }

    if (!user.is_verified) {
      return errorResponse(res, 403, "Email belum diverifikasi. Cek inbox atau kirim ulang link verifikasi.", [], "EMAIL_NOT_VERIFIED");
    }

    if (!user.is_active) {
      return errorResponse(res, 403, "Akun tidak aktif. Hubungi admin.", []);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return errorResponse(res, 401, "Email atau password salah", []);
    }

    const token = generateToken({ id: user._id, role: user.role, username: user.username });

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

    return successResponse(res, 200, "Login berhasil", { token, user: userData });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [error.message]);
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 422, "Email wajib diisi", []);
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user || !user.is_verified) {
      return successResponse(res, 200, "Jika email terdaftar dan sudah diverifikasi, link reset akan dikirim.", {});
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.reset_password_token = resetToken;
    user.reset_password_token_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam
    await user.save();

    try {
      await sendPasswordResetEmail(email, user.full_name, resetToken);
    } catch (emailErr) {
      console.error("Gagal kirim email reset password:", emailErr.message);
      return errorResponse(res, 500, "Gagal mengirim email. Coba lagi nanti.", []);
    }

    return successResponse(res, 200, "Link reset password telah dikirim ke email kamu.", {});
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [error.message]);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return errorResponse(res, 422, "Password baru minimal 8 karakter", []);
    }

    const user = await User.findOne({
      reset_password_token: token,
      reset_password_token_expires: { $gt: new Date() },
    }).select("+reset_password_token +reset_password_token_expires");

    if (!user) {
      return errorResponse(res, 400, "Token tidak valid atau sudah kadaluarsa. Minta link reset baru.", []);
    }

    user.password = await bcrypt.hash(password, 12);
    user.reset_password_token = undefined;
    user.reset_password_token_expires = undefined;
    await user.save();

    return successResponse(res, 200, "Password berhasil direset. Silakan login dengan password baru.", {});
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [error.message]);
  }
};

module.exports = { register, verifyEmail, resendVerification, login, forgotPassword, resetPassword };
