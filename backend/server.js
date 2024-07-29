require("dotenv").config()

const express = require("express");

// Create an express app
const app = express()

// Will fire for every request that comes in (middleware)
app.use((request, response, next) => {
    console.log(request.path, request.method)
    next()
})

// Routes
app.get("/", (request, response) => {
    response.json({message: "Welcome to the app"})
})

// Listen for requests
app.listen(process.env.PORTNUM, () => {
    console.log("Listening on port",process.env.PORTNUM)
})