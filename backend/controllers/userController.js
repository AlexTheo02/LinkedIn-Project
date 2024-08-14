const User = require("../models/userModel.js")
const mongoose = require("mongoose")
const jwb = require("jsonwebtoken")

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
        user.linkUpRequests = user.linkUpRequests.filter(request => request.toString() !== loggedInUserId);

        await user.save();

        response.status(200).json({ message: "Connection removed" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}


// Update a user
const updateUser = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "User not found"})
    }

    const user = await User.findOneAndUpdate({_id: id}, {...request.body})

     // User does not exist
     if (!user) {
        return response.status(404).json({error: "User not found"})
    }
    
    // User exists, send back updated user
    response.status(200).json(user);
}

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

        console.log(user);

        response.status(200).json({ userId: user._id, token: token });
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

        response.status(200).json({ userId: user._id, token: token });
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
    createUser,
    deleteUser,
    requestConnection,
    removeConnection,
    updateUser,
    loginUser,
    registerUser
}