const express = require("express")
const {
    getAllPosts,
    getPost,
    createPost,
    updatePost
} = require("../controllers/postController.js")

const Post = require("../models/postModel.js")

// Instance of the Router
const router = express.Router()

// GET all posts
router.get("/", getAllPosts)

// GET a signle post
router.get("/:id", getPost)

// POST a new post
router.post("/", createPost)

// UPDATE a post
router.patch("/:id", updatePost)


module.exports = router