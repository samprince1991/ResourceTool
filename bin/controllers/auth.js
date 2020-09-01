const User = require('../models/user.js');
const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');
const customError = require('../custom/errors');
const jwt = require('jsonwebtoken');

const {
    tokenGenerator,
    random,
    message,
    compareTime
} = require('../custom/functions');

exports.signup = async (req, res) => {
    try {

        if (!req.body.email || !req.body.password || !req.body.fullName ) throw customError.dataInvalid;

        let userExists = await User.findOne({
            email: req.body.email
        })
        if (userExists) throw customError.userExists;

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);

        let user = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            password: hash
        });
        let savedUser = await user.save();

        res.status(200).json({
            error: false,
            details: {
                message: 'User Registered Sucessfully!',
                token: tokenGenerator(savedUser)
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code).json({
            error: true,
            details: error
        });
    }
}

exports.login = async (req, res) => {
    try {

        if (!req.body.email || !req.body.password ) throw customError.dataInvalid;

        let user = await User.findOne({
            email: req.body.email
        });
        if (!user) throw customError.userNotFound;

        const userValidated = await bcrypt.compare(req.body.password, user.password);
        if (!userValidated) throw customError.authFailed;

        res.status(200).json({
            error: false,
            details: {
                message: 'User Logged-in Sucessfully!',
                token: tokenGenerator(user)
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code).json({
            error: true,
            details: error
        });
    }
}

exports.loginWithOTP = async (req, res) => {
    try {

        if (!req.body.number || !req.body.otp || req.body.number.length != 10) throw customError.dataInvalid;

        let user = await User.findOne({
            number: req.body.number
        });
        if (!user) throw customError.userNotFound;

        if (user.OTP.code != req.body.otp || compareTime(moment.tz(Date.now(), 'ASIA/KOLKATA'), user.OTP.validTill) > 0) throw customError.authFailed;

        res.status(200).json({
            error: false,
            details: {
                message: 'User Logged-in Sucessfully!',
                token: tokenGenerator(user)
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code).json({
            error: true,
            details: error
        });
    }
}

exports.requestLoginWithOTP = async (req, res) => {
    try {

        if (!req.body.number || req.body.number.length != 10) throw customError.dataInvalid;

        let user = await User.findOne({ number: req.body.number });
        if (!user) throw customError.userNotFound;

        if (compareTime(moment.tz(Date.now(), 'ASIA/KOLKATA'), user.OTP.validTill) < 0) throw customError.badRequest;

        let code = random(4),
            validTill = moment.tz(new Date(Date.now() + process.env.OTPVALIDINMIN * 60000), 'ASIA/KOLKATA').toString(),
            messageText = `${code} is the OTP for the action initiated at ${process.env.PROJECTNAME}, this code is valid till ${validTill.split(' ')[4].slice(0, 5)}\n#HaveAGoodTime`

        if (!message(user.number, messageText)) throw customError.serverDown

        user.OTP = {
            code: code,
            validTill: validTill,
            messageSentAt: moment.tz(Date.now(), 'ASIA/KOLKATA').toString()
        }

        user.save();

        res.status(200).json({
            error: false,
            details: {
                message: 'OTP sent Successfully',
                validTill: moment.tz(new Date(Date.now() + 5 * 60000), 'ASIA/KOLKATA').toString()
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code).json({
            error: true,
            details: error
        });
    }
}

exports.resendOTP = async (req, res) => {
    try {
        let user = await User.findOne({ number: req.body.number });
        if (!user) throw customError.userNotFound;

        if (!user.OTP.code || compareTime(moment.tz(Date.now(), 'ASIA/KOLKATA'), user.OTP.messageSentAt) < 30) throw customError.badRequest;

        let = messageText = `${user.OTP.code} is the OTP for the action initiated at ${process.env.PROJECTNAME}, this code is valid till ${user.OTP.validTill.split(' ')[4].slice(0, 5)}\n#HaveAGoodTime`
        if (!message(user.number, messageText)) throw customError.serverDown

        user.OTP.messageSentAt = moment.tz(Date.now(), 'ASIA/KOLKATA').toString();
        user.save();

        res.status(200).json({
            error: false,
            details: {
                message: 'OTP RESENT Successfully',
                validTill: user.OTP.validTill
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code).json({
            error: true,
            details: error
        });
    }
}

exports.patchPassword = async (req, res) => {
    try {

        if (!req.body.newpassword) throw customError.dataInvalid;

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.newpassword, salt);

        req.user.password = hash;

        res.status(200).json({
            error: false,
            details: {
                message: 'Password Updated Sucessfully',
                token: tokenGenerator(req.user, true)
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code).json({
            error: true,
            details: error
        });
    }
}

exports.refresh = async (req, res) => {
    console.log("tests")
    try {

        let access = req.body.access,
            refresh = req.body.refresh;

        console.log(`refresh is ${refresh}`)
        console.log(`access is ${access}`)
        if (!access || !refresh) throw customError.dataInvalid;
        let decodedRefresh = jwt.verify(refresh, process.env.JWT_KEY_REFRESH),
            valid = false;

        req.user = await User.findOne({ _id: decodedRefresh._id });

        req.user.tokens.forEach((token, i) => {
            if (access == token.access && token.refresh == refresh) {
                req.user.tokens.splice(i, 1);
                return valid = true;
            }
        });
        if (!valid) throw customError.authFailed;
        res.status(200).json({
            error: false,
            details: {
                message: 'Token Refreshed Sucessfully!',
                token: tokenGenerator(req.user)
            }
        });

    } catch (error) {
        console.log(`***** ERROR : ${req.originalUrl} ${error}`);
        return res.status(error.code || 401).json({
            error: true,
            details: error || {
                code: 401,
                name: "Authorization Failed! - Devloper Defined Error!",
                message: "Uh oh! i can't tell you anymore #BruteForcers! alert"
            }
        });
    }

}