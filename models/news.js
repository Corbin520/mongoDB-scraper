
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var NewsSchema = new Schema ({

    title: {
        type: String,
        required: true,
        unique: true
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
    },

    // note is where we will store the notes
    note: {

        type: Schema.Types.ObjectId,

        // reference to the note
        ref: "Note"
    }
});

var News = mongoose.model("News", NewsSchema);

// Export the Article model
module.exports = News;