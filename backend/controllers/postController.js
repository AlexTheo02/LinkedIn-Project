const { upload, handleFileUpload } = require("../middleware/fileUpload.js");

const Post = require("../models/postModel.js")
const Comment = require("../models/commentModel.js")
const mongoose = require("mongoose")


// Get all posts
const getAllPosts = async (request, response) => {
    // Get all posts, sorted by most recently created
    const posts = await Post.find({}).sort({createdAt: -1})
    .populate("author","name surname profilePicture")
    .populate({
        path: "commentsList",
        populate: {
            path: "author",
            select: "name surname profilePicture"
        }
    });

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

    const post = await Post.findById(id)
        .populate("author","name surname profilePicture")
        .populate({
        path: "commentsList",
        populate: {
            path: "author",
            select: "name surname profilePicture"
        }
    });

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
        commentsList,
        likesList
    } = request.body;
    
    const multimediaURL = request.file ? await handleFileUpload(request.file) : null;
    const multimediaType = request.file ? request.file.mimetype.split('/')[0] : null;

    // Add to mongodb database
    try {
        const post = await Post.create({
            author,
            caption,
            multimediaURL,
            multimediaType,
            commentsList: JSON.parse(commentsList),
            likesList: JSON.parse(likesList)
        });

        const populatedPost = await post.populate("author","name surname profilePicture")

        response.status(200).json(populatedPost)
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

// Add comment to post
const addComment = async (request, response) => {
    // Grab the id from the route parameters
    const { id: postId } = request.params;
    const { author, content } = request.body;

    // Create the comment
    const comment = await Comment.create({
        post: postId, // Post reference
        author, // User reference
        content // comment content
    })

    // Find the desired post
    const post = await Post.findById(postId);
    post.commentsList.unshift(comment); // add to the beggining of the list

    post.save();
    const populatedComment = await comment.populate("author", "name surname profilePicture");
    console.log(populatedComment);

    return response.status(200).json({populatedComment})
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    addComment
}