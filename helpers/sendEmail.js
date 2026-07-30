const nodemailer = require("nodemailer");

exports.sendEmail = async (email , otp , type) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to: email,
    subject:  type === "signup" ||type ==="resentOpt" ?    "Your One-Time Password (OTP) for Verificatio" : "Your (OTP) for Password Reset", // subject line
    html: type === "signup" ||type ==="resentOpt" ?  `<!doctypehtml><meta charset=UTF-8><title>OTP Email</title><body style=margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif><table cellpadding=0 cellspacing=0 style="background-color:#f4f4f4;padding:30px 0"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style="background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.1)"width=600><tr><td align=center style=background-color:#4a90e2;color:#fff;padding:20px;font-size:24px;font-weight:700>Secure Verification<tr><td style=padding:30px;text-align:center;color:#333><p style=margin:0;font-size:16px>Use the following One-Time Password (OTP) to complete your verification:<div style="display:inline-block;background-color:#f0f8ff;border:2px dashed #4a90e2;padding:15px 25px;font-size:28px;font-weight:700;letter-spacing:5px;margin:20px 0;color:#4a90e2">${otp}</div><p style=margin:0;font-size:14px;color:#555>This OTP is valid for <strong>2 minutes</strong>. Do not share it with anyone.<tr><td align=center style=background-color:#f9f9f9;padding:15px;font-size:12px;color:#777>© 2026 Edujarr. All rights reserved.</table></table>` : `<!doctypehtml><meta charset=UTF-8><title>OTP Email</title><body style=margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif><table cellpadding=0 cellspacing=0 style="background-color:#f4f4f4;padding:30px 0"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style="background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.1)"width=600><tr><td align=center style=background-color:#4a90e2;color:#fff;padding:20px;font-size:24px;font-weight:700>Reset Password Verification<tr><td style=padding:30px;text-align:center;color:#333><p style=margin:0;font-size:16px>Use the following One-Time Password (OTP) to complete your verification:<div style="display:inline-block;background-color:#f0f8ff;border:2px dashed #4a90e2;padding:15px 25px;font-size:28px;font-weight:700;letter-spacing:5px;margin:20px 0;color:#4a90e2">${otp}</div><p style=margin:0;font-size:14px;color:#555>This OTP is valid for <strong>2 Minutes</strong>. Do not share it with anyone.<tr><td align=center style=background-color:#f9f9f9;padding:15px;font-size:12px;color:#777>© 2026 Edujarr. All rights reserved.</table></table>` ,
  });
};
