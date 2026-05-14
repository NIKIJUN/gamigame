const Material = require("../models/Material");
const { successResponse, errorResponse } = require("../utils/response");

const createMaterial = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      content,
      category,
      material_type,
      level,
      estimated_time,
      points_reward,
      media_url,
    } = req.body;

    const existingMaterial = await Material.findOne({ slug });

    if (existingMaterial) {
      return errorResponse(res, 400, "Slug materi sudah digunakan", []);
    }

    const material = await Material.create({
      title,
      slug,
      description,
      content,
      category,
      material_type,
      level,
      estimated_time,
      points_reward,
      media_url,
      created_by: req.user ? req.user.id : null,
    });

    return successResponse(res, 201, "Materi berhasil dibuat", {
      material,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const { category, material_type, level, is_active } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (material_type) filter.material_type = material_type;
    if (level) filter.level = level;

    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }

    const materials = await Material.find(filter).sort({ createdAt: -1 });

    return successResponse(res, 200, "Daftar materi berhasil diambil", {
      materials,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);

    if (!material) {
      return errorResponse(res, 404, "Materi tidak ditemukan", []);
    }

    return successResponse(res, 200, "Detail materi berhasil diambil", {
      material,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return errorResponse(res, 404, "Materi tidak ditemukan", []);
    }

    return successResponse(res, 200, "Materi berhasil diperbarui", {
      material,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      return errorResponse(res, 404, "Materi tidak ditemukan", []);
    }

    return successResponse(res, 200, "Materi berhasil dihapus", {
      material,
    });
  } catch (error) {
    return errorResponse(res, 500, "Terjadi kesalahan server", [
      error.message,
    ]);
  }
};

module.exports = {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};