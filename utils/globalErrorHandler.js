const { apiResponse } = require("./apiResponse");

exports.globalErrorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    // Get the first error message
    const firstError = Object.values(err.errors)[0].message;
    return apiResponse(res, 400, firstError);
  }

  return apiResponse(res, 400, err.message || "Something went wrong");
};
