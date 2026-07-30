const jwt = require("jsonwebtoken");
const { apiResponse } = require("../utils/apiResponse");
exports.authorize = (req, res, next) => {
  const authorize = req.headers.authorization;

  if (
    req.cookies.accessToken ||
    (req.headers && authorize?.startsWith("Bearer"))
  ) {
    const token = req.cookies.accessToken || authorize.split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) return apiResponse(res, 401, err.message);

      req.user = decoded;
      //only verified user can access
      if (!decoded.safeData.verify) {
        return apiResponse(res, 401, "user not verified");
      }

      next();
    });
  } else {
    apiResponse(res, 401, "invalid token type");
  }
};
