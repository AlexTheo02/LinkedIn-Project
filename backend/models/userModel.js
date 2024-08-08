const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { upload, handleFileUpload } = require("../middleware/fileUpload.js");

// Define the schema for the model
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: true},

    surname: {type: String, required: true},

    dateOfBirth: {type: Date, required: true},

    email: {type: String, required: true, unique: true},

    password: {type: String, required: true},

    phoneNumber: {type: String, required: true, unique: true},

    profilePicture: {type: String, required: true},

    placeOfResidence: {type: String, required: true},

    workingPosition: {type: String, required: true},

    employmentOrganization: {type: String, required: true},

    professionalExperience: {type: [String]}, // Array of strings

    education: {type: [String]}, // Array of strings

    skills: {type: [String]}, // Array of strings

    recentConversations: {type: [{type: Schema.Types.ObjectId, ref: "Conversation"}], required: true}, // Array of Conversation ObjectIds

    network: {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true}, // Array of User ObjectIds

    publishedPosts: {type: [{type: Schema.Types.ObjectId, ref: "Post"}], required: true}, // Array of Post ObjectIds

    publishedJobListings: {type: [{type: Schema.Types.ObjectId, ref: "JobListing"}], required: true}, // Array of JobListing ObjectIds

    likedPosts: {type: [{type: Schema.Types.ObjectId, ref: "Post"}], required: true}, // Array of Post ObjectIds (posts the user has liked)

    privateDetails: {type: [""], required: true} // Array of strings of fields that are private, ex. ["dateOfBirth", "placeOfResidence"]
    
})

// Static register method
userSchema.statics.register = async function(userData) {

    // Validation logic

    // 0 -> empty, 1 -> valid, 2-> must be a valid x, 3 -> duplicate, 4-> passwords do not match
    let validFields = {
        profilePicture: 0,
        name: 0,
        surname: 0,
        dateOfBirth: 2,
        phoneNumber: 0,
        workingPosition: 0,
        employmentOrganization: 0,
        placeOfResidence: 0,
        email: 0,
        password: 0
    };

    let isValid = true;

    // ---------------------------------------------------------------- Name validation
    if (userData.name) {
        validFields.name = 1;
    } else {
        isValid = false;
        validFields.name = 0;
    }

    // ---------------------------------------------------------------- Surname validation
    if (userData.surname) {
        validFields.surname = 1;
    } else {
        isValid = false;
        validFields.surname = 0;
    }

    // ---------------------------------------------------------------- Working Position validation
    if (userData.workingPosition) {
        validFields.workingPosition = 1;
    } else {
        isValid = false;
        validFields.workingPosition = 0;
    }

    // ---------------------------------------------------------------- Employment Organization validation
    if (userData.employmentOrganization) {
        validFields.employmentOrganization = 1;
    } else {
        isValid = false;
        validFields.employmentOrganization = 0;
    }

    // ---------------------------------------------------------------- Place of Residence validation
    if (userData.placeOfResidence) {
        validFields.placeOfResidence = 1;
    } else {
        isValid = false;
        validFields.placeOfResidence = 0;
    }
    
    // ---------------------------------------------------------------- Profile picture validation
    if (!userData.profilePicture){
        validFields.profilePicture = 0;
    }
    // Not an image
    else if (!userData.profilePicture.mimetype.split('/')[0] === "image"){
        validFields.profilePicture = 2;
        isValid = false;
    }
    // Valid
    else {
        validFields.profilePicture = 1;
    }


    // ---------------------------------------------------------------- Email validation
    if(!userData.email){
        validFields.email = 0;
        isValid = false;
    }
    // Not an email
    else if(!validator.isEmail(userData.email)){
        validFields.email = 2;
        isValid = false;
    }
    // Already exists
    else if (await this.findOne({email: userData.email})){
        validFields.email = 3;
        isValid = false;
    }
    // Valid
    else {
        validFields.email = 1;
    }

    // ---------------------------------------------------------------- Phone Number validation
    if (!userData.phoneNumber){
        validFields.phoneNumber = 0;
        isValid = false;
    }
    // Not a phone number
    else if (!validator.isMobilePhone(userData.phoneNumber)){
        validFields.phoneNumber = 2;
        isValid = false;
    }
    // Already exists
    else if (await this.findOne({phoneNumber: userData.phoneNumber})){
        validFields.phoneNumber = 3;
        isValid = false;
    }
    // Valid
    else{
        validFields.phoneNumber = 1;
    }

    // ---------------------------------------------------------------- Date of Birth Validation
    // Younger than 16 years old
    const today = new Date();
    const sixteenYearsAgo = new Date();
    sixteenYearsAgo.setFullYear(today.getFullYear() - 16); // create the date 16 years ago

    const dateOfBirth = new Date(userData.dateOfBirth);

    // Compare dates, to validate if user is older than 16 years old
    if (validator.isAfter(dateOfBirth.toISOString().split('T')[0], sixteenYearsAgo.toISOString().split('T')[0])){
        validFields.dateOfBirth = 2;
        isValid = false;
    }
    // Valid
    else{
        validFields.dateOfBirth = 1;
    }

    // ---------------------------------------------------------------- Password Validation
    if (!userData.password || !userData.confirmPassword){
        validFields.password = 0;
        isValid = false;
    }
    // Passwords do not match
    else if(userData.password != userData.confirmPassword){
        validFields.password = 4;
        isValid = false;
    }
    // Not a strong password
    else if(!validator.isStrongPassword(userData.password)){
        validFields.password = 2;
        isValid = false;
    }
    // Valid
    else {
        validFields.password = 1;
    }

    // Throw error with string message
    if (!isValid){
        console.log(JSON.stringify(validFields));
        throw Error(JSON.stringify(validFields));
    }


    // Validation logic complete

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt)

    // Upload profile picture to google cloud storage

    const profilePictureURL = await handleFileUpload(userData.profilePicture);
    console.log("Profile picture uploaded successfuly",profilePictureURL);

    // Create user object
    const user = await this.create({
        name: userData.name,
        surname: userData.surname,
        dateOfBirth: userData.dateOfBirth,
        email: userData.email,
        password: hash,
        phoneNumber: userData.phoneNumber,
        profilePicture: profilePictureURL,
        placeOfResidence: userData.placeOfResidence,
        workingPosition: userData.workingPosition,
        employmentOrganization: userData.employmentOrganization,
        professionalExperience: [],
        education: [],
        skills: [],
        recentConversations: [],
        network: [],
        publishedPosts: [],
        publishedJobListings: [],
        likedPosts: [],
        // Set all fields to private initialy
        privateDetails: [
            "dateOfBirth", "phoneNumber", "placeOfResidence",
            "professionalExperience", "education", "skills"
        ]
    });

    // console.log(user)
    return user;
}

// Create the model
module.exports = mongoose.model("User", userSchema);