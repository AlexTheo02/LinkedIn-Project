const express = require("express")

const {
    getAllConversations,
    getMultipleConversations,
    getConversation,
    createConversation,
    updateConversation,
    findConversationBetweenUsers
} = require("../controllers/conversationController.js")

const requireAuth = require('../middleware/requireAuth.js')

// Instance of the Router
const router = express.Router()

// require Authentcation for all Users routes
router.use(requireAuth)

// GET all conversations
router.get("/", getAllConversations)

// GET multiple conversations (by id)
router.get("/multiple", getMultipleConversations)

// GET a signle conversation
router.get("/:id", getConversation)

// POST a new conversation
router.post("/", createConversation)

// UPDATE a conversation
router.patch("/:id", updateConversation)

// Get a conversation with participants: logged in user & parameter
router.get("/find-conversation/:id", findConversationBetweenUsers)


module.exports = router