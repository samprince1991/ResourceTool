let express = require("express");
let router = express.Router();
let Product = require("../models/product");
const Operation = require("../models/operations");
const User = require("../models/user");
let Comment = require("../models/comment");
let middleware = require("../middleware");
const customError = require('../custom/errors');
const { response } = require("express");
const moment = require('moment-timezone');
const operations = require("../models/operations");
let { isLoggedIn, verifyToken, checkUserProduct, checkUserComment, isAdmin } = middleware; // destructuring assignment
//INDEX - get all statistics
router.post("/getStatistics", async function (req, res) {
  try {
    let params = {};
    // if (req.body.name) {
    //   params.name = req.body.name
    // }
    // if (req.body.category) {
    //   params.category = req.body.category
    // }
    // if (req.body.model) {
    //   params.model = req.body.model
    // }

    const totalProducts = await Product.find(params);
    const totalUsers = await User.find();
    const totalOperations = await Operation.find();

    res.status(200).json({
      error: false,
      dashboardStatistics: {
        totalProducts: totalProducts.length,
        totalUsers: totalUsers.length,
        totalOperations: totalOperations.length
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
module.exports = router;
