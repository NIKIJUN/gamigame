const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    question_text: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message: "Minimal harus ada 2 pilihan jawaban",
      },
    },

    correct_answer_index: {
      type: Number,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
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

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },

    questions: {
      type: [quizQuestionSchema],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Kuis harus memiliki minimal 1 soal",
      },
    },

    total_points: {
      type: Number,
      default: 100,
    },

    time_limit: {
      type: Number,
      default: 600,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);