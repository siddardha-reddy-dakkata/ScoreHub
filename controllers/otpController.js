const OtpModel = require("../models/otpSchema");
const userSchema = require('../models/userSchema');
const sendOtpFile = require("../utils/sendOtp");

const getMail = require('../utils/getEmail');

const createAccountOtp = async (req, res) => {
  let { email, username } = req.body;
  try {
    if (!email && !username) {
      return res.status(500).json({ message: "Enter valid details"});
    }

    const userMail = email ? email : await getMail(username);
    console.log(userMail);

    if (!userMail) return res.status(200).json({ message: 'User not found'});

    

    await sendOtpFile.sendOTP(userMail);
    return res.status(200).json({ message: 'Otp sent successfuly'});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error occurred while sending OTP" });
  }
};

module.exports = {
  createAccountOtp,
};