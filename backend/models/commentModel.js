const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const commentSchema = new Schema({
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true}, // Post id

    author: {type: Schema.Types.ObjectId, ref: "User", required: true}, // User id

    content: {type: String, required: true}, // String
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("Comment", commentSchema)