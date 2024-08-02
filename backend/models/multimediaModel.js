const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema;

const multimediaSchema = new Schema({
    filename: {type: String, required: true},

    contentType: {type: String, required: true}, // image, video, audio

    
})

// Create the model
module.exports = mongoose.model("Multimedia", multimediaSchema);