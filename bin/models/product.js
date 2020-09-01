var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
   name: String,
   serialNo: String,
   assetTag: String,
   model: String,
   vendor: String,
   category: String,
   location: String,
   manufacturer: String,
   purchaseCost: String,
   purchaseDate: { type: Date },
   warrenty: String,
   status:
   {
      group: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Dictionary"
      },
      item: String
   },
   
   remarks:
      [{
         remarksBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         text: String,
         createdAt: { type: Date, default: Date.now },
         status:
         {
            group: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Dictionary"
            },
            item: String
         }

      }],
      
   image: String,
   description: String,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Product", productSchema);