const express = require("express");
const {
  signupController,
  signinController,
  forgotPasswordController,
  resetPasswordController,
  otpValidationController,
  resendOptController,
  findAllUsersController,
  userInfoController,
} = require("../../controller/auth.controller");
const { authorize } = require("../../middleware/authorize");
const { authorizeRole } = require("../../middleware/authorizeRole");
const router = express.Router();

router.post("/signup", signupController);

router.post("/signin", signinController);

router.post("/otp-validation", otpValidationController);

router.post("/resend-otp", resendOptController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

router.get(
  "/all-users",
  authorize,
  authorizeRole("admin"),
  findAllUsersController,
);

router.get(
  "/user-info/:id",
  authorize,
  authorizeRole("admin", "editor"),
  userInfoController,
);

module.exports = router;
