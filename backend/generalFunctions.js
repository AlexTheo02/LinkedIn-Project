const fs = require('fs');
const { spawn } = require('child_process');

// Mongoose models
const User = require("./models/userModel.js")
const Job = require("./models/jobModel.js")
const Post = require("./models/postModel.js")

async function updateRecommendations({itemRecommendations, isJobs}){
    console.log("Updating recommendations")
    const userIds = Object.keys(itemRecommendations)
    
    // For each user, find user and update the recommendedJobs list or recommendedPosts list
    let counter = 1
    let max_users = userIds.length
    for (const userId of userIds) {
        try {
            // Get user object
            const user = await User.findById(userId);
            if (!user){
                console.error("User not found", userId);
                continue;
            }
            
            // Update recommendation list for jobs/posts on user
            if (isJobs) {
                user.jobSuggestions = itemRecommendations[userId]
            } else {
                user.postSuggestions = itemRecommendations[userId]
            }
            
            // Save the user
            await user.save();
            console.log(`Successfully updated ${counter} / ${max_users} ${isJobs ? "Job" : "Post"} suggestions`);
            counter++;
        } catch (error) {
            console.error("Error:", error.message)
        }
    }
    console.log(`${isJobs ? "Job" : "Post"} suggestions successfully updated`)
}

const jobMatrixFactorizationPath = process.env.JOB_MF_PATH
const postMatrixFactorizationPath = process.env.POST_MF_PATH

// Function to run a specific python script
const matrixFactorization = async (path) => {
    console.log(path)
    // Fetch data to send into matrix factorization algorithm

    // Fetch users
    const users = await User.find();

    if (path === jobMatrixFactorizationPath){
        const jobs = await Job.find();
        fs.writeFileSync(process.env.JOBS_PATH, JSON.stringify(jobs, null, 2))
    }
    
    else if(path === postMatrixFactorizationPath){
        const posts = await Post.find();
        fs.writeFileSync(process.env.POSTS_PATH, JSON.stringify(posts, null, 2))
    }

    else return;
    
    fs.writeFileSync(process.env.USERS_PATH, JSON.stringify(users, null, 2))

    // Start the execution process
    console.log("Executing python script:",path)
    const pythonProcess = spawn("python", [path]);

    // Output logging
    pythonProcess.stdout.on("data", (data) => {
        console.log("RESPOSNE RECEIVED")
        response = data.toString('utf-8').trim()
        if (response != "MF DONE"){
            console.log(data.toString())
        }
        else{
            console.log("Entered read seq")
            // Job MF response
            if (path === jobMatrixFactorizationPath){
                // Add job suggestions to suggestedJobs on each user
                fs.readFile(process.env.JOB_RECOMMENDATIONS_PATH, (error, data) => {
                    if (error) {
                        console.error("Error reading file", error)
                        return;
                    }
                    
                    try {
                        const jobRecommendations = JSON.parse(data);
                        
                        // Update the database users to include their new job recommendations
                        updateRecommendations({itemRecommendations: jobRecommendations, isJobs: true})

                    } catch (error) {
                        console.error("Error parsing JSON:",error)
                    }
                })
                
                
            }
            // Post MF response
            else if (path === postMatrixFactorizationPath){
                // Add post recommendations to recommendedPosts on each user
                fs.readFile(process.env.POST_RECOMMENDATIONS_PATH, (error, data) => {
                    if (error) {
                        console.error("Error reading file", error)
                        return;
                    }
                    
                    try {
                        const postRecommendations = JSON.parse(data);

                        // Update the database users to include their new post recommendations
                        updateRecommendations({itemRecommendations: postRecommendations, isJobs: false})
                        
                    } catch (error) {
                        console.error("Error parsing JSON:",error)
                    }
                })
            }
        }
    })
        
    // Error logging
    pythonProcess.stderr.on("data", (error) => {
        console.log(`PYTHON ERROR:\n${error.toString()}`);
    })
}

module.exports = {
    matrixFactorization
}