const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    participant_1: {type: Schema.Types.ObjectId, ref: "User", required: true}, // user id

    participant_2: {type: Schema.Types.ObjectId, ref: "User", required: true}, // user id

    messageLog: [{
        sender: {type: Schema.Types.ObjectId, ref: "User", required:true}, // sender id
        receiver: {type: Schema.Types.ObjectId, ref: "User", required:true}, // receiver id
        content: {type: String, required:true}, // message content
        timestamp: {type: Date, default: Date.now, required:true} // message timestamp
    }] // List of {sender, receiver, content, timestamp}
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("Conversation", conversationSchema)