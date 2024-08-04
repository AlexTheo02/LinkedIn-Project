const User = require("../models/userModel.js")
const mongoose = require("mongoose")

// Get all users
const getAllUsers = async (request, response) => {
    // Get all users, sorted by newest created
    const users = await User.find({}).sort({createdAt: -1});

    response.status(200).json(users);
}

// Get a single user
const getUser = async (request, response) => {
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

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}