const otpGenerator = require("otp-generator");
exports.otpGenerate = () => {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
