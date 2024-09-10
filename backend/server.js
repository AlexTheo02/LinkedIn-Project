require("dotenv").config()
const fs = require('fs');

const express = require("express")

// Routes
const adminRoutes = require("./routes/admin.js")
const userRoutes = require("./routes/users.js")
const postRoutes = require("./routes/posts.js")
const jobRoutes = require("./routes/jobs.js")
const conversationRoutes = require("./routes/conversations.js")
const postNotificationRoutes = require("./routes/postNotifications.js")

const { matrixFactorization } = require("./generalFunctions.js")

// Create an express app
const app = express()
const mongoose = require("mongoose")

// Middleware (will fire for every request that comes in)
app.use(express.json())

app.use((request, response, next) => {
    console.log(request.path, request.method);
    next();
})

// Routes
app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/conversations", conversationRoutes)
app.use("/api/notifications", postNotificationRoutes)

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connection to database successful")
        // Listen for requests (only when connection to the database is established first)
        app.listen(process.env.PORTNUM, () => {
            console.log("Listening on port",process.env.PORTNUM)
        })

        // Matrix factorization logic
        matrixFactorization(process.env.JOB_MF_PATH)
        // matrixFactorization(process.env.POST_MF_PATH)

        // setInterval(() => {matrixFactorization(process.env.JOB_MF_PATH)}, 600000 ) // 10 minutes
        // setInterval(() => {matrixFactorization(process.env.POST_MF_PATH)}, 600000 ) // 10 minutes

    })
    .catch((error) => {console.log(error)})

