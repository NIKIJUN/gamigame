const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const errorResponse = (res, statusCode, message, errors = [], code = null) => {
  const body = { success: false, message, errors };
  if (code) body.code = code;
  return res.status(statusCode).json(body);
};

module.exports = { successResponse, errorResponse };
