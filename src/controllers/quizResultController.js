const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");
const { successResponse, errorResponse } = require("../utils/response");
const {
  getDecisionTreeRecommendation,
  calculateSkillScores,
} = require("../services/decisionTreeService");

const submitQuizResult = async (req, res) => {
  try {
    const { quiz_id, selected_answers } = req.body;

    const quiz = await Quiz.findById(quiz_id).populate("material");

    if (!quiz) {
      return errorResponse(res, 404, "Kuis tidak ditemukan", []);
    }

    if (!Array.isArray(selected_answers)) {
      return errorResponse(res, 400, "Format jawaban tidak valid", []);
    }

    if (selected_answers.length !== quiz.questions.length) {
      return errorResponse(res, 400, "Jumlah jawaban tidak sesuai dengan jumlah soal", []);
    }

    const answers = quiz.questions.map((question, index) => {
      const selectedAnswerIndex = selected_answers[index];
      const isCorrect = selectedAnswerIndex === question.correct_answer_index;

      return {
        question_index: index,
        selected_answer_index: selectedAnswerIndex,
        correct_answer_index: question.correct_answer_index,
        is_correct: isCorrect,
        skill_focus: question.skill_focus,
      };
    });

    const totalCorrect = answers.filter((answer) => answer.is_correct).length;
    const totalQuestions = quiz.questions.length;
    const score = Math.round((totalCorrect / totalQuestions) * 100);
    const earnedPoints = Math.round((score / 100) * quiz.total_points);

    const skillScores = calculateSkillScores(answers);

    const recommendation = getDecisionTreeRecommendation({
      score,
      vocabularyScore: skillScores.vocabularyScore,
      grammarScore: skillScores.grammarScore,
      readingScore: skillScores.readingScore,
      speakingScore: skillScores.speakingScore,
      listeningScore: skillScores.listeningScore,
      writingScore: skillScores.writingScore,
    });

    const result = await QuizResult.create({
      student: req.user ? req.user.id : req.body.student_id,
      quiz: quiz._id,
      material: quiz.material._id,
      answers,
      total_questions: totalQuestions,
      total_correct: totalCorrect,
      score,
      earned_points: earnedPoints,
      vocabulary_score: skillScores.vocabularyScore,
      grammar_score: skillScores.grammarScore,
      reading_score: skillScores.readingScore,
      speaking_score: skillScores.speakingScore,
      listening_score: skillScores.listeningScore,
      writing_score: skillScores.writingScore,
      recommendation,
    });

    await result.populate([
      { path: "quiz" },
      { path: "material" },
      { path: "student", select: "full_name username email role" },
    ]);

    return successResponse(res, 201, "Hasil kuis berhasil disimpan", {
      result,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getAllQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate("student", "full_name username email role")
      .populate("quiz")
      .populate("material")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, "Daftar hasil kuis berhasil diambil", {
      results,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getStudentQuizResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await QuizResult.find({ student: studentId })
      .populate("quiz")
      .populate("material")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, "Hasil kuis siswa berhasil diambil", {
      results,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getLatestStudentRecommendation = async (req, res) => {
  try {
    const { studentId } = req.params;

    const latestResult = await QuizResult.findOne({ student: studentId })
      .populate("quiz")
      .populate("material")
      .sort({ createdAt: -1 });

    if (!latestResult) {
      return errorResponse(res, 404, "Rekomendasi belum tersedia", []);
    }

    return successResponse(res, 200, "Rekomendasi terbaru berhasil diambil", {
      recommendation: latestResult.recommendation,
      latest_result: latestResult,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

module.exports = {
  submitQuizResult,
  getAllQuizResults,
  getStudentQuizResults,
  getLatestStudentRecommendation,
};