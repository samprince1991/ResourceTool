const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

// ********** FUNCTIONS *************
let AccessLimit = (tokens) => {
    if (tokens.length > process.env.MAXCONCURRENTLOGINS) tokens.length = process.env.MAXCONCURRENTLOGINS;
    return tokens.length <= process.env.MAXCONCURRENTLOGINS;
}



const userSchema = Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    createdAt: {
        type: String,
        default: moment.tz(Date.now(), "Asia/Kolkata").toString()
    },
    tokens: {
        type: [{
            refresh: {
                type: String
            },
            access: {
                type: String
            }
        }],
        validate: [AccessLimit, `{PATH} exceeds the limit of ${process.env.MAXCONCURRENTLOGINS}`],
    },
    OTP: {
        code: Number,
        validTill: String,
        messageSentAt: String
    }

});

module.exports = mongoose.model('User', userSchema);

