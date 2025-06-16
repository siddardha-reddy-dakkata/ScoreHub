const express = require('express');
const router = express.Router();

const otpController = require("../controllers/otpController");

router.post('/send-otp', otpController.createAccountOtp);

module.exports = router;