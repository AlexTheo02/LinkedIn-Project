require("dotenv").config()

const express = require("express")
const userRoutes = require("./Routes/users.js")

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

// Listen for requests
app.listen(process.env.PORTNUM, () => {
    console.log("Listening on port",process.env.PORTNUM)
})