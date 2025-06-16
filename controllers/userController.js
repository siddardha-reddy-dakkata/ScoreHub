const userSchema = require("../models/userSchema");
const otpSchema = require("../models/otpSchema");
const getEmail = require("../utils/getEmail");
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const { username, email, fullname, password, otp } = req.body;

    try {
        // const checkUsername = awit userSchema.findOne()
        const user = await userSchema.findOne({
            $or: [{ username }, { email }]
        });

        if (user) {
            if (user.email == email) return res.status(200).json({message: "Email Already Exists"})
            return res.status(409).json({ message: "Username Already exists" }); // Fixed status code
        }

        const otpRecord = await otpSchema.findOne({ email });

        if (!otpRecord || otpRecord.otp != otp) {
            return res.status(400).json({ message: "Invalid otp" }); // Fixed status code
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userSchema({
            username: username,
            email: email,
            password: hashedPassword,
            fullname: fullname
        });

        const response = await newUser.save();
        
        await otpSchema.deleteOne({ _id: otpRecord._id });
        res.status(201).json({ message: "User created successfully" });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await userSchema.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" }); 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Successfully logged in", 
            user: {
                // id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                profilePicture: user.profilePicture
            }
        });
        
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" }); // Fixed status code
    }
};


const updatePassword = async (req, res) => {
    const { email, username, otp, password} = req.body;

    try {
        if ((!email && !username) || !otp) return res.status(200).send({message: "Enter valid details"});
        const userMail = email ? email : await getEmail(username);

        // console.log(userMail);
        if (!userMail) return res.status(200).send({message: "User not found"});

        const otpRecord = await otpSchema.findOne({"email": userMail});
        // console.log(otpRecord);
        if (!otpRecord || otpRecord.otp != otp) {
            return res.status(200).send({message: "Invalid or Expired OTP"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await userSchema.updateOne({email : userMail}, {password: hashedPassword})

        return res.status(200).send({message: "Password updated successfully"});
    }
    catch(e) {
        console.log("Error occurred: ", e);
        return res.status(500).send({message: "Internal server error"});
    }
}

module.exports = {
    createUser,
    loginUser,
    updatePassword
};