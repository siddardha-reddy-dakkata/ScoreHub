const nodemailer = require('nodemailer');

// Create transporter using nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false, // Use true for port 465
  auth: {
    user: "siddardhareddy2005@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  }
});

// Function to send OTP
const sendOtp = async (req) => {
  const { email, username } = req.body;
  console.log(req.body);

  const otp = Math.floor(1000 + Math.random() * 9000);

  const mailOptions = {
    from: "siddardhareddy2005@gmail.com",
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    if (response.accepted.includes(email)) {
      return { success: true, otp };
    }
    return { success: false };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

module.exports = { sendOtp };