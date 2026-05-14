const Quiz = require("../models/Quiz");
const Material = require("../models/Material");
const { successResponse, errorResponse } = require("../utils/response");

const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      material,
      questions,
      total_points,
      time_limit,
      is_active,
    } = req.body;

    const existingMaterial = await Material.findById(material);

    if (!existingMaterial) {
      return errorResponse(res, 404, "Materi terkait tidak ditemukan", []);
    }

    const quiz = await Quiz.create({
      title,
      description,
      material,
      questions,
      total_points,
      time_limit,
      is_active,
      created_by: req.user ? req.user.id : null,
    });

    await quiz.populate("material");

    return successResponse(res, 201, "Kuis berhasil dibuat", {
      quiz,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const { material, is_active } = req.query;

    const filter = {};

    if (material) filter.material = material;

    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }

    const quizzes = await Quiz.find(filter)
      .populate("material")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, "Daftar kuis berhasil diambil", {
      quizzes,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id).populate("material");

    if (!quiz) {
      return errorResponse(res, 404, "Kuis tidak ditemukan", []);
    }

    return successResponse(res, 200, "Detail kuis berhasil diambil", {
      quiz,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("material");

    if (!quiz) {
      return errorResponse(res, 404, "Kuis tidak ditemukan", []);
    }

    return successResponse(res, 200, "Kuis berhasil diperbarui", {
      quiz,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return errorResponse(res, 404, "Kuis tidak ditemukan", []);
    }

    return successResponse(res, 200, "Kuis berhasil dihapus", {
      quiz,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};