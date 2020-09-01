const jwt = require("jsonwebtoken");
const User = require("../models/user");


const tokenGenerator = (user, removeAll = false) => {
    try {

        let access = jwt.sign({ _id: user._id, type: 'access' }, process.env.JWT_KEY, { expiresIn: process.env.ACCESSEXPIRY }),
            refresh = jwt.sign({ _id: user._id, type: 'refresh' }, process.env.JWT_KEY_REFRESH, { expiresIn: process.env.REFRESHEXPIRY });

        if(removeAll) user.tokens = [];
        user.tokens.unshift({
            refresh: refresh,
            access: access
        });
        user.OTP = {};
        user.save();

        return {
            access: {
                token: access,
                expiryin: process.env.ACCESSEXPIRY
            },
            refresh: {
                token: refresh,
                expiryin: process.env.REFRESHEXPIRY
            }
        };;



    } catch (error) {
        console.log(error);
        return error;
    }
}

const random = (length) => {
    let code = Math.random().toString().split('.')[1].slice(0, length);
    if (code.length !== length) {
        code = random;
    }
    return code;
}

const message = (to, message) => {
    console.log(`${message} sent to ${to} via message`);
    return true//text.send(to, message);
};

const compareTime = (time1, time2, condition = 1) => {

    switch (condition) {
        case 1:
            return (new Date(time1) - new Date(time2)) / 1000;
    }


};

module.exports = { tokenGenerator, random, message, compareTime };