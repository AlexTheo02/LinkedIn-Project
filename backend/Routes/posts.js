const express = require("express")
const { upload, handleFileUpload } = require("../middleware/fileUpload.js");

const {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    addComment,
    getTailoredPosts
} = require("../controllers/postController.js")

const requireAuth = require('../middleware/requireAuth.js')

// Instance of the Router
const router = express.Router()

// require Authentcation for all Users routes
router.use(requireAuth)

// GET tailored jobs
router.get("/get-tailored-posts", getTailoredPosts)

// GET all posts
router.get("/", getAllPosts)

// GET a signle post
router.get("/:id", getPost)

// POST a new post
router.post("/", upload.single("file"), createPost)

// UPDATE a post
router.patch("/:id", updatePost)

// Add comment to a post
router.patch("/add-comment/:id", addComment);



module.exports = router