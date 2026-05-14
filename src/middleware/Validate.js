const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/response");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 422, errors.array()[0].msg, errors.array());
  }
  next();
};

module.exports = validate;
