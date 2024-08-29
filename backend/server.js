require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const { spawn } = require('child_process');

const User = require("./models/userModel.js")
const Job = require("./models/jobModel.js")
const Post = require("./models/postModel.js")

const jobMatrixFactorizationPath = "../matrixFactorization/python_scripts/jobMatrixFactorization.py"
const postMatrixFactorizationPath = "../matrixFactorization/python_scripts/postMatrixFactorization.py"

// Function to run a specific python script
const matrixFactorization = async (path) => {

    // Fetch data to send into matrix factorization algorithm

    // Fetch users
    const users = await User.find();
    let response = undefined;

    if (path === jobMatrixFactorizationPath){
        // fetch jobs and assign them to response
        response = await Job.find();
    }

    else if(path === postMatrixFactorizationPath){
        // fetch posts and assign them to response
        response = await Post.find();
    }

    // Start the execution process
    console.log("Executing python script:",path)
    const pythonProcess = spawn("python",[path, JSON.stringify(users), JSON.stringify(response)]);

    // Output logging
    pythonProcess.stdout.on("data", (data) => {
    const suggestions = JSON.parse(data.toString());
    // if path === jobs add to jobs suggestions

    // if path === posts add to posts suggestions
    console.log(suggestions)
    })

    // Error logging
    pythonProcess.stderr.on("data", (error) => {
        console.log(`PYTHON ERROR:\n${error.toString()}`);
    })
}


matrixFactorization(jobMatrixFactorizationPath)
matrixFactorization(postMatrixFactorizationPath)

// setInterval(() => {matrixFactorization(jobMatrixFactorizationPath)}, 10000 ) // 10 seconds

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

