const express = require("express")
const { upload, handleFileUpload } = require("../middleware/fileUpload.js");

// Controller functions
const {
    getAllUsers,
    getUserById,
    getUser,
    createUser,
    deleteUser,
    publishJob,
    applyJob,
    removeApplyJob,
    requestConnection,
    removeConnection,
    updateUser,
    loginUser,
    registerUser
} = require("../controllers/userController.js")

const requireAuth = require('../middleware/requireAuth')

// Instance of the Router
const router = express.Router()

// Login route
router.post("/login", loginUser)

// Register route
router.post("/register",upload.single("profilePicture"), registerUser)

// require Authentcation for all Users routes
router.use(requireAuth)

// GET all users
router.get("/", getAllUsers)

// GET a single user
router.get("/find", getUser)

// GET a signle user (by id)
router.get("/:id", getUserById)

// POST a new user
router.post("/", createUser)

// DELETE a user
router.delete("/:id", deleteUser)

// Publish job
router.patch("/publishJob/:id", publishJob);

// Apply for job
router.patch("/applyJob/:id", applyJob);

// Remove appliance for job
router.patch("/removeApplyjob/:id", removeApplyJob);

// Connection request
router.patch("/requestConnection/:id", requestConnection);

// Remove Connection
router.patch("/removeConnection/:id", removeConnection);

// UPDATE a user
router.patch("/:id", updateUser)

module.exports = router