const nodemailer = require("nodemailer");
const otpSchema = require("../models/otpSchema");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (to) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
        from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
    };

    // await transporter.sendMail(mailOptions);

    // const otpModel = new otpSchema({
    //     email : to,
    //     otp: otp
    // });

    // await otpModel.save();


    // Trying to fasten this (GPT CODe)
    // Promise.allSettled([
    //     transporter.sendMail(mailOptions),
    //     otpSchema.create({ email: to, otp }) // Slightly faster than new + save
    // ]).catch(err => console.error('OTP operations failed:', err));



    Promise.allSettled([
        transporter.sendMail(mailOptions),
        otpSchema.updateOne(
            { email: to },
            { otp, updatedAt: new Date() },
            { upsert: true } // Create a new record if it doesn't exist
        )
    ]).catch(err => console.error('OTP operations failed:', err));

};

module.exports = {
    sendOTP
}