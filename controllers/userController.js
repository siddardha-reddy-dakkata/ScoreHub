const userSchema = require("../models/userSchema");
const otpSchema = require("../models/otpSchema");

const createUser = async (req, res) => {
    const { username, email, password, otp } = req.body;

    try {
        const user = await userSchema.findOne({
            "$or": [{ username }, { email }]
        });

        if (user) {
            res.status(200).send({ message: "User Already exists" });
            return;
        }

        const otpRecord = await otpSchema.findOne({ email });

        if (!otpRecord || otpRecord.otp != otp) {
            res.status(200).send({ message: "Invalid otp" });
            return;
        }


        const newUser = new userSchema({
            username: username,
            email: email,
            password: password
        })

        const response = await newUser.save();
        res.status(201).send({ message: "User created successfully" })

    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Internal server error" });
    }
}


const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await userSchema.findOne({
            "$or": [{ username }, { email }],
            password: password
        });

        if (!user) {
            res.status(200).send({ message: "User Doesn't exists" });
            return;
        }

        res.status(200).send({message: "Successfully logged in", user: user});
    }
    catch (e) {
        console.log(e);
        res.status(200).send({message: "Error occurred"})
    }
}


module.exports = {
    createUser,
    loginUser
}