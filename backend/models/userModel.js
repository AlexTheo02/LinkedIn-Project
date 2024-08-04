const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: [true, "Name is required"]},

    surname: {type: String, required: true},

    dateOfBirth: {type: Date, required: true},

    email: {type: String, required: true, unique: true},

    password: {type: String, required: true},

    phoneNumber: {type: String, required: true, unique: true},

    // profilePicture: {type: String, required: false}, // Change to type: multimedia... required true

    placeOfResidence: {type: String, required: true},

    workingPosition: {type: String, required: true},

    employmentOrganization: {type: String, required: true},

    professionalExperience: {type: [String]}, // Array of strings

    education: {type: [String]}, // Array of strings

    skills: {type: [String]}, // Array of strings

    recentConversations: {type: [{type: Schema.Types.ObjectId, ref: "Conversation"}], required: true}, // Array of Conversation ObjectIds, see https://www.geeksforgeeks.org/how-to-creating-mongoose-schema-with-an-array-of-objectid/

    network: {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true}, // Array of User ObjectIds

    publishedPosts: {type: [{type: Schema.Types.ObjectId, ref: "Post"}], required: true}, // Array of Post ObjectIds

    publishedJobListings: {type: [{type: Schema.Types.ObjectId, ref: "JobListing"}], required: true}, // Array of JobListing ObjectIds

    likedPosts: {type: [{type: Schema.Types.ObjectId, ref: "Post"}], required: true} // Array of Post ObjectIds (posts the user has liked)
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("User", userSchema)