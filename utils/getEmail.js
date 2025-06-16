const userSchema = require('../models/userSchema')

const getEmail = async (username) => {
    const user = await userSchema.findOne({ username }, { email: 1 });
    if (!user) {
        return false;
    }
    return user.email;
}


module.exports = getEmail; 