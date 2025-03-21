const mongoose = require("mongoose")

// Define the schema for the model
const Schema = mongoose.Schema

const jobSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},

    title: {type: String, required: true}, // String

    employer: {type: String, required: true}, // String

    location: {type: String, required: true}, // String

    description: {type: String, required: true}, // String

    requirements: {type: [String], required: true}, // Array of strings

    benefits: {type: [String], required: true}, // Array of strings

    responsibilities: {type: [String], required: true}, // Array of strings

    workingArrangement: {type: Number, required: true}, // Integer number

    employmentType: {type: Number, required: true}, // Integer number

    employeesRange: {type: Number, required: true}, // Integer number

    applicants: {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true} // Array of UserIds
    
}, { timestamps: true})

// Create the model
module.exports = mongoose.model("Job", jobSchema)