const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
// Define the schema for the model
const Schema = mongoose.Schema

const adminSchema = new Schema({
    email: {type: String, required: true}, // email for the admin user

    password: {type: String, required: true} // password for the admin user
})

// Static login method
adminSchema.statics.login = async function(userData){
    let errorFields = [];

    if (!userData.email){
        errorFields.push('Email');
    }

    if (!userData.password){
        errorFields.push('Password');
    }

    if (errorFields.length > 0){
        const errorMessage = "All fields must be filled";
        const error = new Error(errorMessage);
        error.fields = errorFields;
        throw error;
    }

    const admin = await this.findOne({email: userData.email});

    if (!admin) return null;

    const match = await bcrypt.compare(userData.password, admin.password);

    return match ? admin : null;
}

// Create the model
module.exports = mongoose.model("Admin", adminSchema)