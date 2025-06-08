const express = require('express');
const router = express.Router();


const otpController = require("../controllers/otpController");
router.post('/send-otp', otpController.sendOtp);



const userController = require("../controllers/userController");
router.post("/create-user", userController.createUser);
router.post("/login", userController.loginUser);


module.exports = router;