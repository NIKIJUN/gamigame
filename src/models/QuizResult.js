const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question_index: {
      type: Number,
      required: true,
    },

    selected_answer_index: {
      type: Number,
      required: true,
    },

    correct_answer_index: {
      type: Number,
      required: true,
    },

    is_correct: {
      type: Boolean,
      required: true,
    },

    skill_focus: {
      type: String,
      enum: ["vocabulary", "grammar", "reading", "speaking", "listening", "writing"],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const quizResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },

    answers: {
      type: [answerSchema],
      required: true,
    },

    total_questions: {
      type: Number,
      required: true,
    },

    total_correct: {
      type: Number,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    earned_points: {
      type: Number,
      required: true,
    },

    vocabulary_score: {
      type: Number,
      default: 0,
    },

    grammar_score: {
      type: Number,
      default: 0,
    },

    reading_score: {
      type: Number,
      default: 0,
    },

    speaking_score: {
      type: Number,
      default: 0,
    },

    listening_score: {
      type: Number,
      default: 0,
    },

    writing_score: {
      type: Number,
      default: 0,
    },

    recommendation: {
      type: {
        type: String,
        enum: ["enrichment", "practice", "remedial"],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      recommended_material_type: {
        type: String,
        enum: ["basic", "practice", "enrichment", "remedial"],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuizResult", quizResultSchema);