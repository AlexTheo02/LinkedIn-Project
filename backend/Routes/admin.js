const express = require("express")

const {exportUsers} = require("../controllers/adminController.js")

const requireAuth = require('../middleware/requireAuth')

// Instance of the Router
const router = express.Router()

// require Authentcation for all Users routes
router.use(requireAuth)

// Export a users' info in json or xml file (for admin)
router.post("/export", exportUsers);

module.exports = router