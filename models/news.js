
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var NewsSchema = new Schema ({

    title: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    saved: {
        required: false
    }
});



var News = mongoose.model("News", NewsSchema);

// Export the Article model
module.exports = News;