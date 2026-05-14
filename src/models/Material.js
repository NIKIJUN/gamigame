const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["vocabulary", "grammar", "reading", "speaking", "listening", "writing"],
      required: true,
    },

    material_type: {
      type: String,
      enum: ["basic", "practice", "enrichment", "remedial"],
      default: "basic",
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    estimated_time: {
      type: Number,
      default: 15,
    },

    points_reward: {
      type: Number,
      default: 100,
    },

    media_url: {
      type: String,
      default: null,
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

module.exports = mongoose.model("Material", materialSchema);