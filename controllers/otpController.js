// const nodemailer = require('nodemailer');
const OtpModel = require("../models/otpSchema");
const otpSchema = require('../models/otpSchema');
const userSchema = require('../models/userSchema');


// cons
//   service: 'gmail',
//   port: 587,
//   secure: false,
//   auth: {
//     user: "siddardhareddy2005@gmail.com",
//     pass: process.env.EMAIL_PASSWORD,
//   }
// });






const sendOtp = async (req, res) => {
  let { email, username } = req.body;
  console.log(req.body);

  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    // const mailOptions = {
    //   from: "siddardhareddy2005@gmail.com",
    //   to: email,
    //   subject: 'Your OTP Code',
    //   text: `Your OTP code is ${otp}`
    // };

    // await transporter.sendMail(mailOptions);
    if (!email) {
      const user = await userSchema.findOne({username});
      if (!user) {
        res.status(500).send("User doesn't exists");
        return;
      }
      email = user.email;
    }

    const otpRecord = OtpModel.findOneAndUpdate({ email }, {email, username}, {upsert: true});
    let otpDB = new OtpModel({
      "email": email,
      "otp": otp
    })
    

    await otpDB.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error occurred while sending OTP" });
  }
};



const forgotPassword = async (req, res) => {
    const { username, email, otp} = req.body;
    try {
        const user = await OtpModel.findOne({
          "$or": [{username}, {email}],
          otp: otp
        });

        if (!user) {
          res.status()
        }
    }
    catch(e) {
        console.log(e);
        res.status(500).send({message: "Internal server error"});
    }
}



module.exports = {
  sendOtp
};