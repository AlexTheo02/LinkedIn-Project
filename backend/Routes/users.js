const express = require("express")
const { upload } = require("../middleware/fileUpload.js");

// Controller functions
const {
    getAllUsers,
    getUserById,
    getUser,
    confirmPassword,
    changeEmail,
    changePassword,
    publishJob,
    publishPost,
    viewInteraction,
    toggleLikePost,
    publishComment,
    logJobInteraction,
    applyJob,
    removeApplyJob,
    requestConnection,
    removeRequestConnection,
    removeConnection,
    acceptRequest,
    declineRequest,
    postNotify,
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

// Confirm login password
router.post("/confirm-password", confirmPassword)

// Change email
router.post("/change-email", changeEmail);

// Change Password
router.post("/change-password", changePassword);

// Publish job
router.patch("/publishJob/:id", publishJob);

// Publish post
router.patch("/publishPost/:id", publishPost);

// View post interaction
router.patch("/viewInteraction/:id", viewInteraction);

// Like post
router.patch("/toggleLikePost/:id", toggleLikePost);

// Publish comment
router.patch("/publishComment/:id", publishComment);

// Log job interaction
router.patch("/log-job-interaction/:id", logJobInteraction)

// Apply for job
router.patch("/applyJob/:id", applyJob);

// Remove appliance for job
router.patch("/removeApplyjob/:id", removeApplyJob);

// Connection request
router.patch("/requestConnection/:id", requestConnection);

// Remove Connection
router.patch("/removeRequestConnection/:id", removeRequestConnection);

// Remove Connection
router.patch("/removeConnection/:id", removeConnection);

// Accept request
router.patch("/acceptRequest/:id", acceptRequest);

// Decline request
router.patch("/declineRequest/:id", declineRequest);

// Post notification to user's notifications
router.patch("/postNotify/:notificationid/:id", postNotify);

// UPDATE a user
router.patch("/:id", upload.single("file"), updateUser)

module.exports = router