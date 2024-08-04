const Post = require("../models/postModel.js")
const mongoose = require("mongoose")

// Get all posts
const getAllPosts = async (request, response) => {
    // Get all posts, sorted by most recently created
    const posts = await Post.find({}).sort({createdAt: -1});

    response.status(200).json(posts);
}

// Get a single post
const getPost = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Post not found"})
    }

    const post = await Post.findById(id);

    // Post does not exist
    if (!post) {
        return response.status(404).json({error: "Post not found"})
    }
    
    // Post exists
    response.status(200).json(post);
}

// Create a new post
const createPost = async (request, response) => {
    const {
        author,
        caption,
        // multimedia
        commentsList,
        likesList
    } = request.body;

    // Get multimedia file
    // Upload and retrieve gc link
    // Store link to db

    // Add to mongodb database
    try {
        const post = await Post.create({
            author,
            caption,
            // multimedia
            commentsList,
            likesList
    });
        response.status(200).json(post)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}


// Update a post
const updatePost = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Post not found"})
    }

    const post = await Post.findOneAndUpdate({_id: id}, {...request.body})

     // Post does not exist
     if (!post) {
        return response.status(404).json({error: "Post not found"})
    }
    
    // Post exists, send back updated post
    response.status(200).json(post);
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost
}