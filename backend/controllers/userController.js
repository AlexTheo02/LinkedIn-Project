const User = require("../models/userModel.js")
const mongoose = require("mongoose")
const jwb = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { deleteFile, handleFileUpload } = require("../middleware/fileUpload.js")
const js2xmlparser = require('js2xmlparser');

// Get all users
const getAllUsers = async (request, response) => {
  
    const searchTerm = request.query.searchTerm
    // Get all users, sorted by newest created
    if (!searchTerm){
        const users = await User.find({}).sort({createdAt: -1});
        response.status(200).json(users);
    }
    else{
        try {
            const users = await User.find(); // Παίρνουμε όλους τους χρήστες
            const filteredUsers = users.filter(user => {
                const fullName = `${user.name} ${user.surname}`.toLowerCase(); // Συνενώνουμε name και surname
                return fullName.includes(String(searchTerm).toLowerCase()); // Ελέγχουμε αν περιέχει το searchTerm
            }).slice(0, 10); // Περιορισμός στα 10 πρώτα αποτελέσματα
    
            response.status(200).json(filteredUsers);
        } catch (error) {
            response.status(500).json({ error: 'Internal server error' });
        }
    }
}

// Get a single user
const getUserById = async (request, response) => {
    // Grab the id from the route parameters
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
    
    // User exists
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
        // User exists
        response.status(200).json(user);

    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// Export users' info in json or xml file (for admin)
const exportUsers = async (req, res) => {
    const format = req.body.format;         // Παράμετρος format (json ή xml)
    const selectedUsers = req.body.users;   // Οι επιλεγμενοι χρηστες

    if (!selectedUsers || !format) {
        return res.status(400).json({ error: 'Missing users or format' });
    }

    // Φιλτράρουμε τους επιλεγμένους χρήστες
    const filteredUsers = await User.find({ _id: { $in: selectedUsers } });

    // Εξαγωγή σε JSON ή XML
    if (format === 'json') {
        const exportData = JSON.stringify(filteredUsers, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=users.json');
        return res.send(exportData);
    } else if (format === 'xml') {
        const convertToStringIds = (arr) => arr.map(id => id.toString());

        // Προετοιμάζουμε τα δεδομένα για XML
        const xmlData = filteredUsers.map(user => ({
            _id: user._id.toString(),  // Μετατροπή του _id σε string
            name: user.name,
            surname: user.surname,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            password: user.password,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            placeOfResidence: user.placeOfResidence,
            workingPosition: user.workingPosition,
            employmentOrganization: user.employmentOrganization,
            professionalExperience: user.professionalExperience.length > 0 
                ? { experience: user.professionalExperience }
                : { professionalExperience: [] },
            education: user.education.length > 0 
                ? { education: user.education }
                : { education: [] },
            skills: user.skills.length > 0 
                ? { skill: user.skills }
                : { skills: [] },
            recentConversations: user.recentConversations.length > 0 
                ? { conversation: convertToStringIds(user.recentConversations) }
                : { recentConversations: [] },
            network: user.network.length > 0 
                ? { connection: convertToStringIds(user.network) }
                : { network: [] },
            publishedPosts: user.publishedPosts.length > 0 
                ? { post: convertToStringIds(user.publishedPosts) }
                : { publishedPosts: [] },
            publishedJobListings: user.publishedJobListings.length > 0 
                ? { jobListing: convertToStringIds(user.publishedJobListings) }
                : { publishedJobListings: [] },
            likedPosts: user.likedPosts.length > 0 
                ? { post: convertToStringIds(user.likedPosts) }
                : { likedPosts: [] },
            privateDetails: user.privateDetails.length > 0 
                ? { detail: user.privateDetails }
                : { privateDetails: [] },
            appliedJobs: user.appliedJobs.length > 0 
                ? { job: convertToStringIds(user.appliedJobs) }
                : { appliedJobs: [] },
            postNotifications: user.postNotifications.length > 0 
                ? { notification: convertToStringIds(user.postNotifications) }
                : { postNotifications: [] },
            linkUpRequests: user.linkUpRequests.length > 0 
                ? { request: convertToStringIds(user.linkUpRequests) }
                : { linkUpRequests: [] },
            publishedComments: user.publishedComments.length > 0 
                ? { comment: convertToStringIds(user.publishedComments) }
                : { publishedComments: [] }
        }));

        const exportData = js2xmlparser.parse('users', { user: xmlData });
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xml');
        return res.send(exportData);
    } else {
        return res.status(400).json({ error: 'Unsupported format' });
    }
};

// Create a new user
const createUser = async (request, response) => {

    const {
        name,
        surname,
        dateOfBirth,
        email,
        password,
        phoneNumber,
        // Profile Picture
        placeOfResidence,
        workingPosition,
        employmentOrganization,
        professionalExperience,
        education,
        skills,
        recentConversations,
        network,
        publishedPosts,
        publishedJobListings,
        likedPosts
    } = request.body;

    // Get multimedia file
    // Upload and retrieve gc link
    // Store link to db

    // Add to mongodb database
    try {
        const user = await User.create({
            name,
            surname,
            dateOfBirth,
            email,
            password,
            phoneNumber,
            // Profile picture
            placeOfResidence,
            workingPosition,
            employmentOrganization,
            professionalExperience,
            education,
            skills,
            recentConversations,
            network,
            publishedPosts,
            publishedJobListings,
            likedPosts
    });
        response.status(200).json(user)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// Delete a user
const deleteUser = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "User not found"})
    }

    // Find and delete the user
    const user = await User.findOneAndDelete({_id: id});

    // User does not exist
    if (!user) {
        return response.status(404).json({error: "User not found"})
    }
    
    // User exists, send back deleted user
    response.status(200).json(user);
}

// Confirm login password
const confirmPassword = async(request, response) => {
    // Get password from request
    const {password} = request.body;

    // Get user and their password
    const loggedInUserId = request.user.id;
    const userPassword = await User.findById(loggedInUserId).select("password");

    const match = await bcrypt.compare(password, userPassword.password);

    if (!match){
        const errorMessage = "Incorrect password";
        const error = new Error(errorMessage);
        return response.status(400).json({error: "Incorrect password"});
    }

    response.status(200).json({message: "Password confirm successful"});

}

// Change email
const changeEmail = async (request, response) => {
    const {email} = request.body;
    // Convert to lowercase
    const emailLowercase = email.toLowerCase()

    try {
        // Get user and their userData
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

    console.log(password, confirmPassword)

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
        await user.save();

        response.status(200).json({ message: "User published Post" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Like a post
const toggleLikePost = async (request, response) => {
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

        // Check if the post is already liked
        console.log(user.likedPosts, id)
        if (user.likedPosts.includes(id)) {
            // Remove post from likedPosts list
            user.likedPosts = user.likedPosts.filter(postId => postId.toString() !== id.toString())
        }
        else{
            user.likedPosts.push(id);
        }
        await user.save();

        response.status(200).json({ message: "User liked Post" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Apply for job
const applyJob = async (request, response) => {
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

        // Check if the user has already applied
        if (user.appliedJobs.includes(id)) {
            return response.status(200).json({ message: "User has already applied for this job" });
        }

        user.appliedJobs.push(id);
        await user.save();

        response.status(200).json({ message: "Applied for the job" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Remove apply for a job
const removeApplyJob = async (request, response) => {
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

        user.appliedJobs = user.appliedJobs.filter(appliance => appliance.toString() !== id);

        await user.save();

        response.status(200).json({ message: "Application removed" });
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

        response.status(200).json({ message: "Connection request sent" });
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

        response.status(200).json({ message: "Connection removed" });
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

        response.status(200).json({ message: "Connection removed" });
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

        response.status(200).json({ message: "Connection removed" });
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

        response.status(200).json({ message: "Connection removed" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

function formatFieldName(fieldName) {
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Προσθέτει κενό πριν από κάθε κεφαλαίο γράμμα
        .replace(/^./, str => str.toUpperCase()) // Κάνει κεφαλαίο το πρώτο γράμμα
        .trim(); // Αφαιρεί τυχόν περιττά κενά
}

// Validation function
async function validateUserData(userData, userId = null) {
    let validFields = {
        // profilePicture: 0,
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

    // Profile picture validation
    // if (userData.profilePicture) validFields.profilePicture = 1;
    // else { validFields.profilePicture = 0; isValid = false; }

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
    // Grab the id from the route parameters
    const { id } = request.params;

    const userBodyData = request.body
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
        // Αν το error περιεχει τα validFields
        if (error.fields) {
            response.status(401).json({
                error: error.message,
                errorFields: error.fields
            });
        } 
        else {
            // Άλλοι πιθανοί τύποι σφαλμάτων
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
        const user = await User.login(userData);

        const token = createToken(user._id);

        const admin = user.email === "adminlinkedin@gmail.com";

        console.log(user);

        response.status(200).json({ userId: user._id, token: token, admin: admin });
    } catch (error) {
        // Αν το error περιεχει τα validFields
        if (error.fields) {
            response.status(401).json({
                error: error.message,
                errorFields: error.fields
            });
        } 
        else {
            // Άλλοι πιθανοί τύποι σφαλμάτων
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
    // console.log(userData);

    // Create the user
    try {
        const user = await User.register(userData);

        const token = createToken(user._id);

        console.log(user);

        response.status(200).json({ userId: user._id, token: token, admin: false });
    } catch (error) {
        // Αν το error περιεχει τα validFields
        if (error.fields) {
            response.status(401).json({
                error: error.message,
                errorFields: error.fields
            });
        } 
        else {
            // Άλλοι πιθανοί τύποι σφαλμάτων
            response.status(400).json({error: error.message});
        }
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUser,
    exportUsers,
    createUser,
    deleteUser,
    confirmPassword,
    changeEmail,
    changePassword,
    publishJob,
    publishPost,
    toggleLikePost,
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