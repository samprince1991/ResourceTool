let express = require("express");
let router = express.Router();
let Dictionary = require("../models/dictionary")
let middleware = require("../middleware");
const customError = require('../custom/errors');
const dictionary = require("../models/dictionary");
let { isLoggedIn, verifyToken, checkUserProduct, checkUserComment, isAdmin } = middleware; // destructuring assignment
//INDEX - show all dictonary values
router.post("/all", function (req, res) {
    try {
        let params = {};
        if (req.body.name) {
            params = { name: req.body.name }
        }
        Dictionary.find(params, function (err, allDictionarys) {
            if (err) {
                res.status(404).json({
                    error: true,
                    details: err
                });
            } else {
                // if (!allDictionarys) 
                if (allDictionarys && allDictionarys.length > 0) {
                    res.status(200).json({
                        error: false,
                        allDictionarys: allDictionarys
                    });
                }
                else {
                    res.status(404).json({
                        error: true,
                        details: customError.dictionarysNotFound
                    });
                }
            }
        });
    }
    catch (error) {
        console.log(`inside err`)
        res.status(400).json({
            error: true,
            details: error
        });
    }
});
//CREATE - add new dictionary to DB
router.post("/", function (req, res) {
    try {
        if (!req.body.name || !req.body.color || !req.body.value) throw customError.dataInvalid;
        Dictionary.findOne({ name: req.body.name }, (err, response) => {
            if (response) {
                var isPresent = response.values.some(function (el) { return el.name === req.body.value });
                if (isPresent) {
                    res.status(200).json({
                        error: true,
                        details: "Item already exist"
                    });
                }
                else {
                    let colorClass = ""
                    switch (req.body.color) {
                        case "green":
                            colorClass = "success"
                            break;
                        case "red":
                            colorClass = "danger"
                            break;
                        case "yellow":
                            colorClass = "warning"
                            break;
                        case "blue":
                            colorClass = "primary"
                            break;
                        case "cyan":
                            colorClass = "info"
                            break;
                        default:
                            req.body.color = "black"
                            colorClass = "dark"
                    }
                    Dictionary.findOneAndUpdate({ name: req.body.name },
                        {
                            "$addToSet": {
                                values: { name: req.body.value, cssClass: { color: req.body.color, class: colorClass } }
                            },
                        },
                        { upsert: true, new: true }, (err, result) => {
                            if (err) {
                                res.status(200).json({
                                    error: false,
                                    details: customError.couldNotCreateDictionary
                                });
                            }
                            if (result) {
                                console.log(result)
                                res.status(200).json({
                                    error: false,
                                    details: "Dictionary item added"
                                });
                            }
                        })
                }
            }
            else {
                res.status(200).json({
                    error: true,
                    details: "dictionary does not exist"
                });
            }
        })
    }
    catch (error) {
        res.status(400).json({
            error: true,
            details: error
        });
    }
});


router.post("/seed", async (req, res) => {

    try {

        let statuses = [
            {
                name: "productStatus", title: "Product Status",
                values: [
                    { name: "WORKING", cssClass: { color: "green", class: "success" } },
                    { name: "REPAIR", cssClass: { color: "yellow", class: "warning" } },
                    { name: "RMA", cssClass: { color: "cyan", class: "info" } },
                    { name: "DEAD", cssClass: { color: "red", class: "danger" } }

                ]
            },
            {
                name: "eventStatus", title: "Event Status",
                values: [
                    { name: "APPROVED", cssClass: { color: "green", class: "success" } },
                    { name: "REJECTED", cssClass: { color: "red", class: "danger" } },
                    { name: "DRAFT", cssClass: { color: "black", class: "dark" } },


                ]
            },
            {
                name: "assignmentStatus", title: "Assignment Status",
                values: [
                    { name: "ASSIGNED", cssClass: { color: "green", class: "success" } },
                    { name: "RETURNED", cssClass: { color: "black", class: "dark" } },

                ]
            },
        ];

        statuses.map(async status => {
            dictionary.find({ "name": status.name }, async function (err, response) {
                if (response && response.length > 0) {
                }
                else {
                    await dictionary.create(status)
                }
            })

        })
        res.status(400).json({
            error: false,
            details: "Dictionary seeded / Already Exists"
        });
    }
    catch (error) {
        res.status(400).json({
            error: true,
            details: error
        });
    }
})
module.exports = router;
