const jwt = require('jsonwebtoken');
const customError = require('../custom/errors');
const User = require('../models/user');

exports.check = async (req, res, next) => {
    try {

        let access = req.headers.authorization.split(" ")[1],
            decodedUser = jwt.verify(access, process.env.JWT_KEY),
            valid = false;

        req.user = await User.findOne({ _id: decodedUser._id });

        req.user.tokens.forEach((token) => {
            if (access == token.access) return valid = true;
        });
        if (!valid) throw customError.authFailed;

        next();

    } catch (error) {
        console.log(error);
        return res.status(error.code || 401).json({
            error: true,
            details: {
                code: error.code || 401,
                name: error.name || 'Authorization Failed!',
                message: `Uh oh! i can't tell you anymore #BruteForcers! alert`
            }
        });
    }
};