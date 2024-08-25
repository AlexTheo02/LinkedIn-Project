const PostNotification = require("../models/postNotificationModel.js")
const User = require("../models/userModel.js")
const mongoose = require("mongoose")


// Get all notifications
const getAllNotifications = async (request, response) => {
    const loggedInUserId = request.user.id;
    
    try {
        const user = await User.findById(loggedInUserId).populate("postNotifications", "createdAt");
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        // Ταξινομούμε τα postNotifications με βάση το createdAt από το πιο πρόσφατο στο πιο παλιό
        console.log(user.postNotifications)
        const sortedNotifications = user.postNotifications.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return response.status(200).json(sortedNotifications);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Server error" });
    }
}

// Get a single notification
const getNotification = async (request, response) => {
    try {
        // Grab the id from the route parameters
        const { id } = request.params;

        // Check if id is a valid mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(404).json({ error: "Notification not found" });
        }

        // Find the notification by id and populate the related fields in one query
        const notification = await PostNotification.findById(id)
            .populate("author", "name surname profilePicture")
            .populate("post_id", "caption multimediaURL multimediaType");

        // Check if the notification exists
        if (!notification) {
            return response.status(404).json({ error: "Notification not found" });
        }

        // Send the populated notification back as the response
        return response.status(200).json(notification);
    } catch (error) {
        console.error("Error fetching notification:", error);
        return response.status(500).json({ error: "Server error" });
    }
};

// Create a new notification
const createNotification = async (request, response) => {
    const loggedInUserId = request.user.id;

    const {
        post_id,
        isLike,
        commentContent
    } = request.body;

    // Add to mongodb database
    try {
        const notification = await PostNotification.create({
            author: loggedInUserId,
            post_id,
            isLike,
            commentContent,
            isRead: false
        });

        response.status(200).json(notification)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// Read notification
const readNotification = async (request, response) => {
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Notification not found" });
    }

    // Add to mongodb database
    try {
        // Find the notification by id and update isRead to true
        const notification = await PostNotification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true } // To return the updated document
        );

        // Check if notification exists
        if (!notification) {
            return response.status(404).json({ error: "Notification not found" });
        }

        response.status(200).json(notification)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

module.exports = {
    getAllNotifications,
    getNotification,
    createNotification,
    readNotification
}