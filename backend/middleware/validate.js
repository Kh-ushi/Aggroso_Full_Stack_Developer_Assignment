const ApiError = require("../utils/ApiError");
const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues.map((err) => err.message).join(", ");
      throw new ApiError(400, message);
    }
    return next(error);
  }
};

module.exports = { validate };

