const express = require("express")
const {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
} = require("../controllers/userController.js")

const User = require("../models/userModel.js")

// Instance of the Router
const router = express.Router()

// GET all users
router.get("/", getAllUsers)

// GET a signle user
router.get("/:id", getUser)

// POST a new user
router.post("/", createUser)

// DELETE a user
router.delete("/:id", deleteUser)

// UPDATE a user
router.patch("/:id", updateUser)


module.exports = router