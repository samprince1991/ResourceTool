let express = require("express");
let router = express.Router();
let User = require("../models/user");
let middleware = require("../middleware");
const customError = require('../custom/errors');
const { couldNotCreateEvent } = require("../custom/errors");
let { isLoggedIn, verifyToken, checkUserProduct, checkUserComment, isAdmin } = middleware; // destructuring assignment
//INDEX - show all users

router.post("/all", function (req, res) {


    let params = {};
    if (req.body.userId) {
        params._id = req.body.userId
    }


    console.log(`params is ${params._id}`)
    console.log(`body is  is ${req.body.userId}`)


    try {
        User.find(params, "email fullName")
            // .select("email allUsers")
            .exec(function (err, allUsers) {
                if (err) {
                    res.status(404).json({
                        error: true,
                        details: err
                    });
                } else {
                    if (Array.isArray(allUsers) && allUsers.length) {
                        res.status(200).json({
                            error: false,
                            allUsers: allUsers
                        });
                    }
                    else {
                        res.status(200).json({
                            error: true,
                            details: customError.usersNotFound
                        });
                    }
                }
            });
    }
    catch (error) {
        res.status(400).json({
            error: true,
            details: error
        });
    }
});








module.exports = router;