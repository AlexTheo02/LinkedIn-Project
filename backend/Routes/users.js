const express = require("express")

const User = require("../models/userModel.js")

// Instance of the Router
const router = express.Router()

// GET all users
router.get("/", (request, response) => {
    response.json({message: "GET all users"})
})

// GET a signle user
router.get("/:id", (request, response) => {
    response.json({message: "GET a single user"})
})

// POST a new user
router.post("/", async (request, response) => {
    const {name, surname} = request.body;

    try {
        const user = await User.create({name, surname});
        response.status(200).json(user)
    } catch (error) {
        response.status(400).json({error: error.message})
    }

    // response.json({message: "POST a new user"})
})

// DELETE a user
router.delete("/:id", (request, response) => {
    response.json({message: "DELETE a user"})
})

// UPDATE a user
router.patch("/:id", (request, response) => {
    response.json({message: "UPDATE a user"})
})


module.exports = router