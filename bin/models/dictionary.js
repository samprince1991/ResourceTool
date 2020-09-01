var mongoose = require("mongoose");
var dictionarySchema = new mongoose.Schema(
    {
        name: String,
        title: String,
        values: [{
            name: {
                type: String, uppercase: true
            },
            createdAt: { type: Date, default: Date.now },
            cssClass: { color: { type: String }, class: { type: String } }
        }]
    }

);




module.exports = mongoose.model("Dictionary", dictionarySchema);