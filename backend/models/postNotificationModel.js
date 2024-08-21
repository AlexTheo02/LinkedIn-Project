const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const postNotificationSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},

    post_id: {type: Schema.Types.ObjectId, ref: "Post", required: true},

    isLike: {type: Boolean, required: true},

    commentContent: {type: String, required: false},

    isRead: {type: Boolean, required: true}
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("PostNotification", postNotificationSchema)