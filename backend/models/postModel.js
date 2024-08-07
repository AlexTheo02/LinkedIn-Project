const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const postSchema = new Schema({
    // author: {type: Schema.Types.ObjectId, ref: "User", required: true},

    caption: {type: String, required: true},

    multimediaURL: {type: String}, // google cloud URL

    multimediaType: {type: String},

    // Modify to {author, content}
    commentsList : {type: [{type: Schema.Types.ObjectId, ref: "PostNotification"}], required: true},

    likesList : {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true}
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("Post", postSchema)