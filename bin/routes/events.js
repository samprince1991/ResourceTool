const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Operation = require("../models/operations");
const Event = require("../models/event");
const middleware = require("../middleware");
const customError = require('../custom/errors');
const { isLoggedIn, verifyToken, checkUserProduct, checkUserComment, isAdmin } = middleware; // destructuring assignment
router.get("/all", function (req, res) {
    try {
        let params = {};
        if (req.body.eventId) {
            params = { _id: req.body.eventId }
        }
        Event.find(params)
            .populate("status.group")
            .exec(function (err, allEvents) {
                if (err) {
                    res.status(404).json({
                        error: true,
                        details: err
                    });
                } else {
                    if (Array.isArray(allEvents) && allEvents.length) {
                        res.status(200).json({
                            error: false,
                            allEvents: allEvents
                        });
                    }
                    else {
                        res.status(200).json({
                            error: true,
                            details: customError.eventsNotFound
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
//CREATE - add new ops to DB
router.post("/", verifyToken, function (req, res) {
    try {
        console.log("ere")
        // console.log(req.body.name)
        // console.log(req.body.location)
        // console.log(req.body.category)
        // console.log(req.body.status)
        // console.log(req.body.dateIn)
        // console.log(req.body.dateOut)
        // console.log(req.body.description)
        // console.log(req.body.budget)
        if (!req.body.name || !req.body.location || !req.body.category || !req.body.budget ||
            !req.body.dateIn ||
            !req.body.dateOut ||
            !req.body.status ||
            !req.body.description
        ) throw customError.dataInvalid;
        console.log("er2e")

        let author = {
            id: req.user._id
        };
        console.log(`before split ${req.body.status}`)

        var statusArray = req.body.status.split(',');
        console.log(statusArray[0])

        // console.log()
        // let status = {
        //     id: statusArray[0],
        //     subId: statusArray[1]

        // }

        // console.log(status)
        let status = {
            group: {
                _id: statusArray[0]
            },
            item: statusArray[1]
        }
        console.log(status)
        let newEvent = {
            name: req.body.name,
            location: req.body.location,
            category: req.body.category,
            budget: req.body.budget,
            dateIn: req.body.dateIn,
            dateOut: req.body.dateOut,
            status: status,
            description: req.body.description,
            author: author
        };

        console.log(newEvent);
        Event.create(newEvent, function (err, newlyCreated) {
            if (err) {
                res.status(400).json({
                    error: true,
                    details: customError.couldNotCreateEvent
                });
            } else {
                res.status(200).json({
                    error: false,
                    details: "Event Added"
                });
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
