const User = require("../models/userModel.js")
const Admin = require("../models/adminModel.js")
const mongoose = require("mongoose")
const jwb = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { deleteFile, handleFileUpload } = require("../middleware/fileUpload.js")
const Comment = require("../models/commentModel.js")

// Get all users or users based on search
const getAllUsers = async (request, response) => {
    const searchTerm = request.query.searchTerm
    // Get all users
    if (!searchTerm){
        const users = await User.find({});
        response.status(200).json(users);
    }
    // Get users based on search
    else{
        try {
            const users = await User.find();
            const filteredUsers = users.filter(user => {
                const fullName = `${user.name} ${user.surname}`.toLowerCase(); // Combine name and surname
                return fullName.includes(String(searchTerm).toLowerCase()); // Check if included in searchTerm
            }).slice(0, 10); // First 10 results
    
            response.status(200).json(filteredUsers);
        } catch (error) {
            response.status(500).json({ error: 'Internal server error' });
        }
    }
}

// Get a single user
const getUserById = async (request, response) => {
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "User not found"})
    }

    const user = await User.findById(id);

    // User does not exist
    if (!user) {
        return response.status(404).json({error: "User not found"})
    }
    
    response.status(200).json(user);
}

// Get a user by a specific field
const getUser = async (request, response) => {
    const {fieldName, fieldValue} = request.query;
    
    const allowedFields = [
        "name", "surname", "dateOfBirth", "email",
        "phoneNumber", "placeOfResidence", "workingPosition",
        "employmentOrganization", "professionalExperience",
        "education",  "skills",  "recentConversations",
        "network", "publishedPosts", "publishedJobListings",
        "likedPosts"
    ];

    if (!allowedFields.includes(fieldName)){
        return response.status(400).json({error: "Invalid field name"})
    }

    try {
        // Generate query
        const query = {};
        query[fieldName] = fieldValue;

        const user = await User.find(query)

        // User does not exist
        if (user.length === 0) {
            return response.status(404).json({error: "User not found"})
        }
        
        response.status(200).json(user);
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// Confirm login password
const confirmPassword = async(request, response) => {
    const {password} = request.body;

    // Get logged in user and their password
    const loggedInUserId = request.user.id;
    const userPassword = await User.findById(loggedInUserId).select("password");

    const match = await bcrypt.compare(password, userPassword.password);

    if (!match){
        return response.status(400).json({error: "Incorrect password"});
    }

    response.status(200).json({message: "Password confirm successful"});
}

// Change email
const changeEmail = async (request, response) => {
    const {email} = request.body;
    
    const emailLowercase = email.toLowerCase()

    try {
        // Get logged in user and their userData
        const loggedInUserId = request.user.id;
        const userData = await User.findById(loggedInUserId);

        if (!emailLowercase){
            return response.status(400).json({error: "Email address cannot be empty"})
        }

        // Not a valid email address
        if (!validator.isEmail(emailLowercase)){
            return response.status(400).json({error: "Invalid email address", email: emailLowercase});
        }

        // Email is the same as before
        if (emailLowercase === userData.email){
            return response.status(200).json({message: "Email is the same as current one", email: emailLowercase});
        }

        // Email already exists
        if (await User.findOne({email: emailLowercase})){
            return response.status(400).json({error: "Email already in use", email: emailLowercase});
        }

        // Change email address
        userData.email = emailLowercase;

        // Save to db
        await userData.save();
        response.status(200).json({message: "Email successfuly changed", email: emailLowercase});
        
    } catch(error){
        console.error("Error changing email ", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

// Change password
const changePassword = async (request, response) => {
    const {password, confirmPassword} = request.body;

    try {
        // Get user and their userData
        const loggedInUserId = request.user.id;
        const userData = await User.findById(loggedInUserId);
        
        // Password(s) are empty
        if (!password || !confirmPassword){
            return response.status(400).json({error: "Password field(s) cannot be empty"});
        }

        // Passwords do not match
        if (password !== confirmPassword){
            return response.status(400).json({error: "Passwords do not match"});
        }

        // Not a valid strong password
        if (!validator.isStrongPassword(password)){
            return response.status(400).json({error: "Invalid strong password"});
        }

        // Password is the same as before
        if (await bcrypt.compare(password, userData.password)){
            return response.status(200).json({message: "Password is the same as current one"});
        }

        // Change password address
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        userData.password = hash;

        // Save to db
        await userData.save();
        response.status(200).json({message: "Password successfuly changed"})
        
    } catch(error){
        console.error("Error changing password ", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}


// Publish a Job
const publishJob = async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Job not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Check if the job is already published
        if (user.publishedJobListings.includes(id)) {
            return response.status(400).json({ error: "Job already published" });
        }

        user.publishedJobListings.push(id);
        await user.save();

        response.status(200).json({ message: "User published job" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Publish a post
const publishPost = async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Post not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Check if the post is already published
        if (user.publishedPosts.includes(id)) {
            return response.status(400).json({ error: "Post already published" });
        }

        user.publishedPosts.push(id);
        console.log("Adding post to user")
        await user.save();

        response.status(200).json({ message: "User published Post" });
    } catch (error) {
        console.error(error.message)
        response.status(400).json({ error: error.message });
    }
}

// View post interaction
const viewInteraction = async (request, response) => {
    const { id } = request.params;  // Post id
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Post not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        if (!user.postInteractions.includes(id)) user.postInteractions.push(id);

        await user.save();

        response.status(200).json({ message: "User liked Post" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Like a post
const toggleLikePost = async (request, response) => {
    const { id } = request.params;  // Post id
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Post not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Check if the post is already liked
        if (user.likedPosts.includes(id)) {
            // Remove post from likedPosts list
            user.likedPosts = user.likedPosts.filter(postId => postId.toString() !== id.toString())
        }
        else{
            user.likedPosts.push(id);
        }
        
        if (!user.interactionSource){
            user.interactionSource = true;
            user.postInteractions = [];
        }

        if (!user.postInteractions.includes(id)) user.postInteractions.push(id);

        await user.save();

        response.status(200).json({ message: "User liked Post" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Publish comment
const publishComment = async (request, response) => {
    const { id } = request.params;  // Comment id
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Comment not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Check if the comment is already published
        if (user.publishedComments.includes(id)) {
            return response.status(400).json({ error: "Comment already published" });
        }
        
        user.publishedComments.push(id);

        if (!user.interactionSource){
            user.interactionSource = true;
            user.postInteractions = [];
        }

        const comment = await Comment.findById(id)

        if (!user.postInteractions.includes(comment.post)) user.postInteractions.push(comment.post);

        await user.save();

        response.status(200).json({ message: "User published comment" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

const logJobInteraction = async(request, response) => {
    const { id } = request.params;  // Job id
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Job not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({error: "User not found"})
        }

        if (user.jobInteractions.includes(id)) {
            return response.status(200).json({message: "User has already interacted with this job"});
        }
        user.jobInteractions.push(id);
        await user.save();

        response.status(200).json({message: "User-Job interaction logged successfuly"});
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// Apply for job
const applyJob = async (request, response) => {
    const { id } = request.params;  // Job id
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Job not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Check if the user has already applied
        if (user.appliedJobs.includes(id)) {
            return response.status(200).json({ message: "User has already applied for this job" });
        }

        user.appliedJobs.push(id);
        await user.save();

        response.status(200).json({ message: "Applied for the job successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Remove apply for a job
const removeApplyJob = async (request, response) => {
    const { id } = request.params;  // Job id
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Job not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        user.appliedJobs = user.appliedJobs.filter(appliance => appliance.toString() !== id);

        await user.save();

        response.status(200).json({ message: "Application removed successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Connection Request
const requestConnection = async (request, response) => {
    const { id } = request.params;  
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Check if the request already exists
        if (user.linkUpRequests.includes(loggedInUserId)) {
            return response.status(400).json({ error: "Connection request already sent" });
        }

        user.linkUpRequests.push(loggedInUserId);
        await user.save();

        response.status(200).json({ message: "Connection request sent successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Remove connection
const removeRequestConnection = async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        user.linkUpRequests = user.linkUpRequests.filter(request => request.toString() !== loggedInUserId);

        await user.save();

        response.status(200).json({ message: "Connection removed successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Remove connection
const removeConnection = async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        user.network = user.network.filter(connection => connection.toString() !== loggedInUserId);

        await user.save();

        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser) {
            return response.status(404).json({ error: "User not found" });
        }

        loggedInUser.network = loggedInUser.network.filter(connection => connection.toString() !== id);

        await loggedInUser.save();

        response.status(200).json({ message: "Connection removed" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Accept Request
const acceptRequest = async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "User not found" });
    }

    try {
        // Logged in user connects with user
        const loggedInuser = await User.findById(loggedInUserId);
        if (!loggedInuser) {
            return response.status(404).json({ error: "User not found" });
        }

        loggedInuser.linkUpRequests = loggedInuser.linkUpRequests.filter(request => request.toString() !== id);

        loggedInuser.network.push(id);

        await loggedInuser.save();

        // User connects with logged in user
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        user.network.push(loggedInUserId);

        await user.save();

        response.status(200).json({ message: "Connection accepted successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Decline Request
const declineRequest = async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        user.linkUpRequests = user.linkUpRequests.filter(request => request.toString() !== id);

        await user.save();

        response.status(200).json({ message: "Connection removed successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Post Notification to user's notifications
const postNotify = async (request, response) => {
    const { notificationid, id } = request.params;  // Notification id and Author id

    if (!mongoose.Types.ObjectId.isValid(notificationid)) {
        return response.status(404).json({ error: "Notification not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "User not found" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        user.postNotifications.push(notificationid);

        await user.save();

        response.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Adds a whitespace before every capital letter
        .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
        .trim(); // Remove trailing and leading whitespace
}

// Validation function
async function validateUserData(userData, userId = null) {
    let validFields = {
        name: 0,
        surname: 0,
        dateOfBirth: 2,
        phoneNumber: 0,
        workingPosition: 0,
        employmentOrganization: 0,
        placeOfResidence: 0
    };

    let isValid = true;

    // Name validation
    if (userData.name) validFields.name = 1;
    else { validFields.name = 0; isValid = false; }

    // Surname validation
    if (userData.surname) validFields.surname = 1;
    else { validFields.surname = 0; isValid = false; }

    // Working Position validation
    if (userData.workingPosition) validFields.workingPosition = 1;
    else { validFields.workingPosition = 0; isValid = false; }

    // Employment Organization validation
    if (userData.employmentOrganization) validFields.employmentOrganization = 1;
    else { validFields.employmentOrganization = 0; isValid = false; }

    // Place of Residence validation
    if (userData.placeOfResidence) validFields.placeOfResidence = 1;
    else { validFields.placeOfResidence = 0; isValid = false; }

    // Phone Number validation
    if (!userData.phoneNumber) {
        validFields.phoneNumber = 0; isValid = false;
    } else if (!validator.isMobilePhone(userData.phoneNumber)) {
        validFields.phoneNumber = 2; isValid = false;
    } else {
        // Check for unique phone number
        const existingUser = await User.findOne({ phoneNumber: userData.phoneNumber });
        if (existingUser && existingUser._id.toString() !== userId) {
            validFields.phoneNumber = 3; isValid = false;
        } else {
            validFields.phoneNumber = 1;
        }
    }

    // Date of Birth Validation
    const today = new Date();
    const sixteenYearsAgo = new Date();
    sixteenYearsAgo.setFullYear(today.getFullYear() - 16);
    const dateOfBirth = new Date(userData.dateOfBirth);

    if (dateOfBirth > sixteenYearsAgo) {
        validFields.dateOfBirth = 2; isValid = false;
    } else {
        validFields.dateOfBirth = 1;
    }

    if (!isValid) {
        let errorMessage = "";
        let invalidFields = [];

        for (const [field, status] of Object.entries(validFields)) {
            if (status === 0) invalidFields.push(formatFieldName(field));
        }

        if (invalidFields.length > 0) {
            errorMessage = `Please fill the fields: ${invalidFields.join(", ")}`;
            const error = new Error(errorMessage);
            error.fields = invalidFields;
            throw error;
        }

        if (validFields['dateOfBirth'] === 2) {
            errorMessage = "You must be over 16 years old";
            const error = new Error(errorMessage);
            error.fields = ['Date Of Birth'];
            throw error;
        }

        if (validFields['phoneNumber'] === 2) {
            errorMessage = 'Phone Number is not valid';
            const error = new Error(errorMessage);
            error.fields = invalidFields;
            throw error;
        }

        if (validFields['phoneNumber'] === 3) {
            errorMessage = "Phone number already in use";
            const error = new Error(errorMessage);
            error.fields = ['Phone Number'];
            throw error;
        }
    }
}

// Update a user
const updateUser = async (request, response) => {
    const { id } = request.params;

    const userBodyData = {
        ...request.body,
        professionalExperience: JSON.parse(request.body.professionalExperience || "[]"),
        education: JSON.parse(request.body.education || "[]"),
        skills: JSON.parse(request.body.skills || "[]"),
        privateDetails: JSON.parse(request.body.privateDetails || "[]")
    };

    const profilePicture = request.file ? await handleFileUpload(request.file) : null;

    const userData = profilePicture ? {profilePicture, ...userBodyData} : userBodyData;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "User not found"});
    }

    try {
        await validateUserData(request.body, id);

        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        const oldProfilePic = profilePicture ? user.profilePicture : null;

        // Find user by id and update
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { ...userData },
            { new: true } // Return the updated document
        );

        // User does not exist
        if (!updatedUser) {
            return response.status(404).json({ error: "User not found" });
        }

        if (oldProfilePic){
            deleteFile(oldProfilePic);
        }

        // User exists, send back updated user
        response.status(200).json(updatedUser);
    } catch (error) {
        // If error contains validFields
        if (error.fields) {
            response.status(401).json({
                error: error.message,
                errorFields: error.fields
            });
        } 
        else {
            // Other errors
            response.status(400).json({error: error.message});
        }
    }
};

const createToken = (id) => {
    return jwb.sign({id}, process.env.SECRET, { expiresIn: '3d' })
}

// Login user
const loginUser = async (request, response) => {
    // Grab userData from the request body
    const userData = request.body

    
    // Login the user
    try {
        const adminUser = await Admin.login(userData);
        if (adminUser){
            const token = createToken(adminUser._id);
    
            return response.status(200).json({ userId: adminUser._id, token: token, admin: true, interactionSource: false });
        }
        const user = await User.login(userData);

        const token = createToken(user._id);

        response.status(200).json({ userId: user._id, token: token, admin: false, interactionSource: user.interactionSource });
    } catch (error) {
        // If error contains validFields
        if (error.fields) {
            response.status(401).json({
                error: error.message,
                errorFields: error.fields
            });
        } 
        else {
            // Other errors
            response.status(400).json({error: error.message});
        }
    }
}

// Register user
const registerUser = async (request, response) => {
    // Grab userData from the request body
    const userBodyData = request.body
    const profilePicture = request.file;
    const userData = {profilePicture, ...userBodyData}

    // Create the user
    try {
        const user = await User.register(userData);

        const token = createToken(user._id);

        response.status(200).json({ userId: user._id, token: token, admin: false, interactionSource: false });
    } catch (error) {
        // If error contains validFields
        if (error.fields) {
            response.status(401).json({
                error: error.message,
                errorFields: error.fields
            });
        } 
        else {
            // Other errors
            response.status(400).json({error: error.message});
        }
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUser,
    confirmPassword,
    changeEmail,
    changePassword,
    publishJob,
    publishPost,
    viewInteraction,
    toggleLikePost,
    publishComment,
    logJobInteraction,
    applyJob,
    removeApplyJob,
    requestConnection,
    removeRequestConnection,
    removeConnection,
    acceptRequest,
    declineRequest,
    postNotify,
    updateUser,
    loginUser,
    registerUser
}