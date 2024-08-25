require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

// Routes
const adminRoutes = require("./Routes/admin.js")
const userRoutes = require("./Routes/users.js")
const postRoutes = require("./Routes/posts.js")
const jobRoutes = require("./Routes/jobs.js")
const conversationRoutes = require("./Routes/conversations.js")
const postNotificationRoutes = require("./Routes/postNotifications.js")

// Create an express app
const app = express()

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
    })
    .catch((error) => {console.log(error)})

