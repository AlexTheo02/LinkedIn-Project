require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

// Routes
const userRoutes = require("./Routes/users.js")
const postRoutes = require("./Routes/posts.js")
const jobRoutes = require("./Routes/jobs.js")

// Create an express app
const app = express()

// Middleware (will fire for every request that comes in)
app.use(express.json())

app.use((request, response, next) => {
    console.log(request.path, request.method);
    next();
})

// Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/jobs", jobRoutes)

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

