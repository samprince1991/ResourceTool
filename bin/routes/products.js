let express = require("express");
let router = express.Router();
let Product = require("../models/product");
const Operation = require("../models/operations");
let Comment = require("../models/comment");
let middleware = require("../middleware");
const customError = require('../custom/errors');
const { response } = require("express");
const moment = require('moment-timezone');
const multer = require('multer');
const { couldNotCreateOperationsNotAviailable } = require("../custom/errors");
const path = require('path');

//******* INITIALIZING MULTER FOR IMAGE UPLOADS *******\\
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/products'))
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])

    // cb(null, `${file.originalname}`); 
    
    
    //${new Date().toISOString().slice(0, 22).replace(/-/g, '').replace(/:/g, '').replace('.', '')}.${file.originalname.split('.').pop()}
  }
});




const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {

    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});


router.post('/uploadfile',   upload.single('productFile'),    (req, res, next) => {
  const file = req.file
  console.log(`file is ${file}`)
  if (!file) {
    res.status(400).json({
      error: true,
      details: "No file found"
    });
  }
  else {
    res.status(200).json({
      error: false,
      details: file
    });
  }

})





let { isLoggedIn, verifyToken, checkUserProduct, checkUserComment, isAdmin } = middleware; // destructuring assignment
//INDEX - show all products
router.post("/all", function (req, res) {
  try {
    let params = {};
    if (req.body.name) {
      params.name = req.body.name
    }
    if (req.body.category) {
      params.category = req.body.category
    }
    if (req.body.model) {
      params.model = req.body.model
    }
    Product.find(params)
      .populate("status.group")
      .exec(function (err, allProducts) {
        if (err) {
          res.status(404).json({
            error: true,
            details: err
          });
        } else {
          // if (!allProducts) 
          if (Array.isArray(allProducts) && allProducts.length) {
            res.status(200).json({
              error: false,
              allProducts: allProducts
            });
          }
          else {
            res.status(200).json({
              error: true,
              details: customError.productsNotFound
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
router.post("/models", function (req, res) {
  try {
    Product.distinct('model', { manufacturer: req.body.manufacturer }, function (err, allModels) {
      console.log(`all model si ${allModels}`)
      if (err) {
        res.status(404).json({
          error: true,
          details: err
        });
      } else {
        // if (!allModels) 
        if (Array.isArray(allModels) && allModels.length) {
          res.status(200).json({
            error: false,
            allModels: allModels
          });
        }
        else {
          res.status(200).json({
            error: true,
            details: customError.productsNotFound
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
router.post("/categories", function (req, res) {
  try {
    Product.distinct('category', {}, function (err, allCategories) {
      if (err) {
        res.status(404).json({
          error: true,
          details: err
        });
      } else {
        // if (!allCategories) 
        if (Array.isArray(allCategories) && allCategories.length) {
          res.status(200).json({
            error: false,
            allCategories: allCategories
          });
        }
        else {
          res.status(200).json({
            error: true,
            details: customError.productsNotFound
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
router.post("/manufacturer", function (req, res) {
  try {
    Product.distinct('manufacturer', { category: req.body.category }, function (err, allManufacturer) {
      if (err) {
        res.status(404).json({
          error: true,
          details: err
        });
      } else {
        // if (!allManufacturer) 
        if (Array.isArray(allManufacturer) && allManufacturer.length) {
          console.log(allManufacturer)
          res.status(200).json({
            error: false,
            allManufacturer: allManufacturer
          });
        }
        else {
          res.status(200).json({
            error: true,
            details: customError.productsNotFound
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
//CREATE - add new productd to DB
router.post("/", verifyToken, function (req, res) {
  try {
    // console.log(req.body.name);
    // console.log(req.body.status);
    // console.log(req.body.image);
    // console.log(req.body.category);
    console.log(req.body.assetTag)
    if (!req.body.name ||
      !req.body.vendor ||
      !req.body.status ||
      !req.body.category ||
      !req.body.model ||
      !req.body.manufacturer ||
      !req.body.assetTag
    ) throw customError.dataInvalid;
    var statusArray = req.body.status.split(',');
    let status = {
      group: {
        _id: statusArray[0]
      },
      item: statusArray[1]
    }
    let name = req.body.name;
    let serialNo = req.body.serialNo;
    let assetTag = req.body.assetTag;
    let model = req.body.model;
    let vendor = req.body.vendor;
    let category = req.body.category;
    let location = req.body.location;
    let manufacturer = req.body.manufacturer;
    let purchaseCost = req.body.purchaseCost;
    let purchaseDate = req.body.purchaseDate;
    let warrenty = req.body.warrenty;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
      id: req.user._id,
      username: req.user.username
    };
    let newProduct = {
      name: name,
      serialNo: serialNo,
      assetTag: assetTag,
      model: model,
      vendor: vendor,
      category: category,
      location: location,
      manufacturer: manufacturer,
      purchaseCost: purchaseCost,
      purchaseDate: purchaseDate,
      warrenty: warrenty,
      status: status,
      image: image,
      description: description,
      author: author
    };
    Product.create(newProduct, function (err, newlyCreated) {
      if (err) {
        throw customError.couldNotCreateProduct;
      } else {
        res.status(200).json({
          error: false,
          details: "Product Added"
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
router.put("/updateStatus", verifyToken, function (req, res) {
  try {
    if (!req.body.productId || !req.body.status) throw customError.dataInvalid;
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
    // let newData = { "status.item": status.item, remarks: remarks };
    Product.findByIdAndUpdate(req.body.productId, { $set: { "status.item": status.item }, $push: { remarks: remarks } }, { new: true }, (err, updatedProduct) => {
      if (err) {
        res.status(404).json({
          error: true,
          details: err
        });
      } else {
        res.status(200).json({
          error: false,
          details: "Product Status Changed"
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







// DELETE - removes product and its comments from the database
router.delete("/:id", function (req, res) {
  try {
    Operation.findOne({ product: req.params.id }, (err, opsFound) => {
      // console.log(opsFound)
      if (opsFound) {
        res.status(400).json({
          error: true,
          details: customError.couldNotDeleteProductProdutLocked
        });
      }
      else {
        Product.findByIdAndRemove(req.params.id, (err, response) => {
          if (err) {
            res.status(400).json({
              error: true,
              details: customError.couldNotDeleteProduct
            });
          }
          else {
            if (response === null) {
              res.status(400).json({
                error: true,
                details: customError.couldNotDeleteProductNotFound
              });
            }
            else {
              res.status(200).json({
                error: false,
                details: "Product Deleted"
              });
            }
          }
        })
      }
    })
  }
  catch (err) {
    res.status(400).json({
      error: true,
      details: customError.couldNotDeleteProduct
    });
  }
  // SHOW - shows more info about one product
  router.get("/:id", function (req, res) {
    //find the product with provided ID
    Product.findById(req.params.id).populate("comments").exec(function (err, foundProduct) {
      if (err || !foundProduct) {
        res.status(404).json({
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
  // PUT - updates product in the database
  router.put("/:id", isLoggedIn, checkUserProduct, function (req, res) {
    let newData = { name: req.body.name, category: req.body.category, image: req.body.image, description: req.body.description, totalQuantity: req.body.totalQuantity, availableQuantity: req.body.availableQuantity };
    Product.findByIdAndUpdate(req.params.id, { $set: newData }, function (err, product) {
      if (err) {
        res.status(200).json({
          "status": "error",
          "message": "could not update product",
          "data": err
        });
      }
      else {
        res.status(200).json({
          "status": "success",
          "message": "product update successful",
          "data": {}
        });
      }
    });
  });
});
module.exports = router;
