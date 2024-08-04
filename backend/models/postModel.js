const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const postSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},

    caption: {type: String, required: true},

    // multimedia: {type: multimedia??} // google cloud URL

    commentsList : {type: [{type: Schema.Types.ObjectId, ref: "PostNotification"}], required: true},

    likesList : {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true}
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("Post", postSchema)