const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const postSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true}, // User id

    caption: {type: String, required: true},

    multimediaURL: {type: String}, // google cloud URL

    multimediaType: {type: String}, // image, video, audio
    
    commentsList : {type: [{type: Schema.Types.ObjectId, ref: "Comment"}], required: true}, // List of commentIds

    likesList : {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true} // List of userIds
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("Post", postSchema)