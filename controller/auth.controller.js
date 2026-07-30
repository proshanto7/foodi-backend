const { otpGenerate } = require("../helpers/otpGenerate");
const { sendEmail } = require("../helpers/sendEmail");
const userModel = require("../model/user.model");
const { apiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signupController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // generate otp
  const otp = otpGenerate();
  // convert password to hash
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new userModel({
    email,
    password: hashedPassword,
    name,
    otp,
    otpExpiry: Date.now() + 2 * 60 * 1000, // 2 minutes
  });

  await user.save();
  // send email
  sendEmail(email, otp, "signup");
  apiResponse(res, 201, "user created successfully", user);
});

exports.signinController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    apiResponse(res, 404, "user not found");
  } else {
    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const {
        createdAt,
        updatedAt,
        otp,
        otpExpiry,
        password,
        forgotPasswordOtp,
        forgotPasswordOtpExpiry,
        ...safeData
      } = user._doc; // exclude createdAt, updatedAt, forgotPasswordOtp, forgotPasswordOtpExpiry , optExpiry, otp and password from query results

      //signin token generate
      const token = jwt.sign({ safeData }, process.env.PRIVATE_KEY, {
        expiresIn: "1h",
      });

      res.cookie("accessToken", token, { maxAge: 60 * 60 * 1000 }); // set cookie

      //save token in safeData
      // safeData.token = token;

      apiResponse(res, 200, "singin successfully", safeData);
    } else {
      apiResponse(res, 400, "invalid password");
    }
  }
});

exports.otpValidationController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    apiResponse(res, 404, "user not found");
  } else {
    if (user.verify) {
      apiResponse(res, 409, "user already verified");
    } else {
      const cuttentTime = Date.now();

      if (user.otpExpiry > cuttentTime) {
        if (user.otp === otp) {
          user.otp = null;
          user.otpExpiry = null;
          user.verify = true;
          await user.save();

          apiResponse(res, 200, "otp verified successfully");
        } else {
          apiResponse(res, 400, "invalid otp");
        }
      } else {
        apiResponse(res, 401, "otp expired");
      }
    }
  }
});

exports.resendOptController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    apiResponse(res, 400, "user not found");
  } else {
    if (user.verify) {
      apiResponse(res, 400, "user already verified");
    } else {
      // generate otp
      const otp = otpGenerate();
      // send otp to email
      sendEmail(email, otp, "resentOpt");
      user.otp = otp;
      user.otpExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes
      await user.save();
      apiResponse(res, 200, "otp sent successfully");
    }
  }
});

exports.forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    apiResponse(res, 404, "user not found");
  } else {
    // generate otp
    const otp = otpGenerate();
    // send otp to email
    sendEmail(email, otp, null);
    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    apiResponse(res, 200, "otp sent successfully");
  }
});

exports.resetPasswordController = asyncHandler(async (req, res) => {
  const { email, newPassword, forgetPasswordOtp } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    apiResponse(res, 404, "user not found");
  } else {
    const currentTime = Date.now();
    if (user.forgotPasswordOtpExpiry > currentTime) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;
      user.forgotPasswordOtp = null;
      user.forgotPasswordOtpExpiry = null;
      await user.save();
      apiResponse(res, 200, "password reset successfully");
    } else {
      apiResponse(res, 401, "otp expired");
    }
  }
});

exports.findAllUsersController = asyncHandler(async (req, res) => {
  const users = await userModel.find({}).select("-createdAt -updatedAt"); //select all fields except createdAt and updatedAt
  apiResponse(res, 200, "users fetched successfully", users);
});
exports.userInfoController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) return apiResponse(res, 404, "user not found");
  apiResponse(res, 200, "user fetched successfully", user);
});
