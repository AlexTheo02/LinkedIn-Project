require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

const userRoutes = require("./Routes/users.js")
// Create all necessary route files (posts, comments, ...)

// Create an express app
const app = express()

// Middleware (will fire for every request that comes in)
app.use(express.json())

app.use((request, response, next) => {
    console.log(request.path, request.method)
    next()
})

// Routes
app.use("/api/users",userRoutes)

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connection to database successful")
        // Listen for requests (only when connection to the database is established first)
        app.listen(process.env.PORTNUM, () => {
            console.log("Listening on port",process.env.PORTNUM)
        })
    })
    .catch((error) => {console.log(error)})

