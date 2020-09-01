var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    name: String,
    image: String,
    dateIn: Date,
    dateOut: Date,
    location: String,
    description: String,
    category: String,
    active: Boolean,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    // status: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Dictionary"
    //     },
    //     subId : String 
    // },

    status:
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dictionary"
        },
        item: String
    },
    budget: Number
});

module.exports = mongoose.model("Event", eventSchema);