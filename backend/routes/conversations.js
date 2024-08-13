const express = require("express")

const {
    getAllConversations,
    getConversation,
    createConversation,
    updateConversation
} = require("../controllers/conversationController.js")

const requireAuth = require('../middleware/requireAuth.js')

// Instance of the Router
const router = express.Router()

// require Authentcation for all Users routes
router.use(requireAuth)

// GET all conversation
router.get("/", getAllConversations)

// GET a signle conversation
router.get("/:id", getConversation)

// POST a new conversation
router.post("/", createConversation)

// UPDATE a conversation
router.patch("/:id", updateConversation)


module.exports = router