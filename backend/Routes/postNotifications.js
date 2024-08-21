const express = require("express")

const {
    getAllNotifications,
    getNotification,
    createNotification,
    readNotification
} = require("../controllers/postNotificationController.js")

const requireAuth = require('../middleware/requireAuth.js')

// Instance of the Router
const router = express.Router()

// require Authentcation for all Users routes
router.use(requireAuth)

// GET all notification
router.get("/", getAllNotifications)

// GET a signle notification
router.get("/:id", getNotification)

// POST a new notification
router.post("/", createNotification)

// Read notification
router.patch("/readNotification/:id", readNotification)

module.exports = router