const Conversation = require("../models/conversationModel.js")
const User = require("../models/userModel.js")
const mongoose = require("mongoose")

// Get all conversations for logged in user
const getAllConversations = async (request, response) => {
    // Get current user's Recent Conversations List
    const recentConversations = await User.findById(request.user._id).select("recentConversations")

    // Sort by timestamp
    // recentConversations.recentConversations.sort((a, b) => b.createdAt - a.createdAt)

    response.status(200).json(recentConversations.recentConversations);
}

// Get multiple conversations (not ids) based on ids
const getMultipleConversations = async (request, response) => {
    // Grab the ids from the route parameters and add them to an array
    const { ids } = request.query;
    const idsArray = ids && ids.split(',');

    // Keep only valid mongoose ids
    const validateId = (id) => {
        return mongoose.Types.ObjectId.isValid(id);
    }
    const validIdsArray = idsArray.filter(validateId)

    try {
        const conversations = await Conversation.find({
            _id: { $in: validIdsArray}
        });
    
        response.status(200).json(conversations)

    } catch (error) {
        response.status(400).json({error: "Failed to fetch conversations"})
    }
}

// Get a single conversation
const getConversation = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Conversation not found"})
    }

    const conversation = await Conversation.findById(id);

    // Conversation does not exist
    if (!conversation) {
        return response.status(404).json({error: "Conversation not found"})
    }
    
    // Conversation exists
    response.status(200).json(conversation);
}

// Create a new conversation
const createConversation = async (request, response) => {
    const {
        participant_1,
        participant_2,
        messageLog
    } = request.body;

    console.log('Request body:', request.body);
    
    // Add to mongodb database
    try {
        const conversation = await Conversation.create({
            participant_1,
            participant_2,
            messageLog
    });
        response.status(200).json(conversation)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}


// Update a conversation
const updateConversation = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Conversation not found"})
    }

    const conversation = await Conversation.findOneAndUpdate({_id: id}, {...request.body})

     // Conversation does not exist
     if (!conversation) {
        return response.status(404).json({error: "Conversation not found"})
    }
    
    // Conversation exists, send back updated conversation
    response.status(200).json(conversation);
}

module.exports = {
    getAllConversations,
    getMultipleConversations,
    getConversation,
    createConversation,
    updateConversation
}