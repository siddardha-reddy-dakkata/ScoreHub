const express = require('express');
const router = express.Router();

const app = express();



const otpController = require("../controllers/otpController");
router.post('/send-otp', otpController.createAccountOtp);



const userController = require("../controllers/userController");
router.post("/create-user", userController.createUser);
router.post("/login", userController.loginUser);

router.post("/update-password", userController.updatePassword);

const matchRoutes = require('./matchRoutes');
app.use('/', matchRoutes);



module.exports = router;