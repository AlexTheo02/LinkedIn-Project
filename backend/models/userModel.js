const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { upload, handleFileUpload } = require("../middleware/fileUpload.js");
const Comment = require("./commentModel.js");

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

    professionalExperience: {type: String}, // String

    education: {type: String}, // String

    skills: {type: String}, // String

    recentConversations: {type: [{type: Schema.Types.ObjectId, ref: "Conversation"}], required: true}, // Array of Conversation ObjectIds

    network: {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true}, // Array of User ObjectIds

    publishedPosts: {type: [{type: Schema.Types.ObjectId, ref: "Post"}], required: true}, // Array of Post ObjectIds

    publishedJobListings: {type: [{type: Schema.Types.ObjectId, ref: "JobListing"}], required: true}, // Array of JobListing ObjectIds

    likedPosts: {type: [{type: Schema.Types.ObjectId, ref: "Post"}], required: true}, // Array of Post ObjectIds (posts the user has liked)
    
    // publishedComments: {type: [{type: Schema.Types.ObjectId, ref: "Comment"}], required: true}, // Array of Comment ObjectIds (comments the user has published)

    privateDetails: {type: [""], required: true}, // Array of strings of fields that are private, ex. ["dateOfBirth", "placeOfResidence"]

    appliedJobs: {type: [{type: Schema.Types.ObjectId, ref: "Job"}], required: true}, // Array of job ids that the user has applied to

    postNotifications: {type: [{type: Schema.Types.ObjectId, ref: "PostNotification"}], required: true}, // Array of Post Notification ids

    linkUpRequests: {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true}, // Array of Link Up Requests ids
})

function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Προσθέτει κενό πριν από κάθε κεφαλαίο γράμμα
        .replace(/^./, str => str.toUpperCase()) // Κάνει κεφαλαίο το πρώτο γράμμα
        .trim(); // Αφαιρεί τυχόν περιττά κενά
}

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
        password: 0,
        confirmPassword: 0
    };

    let isValid = true;

    // ---------------------------------------------------------------- Name validation
    if (userData.name) {
        validFields.name = 1;
    } else {
        validFields.name = 0;
        isValid = false;
    }

    // ---------------------------------------------------------------- Surname validation
    if (userData.surname) {
        validFields.surname = 1;
    } else {
        validFields.surname = 0;
        isValid = false;
    }

    // ---------------------------------------------------------------- Working Position validation
    if (userData.workingPosition) {
        validFields.workingPosition = 1;
    } else {
        validFields.workingPosition = 0;
        isValid = false;
    }

    // ---------------------------------------------------------------- Employment Organization validation
    if (userData.employmentOrganization) {
        validFields.employmentOrganization = 1;
    } else {
        validFields.employmentOrganization = 0;
        isValid = false;
    }

    // ---------------------------------------------------------------- Place of Residence validation
    if (userData.placeOfResidence) {
        validFields.placeOfResidence = 1;
    } else {
        isValid = false;
        validFields.placeOfResidence = 0;
        isValid = false;
    }
    // ---------------------------------------------------------------- Profile picture validation
    if (!userData.profilePicture){
        validFields.profilePicture = 0;
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
    if (dateOfBirth > sixteenYearsAgo){
        validFields.dateOfBirth = 2;
        isValid = false;
    }
    // Valid
    else{
        validFields.dateOfBirth = 1;
    }

    // ---------------------------------------------------------------- Password Validation
    if (!userData.password){
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

    if (!userData.confirmPassword){
        validFields.confirmPassword = 0;
        isValid = false;
    }
    else{
        validFields.confirmPassword = 1;
    }

    // Throw error with string message
    if (!isValid) {
        let errorMessage = "";
        let invalidFields = [];
    
        // Ελέγχεις αν υπάρχουν πεδία που είναι 0 (κενά)
        for (const [field, status] of Object.entries(validFields)) {
            if (status === 0) {
                invalidFields.push(formatFieldName(field));
            }
        }
    
        // Εάν υπάρχουν πεδία που είναι 0, προσθέτεις μήνυμα για κενά πεδία
        if (invalidFields.length > 0) {
            errorMessage = `Please fill the fields: ${invalidFields.join(", ")}`;
            const error = new Error(errorMessage);
            error.fields = invalidFields;
            throw error;
        }

        // Younger than 16 years old
        if (validFields['dateOfBirth'] === 2) {
            errorMessage = "You must be over 16 years old";
            const error = new Error(errorMessage);
            error.fields = ['Date Of Birth'];
            throw error;
        }

        // Αν δεν υπάρχουν κενά πεδία, ελέγχεις για μη έγκυρα πεδία (status 2)
        const possibleInvalidFIelds = ['email', 'phoneNumber']

        possibleInvalidFIelds.forEach(field => {
            if (validFields[field] === 2) {
                invalidFields.push(formatFieldName(field));
            }
        });

        if (invalidFields.length > 0) {
            errorMessage = `The following fields are not valid: ${invalidFields.join(", ")}`;
            const error = new Error(errorMessage);
            error.fields = invalidFields;
            throw error;
        }
        
        // Weak Password
        if (validFields['password'] === 2) {
            errorMessage = "Password is weak. Please insert a stronger password";
            const error = new Error(errorMessage);
            error.fields = ['Password'];
            throw error;
        }

        // Email in use
        if (validFields['email'] === 3) {
            errorMessage = "Email already in use";
            const error = new Error(errorMessage);
            error.fields = ['Email'];
            throw error;
        }

        // Phone Number in use
        if (validFields['phoneNumber'] === 3) {
            errorMessage = "Phone number already in use";
            const error = new Error(errorMessage);
            error.fields = ['Phone Number'];
            throw error;
        }

        // Password and Confirm password not the same
        if (validFields['password'] === 4) {
            errorMessage = "Password and Confirm password are not the same";
            const error = new Error(errorMessage);
            error.fields = ['Password', 'Confirm Password'];
            throw error;
        }
    }
    
    // Validation logic complete

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);

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
        professionalExperience: "",
        education: "",
        skills: "",
        recentConversations: [],
        network: [],
        publishedPosts: [],
        publishedJobListings: [],
        likedPosts: [],
        privateDetails: ["dateOfBirth", "phoneNumber"],
        appliedJobs: [],
        postNotifications: [],
        linkUpRequests: [],
    });

    return user;
}

// Static login method
userSchema.statics.login = async function(userData){
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

    const user = await this.findOne({email: userData.email});

    if (!user){
        const errorMessage = "Incorrect email or password";
        const error = new Error(errorMessage);
        error.fields = ['Email', 'Password'];
        throw error;
    }

    const match = await bcrypt.compare(userData.password, user.password);

    if (!match){
        const errorMessage = "Incorrect email or password";
        const error = new Error(errorMessage);
        error.fields = ['Email', 'Password'];
        throw error;
    }

    return user;
}

// Create the model
module.exports = mongoose.model("User", userSchema);