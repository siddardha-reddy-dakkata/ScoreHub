const matchSchema = require('../../models/matchSchema');
const { create } = require('../../models/otpSchema');

const createMatch = async (req, res) => {
    const data = req.body;

    try {
        const newMatch = new matchSchema(data);
        await newMatch.save();

        return res.status(200).send({
            message: "Match Created Successfully"
        });
    }
    catch(e) {
        console.log("Error occurred ", e);
        return res.status(500).send("Error Occurred");
    }
}


module.exports = { 
    createMatch
}