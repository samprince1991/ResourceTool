var Comment = require('../models/comment');
var Product = require('../models/product');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { message } = require('../custom/functions');
module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      res.status(400).json({
        "status": "error",
        "message": "Authenticaton Failure"
      });
    }
  },
  verifyToken: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]
      if (token === null) {
        res.status(401).json({
          error: true,
          details: { message: "No token Found" }

        });
      }
      else {
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
          if (err) {
            console.log(`TOken is ${token} err is ${err}`)
            res.status(401).json({
              error: true,
              details: { message: "Invalid token" }

            });
          }
          else {
            req.user = user;
            User.findOne({ '_id': req.user._id }, function (error, foundUser) {
              if (err || !foundUser) {
                res.status(200).json({
                  error: true,
                  details: err
                });
              }
              else {
                console.log("validated")
                next();
              }
            });
          }
        })
      }
    }
    catch (error) {
      console.log(error)
      res.status(401).json({
        "status": "error",
        "message": error
      });
    }
  },
  checkUserProduct: function (req, res, next) {
    Product.findById(req.params.id, function (err, foundProduct) {
      if (err || !foundProduct) {
        res.status(200).json({
          "status": "error",
          "message": "cannot find product",
          "data": err
        });
      } else if (foundProduct.author.id.equals(req.user._id) || req.user.isAdmin) {
        req.product = foundProduct;
        next();
      } else {
        res.status(200).json({
          "status": "error",
          "message": "No persmission to edit",
          "data": {}
        });
      }
    });
  },
  checkUserComment: function (req, res, next) {
    Comment.findById(req.params.commentId, function (err, foundComment) {
      if (err || !foundComment) {
        res.status(200).json({
          "status": "error",
          "message": "cannot find comment",
          "data": err
        });
      } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
        req.comment = foundComment;
        next();
      } else {
        res.status(200).json({
          "status": "error",
          "message": "No persmission to edit",
          "data": {}
        });
      }
    });
  },
  isAdmin: function (req, res, next) {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(200).json({
        "status": "error",
        "message": "Not admin to do that",
        "data": {}
      });
    }
  }
}