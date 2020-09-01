const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Operation = require("../models/operations");
const middleware = require("../middleware");
const customError = require('../custom/errors');
const moment = require('moment-timezone');
const { isLoggedIn, verifyToken, checkUserProduct, checkUserComment, isAdmin } = middleware; // destructuring assignment
router.post("/all", function (req, res) {
    try {
        let params = {};
        if (req.body.eventId) {
            params = { event: { _id: req.body.eventId } }
        }
        if (req.body.oper) {
            params = { event: { _id: req.body.eventId } }
        }
        console.log(`params is ${JSON.stringify(params)}`)
        Operation.find(params)
            .populate("product", "name")
            .populate("assignedTo", "fullName")
            .populate("assignedBy", "fullName")
            .populate("event", "name")
            .populate("status.group")
            .populate("remarks.remarksBy", "fullName")
            .exec(function (err, allOperations) {
                if (err) {
                    res.status(404).json({
                        error: true,
                        details: err
                    });
                } else {
                    if (Array.isArray(allOperations) && allOperations.length) {
                        res.status(200).json({
                            error: false,
                            allOperations: allOperations
                        });
                    }
                    else {
                        res.status(200).json({
                            error: true,
                            details: customError.operationsNotFound
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
        console.log(`req user from ops ${req.user._id}`)
        // console.log(req.body.eventId)
        // console.log(req.body.assignedUserId)
        // console.log(req.body.productId)
        // console.log(req.body.status)
        // console.log(req.body.dateIn)
        // console.log(req.body.dateOut)
        // console.log(req.body.description)
        if (!req.body.eventId || !req.body.assignedUserId || !req.body.productId || !req.body.status ||
            !req.body.dateIn ||
            !req.body.dateOut ||
            !req.body.description) throw customError.dataInvalid;
        let productId = {
            _id: req.body.productId
        }
        let assignedUserId = {
            _id: req.body.assignedUserId
        }
        let eventId = {
            _id: req.body.eventId
        }
        let assignedBy = {
            _id: req.user._id
        }
        var statusArray = req.body.status.split(',');
        let status = {
            group: {
                _id: statusArray[0]
            },
            item: statusArray[1]
        }
        let newOps = {
            event: eventId,
            status: status,
            locationId: req.body.locationId,
            product: productId,
            dateIn: req.body.dateIn,
            dateOut: req.body.dateOut,
            totUsers: req.body.totUsers,
            description: req.body.description,
            closeRemarks: req.body.closeRemarks,
            quantity: req.body.quantity,
            totalCost: req.body.totalCost,
            assignedBy: assignedBy,
            assignedTo: assignedUserId
        };
        let dateNotAvailable = false;
        Operation.find({ product: productId }, (err, opsFound) => {
            if (err) {
                console.log("some errr finding operations by prodict id")
            }
            else {

                let newDateIn = moment(req.body.dateIn);
                let newDateOut = moment(req.body.dateOut);
                for (i = 0; i < opsFound.length; i++) {
                    let dateIn = moment(opsFound[i].dateIn)
                    let dateOut = moment(opsFound[i].dateOut)
                    if (newDateIn.isBetween(dateIn, dateOut, undefined, '[]') || newDateOut.isBetween(dateIn, dateOut, undefined, '[]') ) {
                        dateNotAvailable = true;
                        break;
                    }
                }
                if (dateNotAvailable) {
                    // console.log("found Ops data not available")

                    res.status(400).json({
                        error: true,
                        details: customError.opsNotCreatedPrdDateNotAvailable
                    });
                }
                else {
                    Product.findOneAndUpdate(
                        {
                            _id: req.body.productId,
                            // status: "AVAILABLE"
                        },
                        { new: true } //returns updated document
                    )
                        .populate("status.group")
                        .exec((err, response) => {
                            if (err) {
                                res.status(400).json({
                                    error: true,
                                    details: customError.couldNotCreateOperations
                                });
                            }
                            if (response === null) {
                                res.status(400).json({
                                    error: true,
                                    details: customError.couldNotCreateOperationsNotAviailable
                                });
                            }
                            else {
                                // let ProductStatus = response.status.group.values.find(o => o._id === name);
                                // console.log(`product status is ` + ProductStatus)
                                console.log(process.env.PRODUCT_ACCEPTED_STATUS)
                                let curentproductStatus = response.status.group.values.find(o => o.name === process.env.PRODUCT_ACCEPTED_STATUS);
                                if (curentproductStatus._id == response.status.item) {
                                    Operation.create(newOps, function (err, newlyCreated) {
                                        if (err) {
                                            res.status(400).json({
                                                error: true,
                                                details: customError.couldNotCreateOperations
                                            });
                                        } else {
                                            res.status(200).json({
                                                error: false,
                                                details: "Assigned Successfully"
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(404).json({
                                        error: true,
                                        details: customError.couldNotCreateOperationsNotAssignable
                                    });
                                }
                            }
                        });
                }
                // opsFound.forEach(ops => {
                //     // console.log(ops)
                //     let dateIn = moment(ops.dateIn)
                //     let dateOut = moment(ops.dateOut)
                //     console.log(`In date check if ${newDateIn} is between ${dateIn} - ${dateOut} -  ${newDateIn.isBetween(dateIn, dateOut, undefined, '[]')}  `);
                //     console.log(`Out date check if ${newDateOut} is between ${dateIn} - ${dateOut} -  ${newDateOut.isBetween(dateIn, dateOut, undefined, '[]')}  `);
                // })
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            details: error
        });
    }
});
// PUT - updates product in the database
router.put("/updateStatus", verifyToken, function (req, res) {
    try {
        if (!req.body.opsId || !req.body.status) throw customError.dataInvalid;
        let statusArray = req.body.status.split(',');
        let status = {
            group: {
                _id: statusArray[0]
            },
            item: statusArray[1]
        }
        let remarks = {
            remarksBy: {
                _id: req.user._id
            },
            text: req.body.remarks,
            status: status
        }
        // console.log(remarks)
        let newData = { "status.item": status.item, remarks: remarks };
        Operation.findByIdAndUpdate(req.body.opsId, { $set: { "status.item": status.item }, $push: { remarks: remarks } }, { new: true }, (err, updatedOperations) => {
            if (err) {
                res.status(404).json({
                    error: true,
                    details: err
                });
            } else {
                res.status(200).json({
                    error: false,
                    details: "Assignment Status Changed"
                });
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            details: error
        });
    }
});
// SHOW - shows more info about one product
router.get("/:id", function (req, res) {
    //find the product with provided ID
    Product.findById(req.params.id).populate("comments").exec(function (err, foundProduct) {
        if (err || !foundProduct) {
            res.status(200).json({
                "status": "error",
                "message": "could not find product",
                "message": err
            });
        }
        else {
            res.status(200).json({
                "status": "success",
                "message": "product found",
                "data": { product: foundProduct }
            });
        }
    });
});
// DELETE - removes product and its comments from the database
router.delete("/:id", isLoggedIn, checkUserProduct, function (req, res) {
    console.log(req.body);
    Comment.remove({
        _id: {
            $in: req.product.comments
        }
    },
        function (err) {
            if (err) {
                res.status(200).json({
                    "status": "error",
                    "message": "could not remove product",
                    "data": err
                });
            } else {
                req.product.remove(function (err) {
                    if (err) {
                        res.status(200).json({
                            "status": "error",
                            "message": "could not remove product",
                            "data": err
                        });
                    }
                    res.status(200).json({
                        "status": "success",
                        "message": "product deleted successfully",
                        "data": {}
                    });
                });
            }
        })
});
module.exports = router;
