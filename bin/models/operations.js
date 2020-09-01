var mongoose = require("mongoose");
var opsSchema = new mongoose.Schema({
   product:
   {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
   },
   event:
   {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
   },
   dateIn: Date,
   dateOut: Date,
   status:
   {
      group: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Dictionary"
      },
      item: String
   },
   totUsers: Number,
   listOfUsers: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
   ],
   description: String,
   assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   notification: [String],
   closeRemarks: String,
   quantity: Number,
   totalCost: Number,
   assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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
   createdAt: { type: Date, default: Date.now },

});
module.exports = mongoose.model("Operations", opsSchema);