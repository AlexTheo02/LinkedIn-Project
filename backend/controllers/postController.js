const { upload, handleFileUpload } = require("../middleware/fileUpload.js");
const mongoose = require("mongoose")
const Post = require("../models/postModel.js")
const User = require("../models/userModel.js")
const Comment = require("../models/commentModel.js")

// Get all posts
const getAllPosts = async (request, response) => {
    if (!request.query.postIds){
        const posts = await Post.find({}).sort({createdAt: -1}) // Get all posts, sorted by most recently created
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
    else{
        try {
            const postIds = request.query.postIds.split(','); // List with post Ids

            const posts = await Post.find({ _id: { $in: postIds } })
                .sort({ createdAt: -1 })
                .populate("author", "name surname profilePicture")
                .populate({
                    path: "commentsList",
                    populate: {
                        path: "author",
                        select: "name surname profilePicture",
                    },
                });
    
            response.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching posts by IDs:", error);
            response.status(500).json({ error: "Internal server error" });
        }
    }
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
    // ADD POST TO USER'S PUBLISHED POSTS LIST
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

const getTailoredPosts = async (request, response) => {
    const loggedInUserId = request.user.id; // Logged in user id

    const user = await User.findById(loggedInUserId);
    if (!user) {
        return response.status(404).json({error: "User not found"})
    }

    try {
        // Own posts
        const userPostIds = user.publishedPosts;
        
        // All posts from user's network
        const networkPosts = await Post.find({author: {$in: user.network}}).sort({createdAt: -1});

        if (!networkPosts){
            return response.status(404).json({error: "Network posts not found"})
        }
        
        // All posts anyone from the network has liked
        const networkLikedPosts = await Post.find({likesList: {$in: user.network}}).sort({createdAt: -1});
        
        if (!networkLikedPosts){
            return response.status(404).json({error: "Network Liked Posts posts not found"})
        }

        // Matrix Factorization suggested posts
        let suggestedPostIds = user.postSuggestions;

        // Combine the lists
        const networkPostIds = networkPosts.map(post => post._id)
        const primaryPostIds = [...userPostIds, ...networkPostIds]

        const networkLikedPostIds = networkLikedPosts.map(post => post._id)
                
        // Remove already existing posts in network liked posts from suggested posts
        suggestedPostIds = suggestedPostIds.filter(postId => !networkLikedPostIds.find(pid => pid.toString() === postId.toString()))
        
        let secondaryPostIds = [...suggestedPostIds, ...networkLikedPostIds]
        
        // Remove already existing posts in primary posts from secondary posts
        secondaryPostIds = secondaryPostIds.filter(postId => !primaryPostIds.find(pid => pid.toString() === postId.toString()))

        // Fetch populated posts to return
        const primaryPosts = await Post.find({_id: {$in: primaryPostIds}}).sort({createdAt: -1})
        .populate("author","name surname profilePicture")
        .populate({
            path: "commentsList",
            populate: {
                path: "author",
                select: "name surname profilePicture"
            }
        });

        if (!primaryPosts){
            return response.status(404).json({error: "Primary posts not found"})
        }

        const secondaryPosts = await Post.find({_id: {$in: secondaryPostIds}}).sort({createdAt: -1})
        .populate("author","name surname profilePicture")
        .populate({
            path: "commentsList",
            populate: {
                path: "author",
                select: "name surname profilePicture"
            }
        });

        if (!secondaryPosts){
            return response.status(404).json({error: "Secondary posts not found"})
        }

        // Deep Merge the lists
        const timelinePosts = [];
        primaryPosts.forEach(post => timelinePosts.push(post))

        secondaryPosts.forEach(post => timelinePosts.push(post))

        response.status(200).json(timelinePosts);

    } catch (error) {
        console.error("Error:", error.message)
        response.status(400).json({error: "Internal Server Error"})
    }
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    addComment,
    getTailoredPosts
}