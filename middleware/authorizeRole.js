const { apiResponse } = require("../utils/apiResponse");

exports.authorizeRole = (...role) => {
  return (req, res, next) => {
    const access = req.user.safeData.role;
    if (role.includes(access)) {
      next();
    } else {
      apiResponse(res, 401, `access denied only ${role} can access`);
    }
  };
};
