const Conversation = require("../models/conversationModel.js")
const User = require("../models/userModel.js")
const mongoose = require("mongoose")

// Get all conversations for logged in user
const getAllConversations = async (request, response) => {
    // Get current user's Recent Conversations List
    const recentConv = await User.findById(request.user._id)
    .populate({
        path: "recentConversations",
        select: "participant_1 participant_2 messageLog",
        populate: {
            path: "participant_1 participant_2",
            select: "name surname profilePicture"
        }
    })
    .select("recentConversations");

    const recentConversations = recentConv.recentConversations;
    // console.log(recentConversations)

    // Sort by timestamp
    const sortedConversations = recentConversations.sort((a,b) => {
        return (b.messageLog[0].timestamp - a.messageLog[0].timestamp)
    })

    // console.log(sortedConversations)

    response.status(200).json(sortedConversations);
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
    console.log('Request body:', request.body);
    const {
        participant_1,
        participant_2,
        initialMessage
    } = request.body;

    
    const messageLog = [initialMessage]

    const conv = {
        participant_1,
        participant_2,
        messageLog
    }
    
    // Add to mongodb database
    try {
        const conversation = await Conversation.create(conv);

        // Find both users and add this conversation to their recentConversations
        const part1 = await User.findById(participant_1);
        const part2 = await User.findById(participant_2);

        part1.recentConversations = [conversation._id, ... part1.recentConversations]
        part2.recentConversations = [conversation._id, ... part2.recentConversations]

        part1.save()
        part2.save()

        const populatedConversation = await conversation.populate({
            path: "participant_1 participant_2",
            select: "name surname profilePicture"
        })
        console.log(populatedConversation);
        return response.status(200).json({populatedConversation})

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
        return response.status(404).json({error: "Conversation not found", timestamp: request.body.messageLog[0].timestamp})
    }

    const conversation = await Conversation.findOneAndUpdate({_id: id}, {...request.body}, {new: true})

     // Conversation does not exist
     if (!conversation) {
        return response.status(404).json({error: "Conversation not found", timestamp: request.body.messageLog[0].timestamp})
    }
    
    // Conversation exists, send back updated conversation
    response.status(200).json(conversation);
}

const findConversationBetweenUsers = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "User not found"})
    }

    const userId = request.user.id;

    try {

        // Find user's recent conversation list and populate it
        const user = await User.findById(userId)
        .populate({
            path: "recentConversations",
            select: "participant_1 participant_2 messageLog"
        })
        .select("recentConversations");

        const recentConversations = user.recentConversations;

        console.log(recentConversations[0].participant_1)

        // Search for conversation between the two users
        const conversation = recentConversations.find(conv => {
            const participants = [conv.participant_1.toString(), conv.participant_2._id.toString()];
            return participants.includes(userId.toString() && id.toString());
        })

        if (conversation){
            const populatedConversation = await conversation.populate({
                path: "participant_1 participant_2",
                select: "name surname profilePicture"
            })
            return response.status(200).json({populatedConversation})
        }
        else{
            return response.status(404).json({error: "Conversation between users not found"});
        }


    } catch (error){
        console.error("Error finding conversation between users");
    }
    
}

module.exports = {
    getAllConversations,
    getMultipleConversations,
    getConversation,
    createConversation,
    updateConversation,
    findConversationBetweenUsers
}