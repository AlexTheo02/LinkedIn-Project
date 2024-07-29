const express = require("express")

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
router.post("/", (request, response) => {
    response.json({message: "POST a new user"})
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