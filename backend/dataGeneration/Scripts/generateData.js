// Run from /backend> using node dataGeneration/Scripts/generateData.js
const fs = require('fs');

const classes = require('.././classes.json');
const userGeneration = require("./userGeneration.js")
const jobGeneration = require("./jobGeneration.js")
const postGeneration = require("./postGeneration.js")
const commentGeneration = require("./commentGeneration.js")

let users = [];
let jobs = [];
let posts = [];
let comments = [];

// User ids of users in each class
userClasses = {
    ComputerScience: [],
    Law: [],
    Kitchen: [],
    Medical: [],
    Sports: [],
    Security: [],
    Advertising: [],
    Engineering: [],
    Music: [],
    Education: []
}

const n_users = 1000;
const n_jobs = 800;
const n_posts = 1000;
const n_comments = 2000;
const n_likes = 2500;

const class_chances = {
    ComputerScience: 0.17,      // 17%
    Law: 0.27,                  // 10%
    Kitchen: 0.37,              // 10%
    Medical: 0.47,              // 10%
    Sports: 0.55,               // 8%
    Security: 0.60,             // 5% 
    Advertising: 0.63,          // 3% 
    Engineering: 0.80,          // 17%
    Music: 0.90,                // 10%
    Education: 1.00             // 10%
}

const getRandomItemFromList = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}

const determineClass = (value) => {
    
    for (let key in class_chances) {
        if (value < class_chances[`${key}`]) {
            return classes[`${key}`];
        }
    }
    return undefined;
}

// Return a list of post ids for a specific user's timeline
const getPossibleTimeline = (user) => {

    let networkPosts = [];
    let networkLikedPosts = [];
    for (let i = 0; i < user.network.length; i++){
        // Find user in network
        const networkUserId = user.network[i].$oid.toString();
        const networkUser = users.find(item => item._id.$oid.toString() === networkUserId);

        networkPosts = [...networkUser.publishedPosts, ...networkPosts];
        networkLikedPosts = [...networkUser.likedPosts, ...networkLikedPosts];
    }

    let timeline = [...user.publishedPosts, ...networkPosts, ...networkLikedPosts];

    // Trim duplicate values from timeline
    let trimmedTimeline = []
    timeline.forEach(post => {
        if (!trimmedTimeline.find(item => item.$oid.toString() === post.$oid.toString())){
            trimmedTimeline.push(post)
        }
    })
    return trimmedTimeline
}

// Return true, if user has at least one required skill for a job
const hasMatchingSkills = (user, job) => {
    for (let i = 0; i < user.skills.length; i++) {
        if (job.requirements.includes(user.skills[i])) {
            return true;
        }
    }
    return false;
}

// Return a list of job ids for a specific user
const getPossibleJobsTimeline = (user) => {
    const possibleJobsTimeline = []
    // For each job
    jobs.forEach(job => {
        // Determine if user has at least one required skill for the job, and add it to the possibleTimeline
        if (hasMatchingSkills(user, job)){
            possibleJobsTimeline.push(job)
        }
    })

    return possibleJobsTimeline
}

async function generateData() {
    
    // ---------------------------------------------------------------------------------------------------------- USERS
    for (let i = 0; i < n_users; i++) {
        console.log(`CREATING USER ${i+1}`)
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        // const url = await userGeneration.createProfilePicture(gender); // MULTIMEDIA
        const url = ""
        console.log(url)
        
        const randValue = Math.random();
        const selectedClass = determineClass(randValue);
        if (!selectedClass){
            console.log(randValue)
            return
        }
        
        let workingPosition, employmentOrganization, skills = []

        // Get random working position
        workingPosition = getRandomItemFromList(selectedClass.WorkingPositions)

        // Get random company name
        employmentOrganization = getRandomItemFromList(selectedClass.Companies)

        // Define how many skills to add
        const skillsNum = Math.floor(Math.random() * 10 + 3)
        let skillsList = [...selectedClass.Skills]
        
        for (let j = 0 ; j < skillsNum ; j++){
            // Get random skill
            const skill = getRandomItemFromList(skillsList)

            // Remove item from skillsList to prevent re-rolling it   
            skillsList = skillsList.filter( item => item !== skill )

            // Add to user's skills
            skills.push(skill)
        }

        const key = Object.keys(classes).find(key => classes[key] === selectedClass);

        users.push(userGeneration.createUser(userClasses, key, gender, url, workingPosition, employmentOrganization, skills));

        console.log(`USER ${i+1} CREATED`)
    }
    console.log("USERS DONE\n\n")

    // ---------------------------------------------------------------------------------------------------------- USER NETWORK
    console.log("CONFIGURING USER NETWORKS")
    let network_to_push = {}
    // User network
    users.forEach(user => {
        userGeneration.configureNetwork(user, userClasses, network_to_push, users)
        return
    });
    users.forEach(user => {
        userGeneration.networkToPush(user, network_to_push)
    });
    console.log("USER NETWORK CONFIGURATION DONE\n\n")

    // ---------------------------------------------------------------------------------------------------------- JOBS
    for (let i = 0; i < n_jobs; i++) {
        console.log(`CREATING JOB ${i+1}`)
        // Επιλογή τυχαίου χρήστη ως author
        const randomUserIndex = Math.floor(Math.random() * users.length);
        const authorId = users[randomUserIndex]._id;
        
        const randValue = Math.random();
        const selectedClass = determineClass(randValue);
        
        if (!selectedClass){
            console.log(randValue)
            console.log("eimai malakas2")
            return
        }
        
        let title, employer, requirements = []
        
        // Get random title
        title = getRandomItemFromList(selectedClass.WorkingPositions)
        
        // Get random company name
        employer = getRandomItemFromList(selectedClass.Companies)
        
        // Define how many requirements to add
        const requirementsNum = Math.floor(Math.random() * 10 + 3)
        let requirementsList = [...selectedClass.Skills]
        
        for (let j = 0 ; j < requirementsNum ; j++){
            // Get random (skill) requirement
            const requirement = getRandomItemFromList(requirementsList)
            
            // Remove item from requirementsList to prevent re-rolling it   
            requirementsList = requirementsList.filter( item => item !== requirement )
            
            // Add to job's requirements
            requirements.push(requirement)
        }
        const job = jobGeneration.createJob(authorId, title, employer, requirements);
        
        // Προσθήκη του job στο πεδίο publishedJobListings του χρήστη
        users[randomUserIndex].publishedJobListings.push(job._id);
        jobs.push(job);
        console.log(`JOB ${i+1} CREATED`)
    }
    console.log("JOBS DONE\n\n")
    
    // ---------------------------------------------------------------------------------------------------------- POSTS
    for (let i = 0; i < n_posts; i++) {
        console.log(`CREATING POST ${i+1}`)
        
        // Επιλογή τυχαίου χρήστη ως author
        const randomUserIndex = Math.floor(Math.random() * users.length);
        const authorId = users[randomUserIndex]._id;
        console.log("awaiting multimedia")
        // const postMultURL = await postGeneration.createPostMultimedia() // MULTIMEDIA
        const postMultURL = ""
        const multimediaURL = postMultURL ? postMultURL : ""
        console.log("multimedia generation finished")
        const multimediaType = multimediaURL ? multimediaURL.match(/[^-]+$/)[0] : ""
        
        const post = postGeneration.createPost(authorId, multimediaURL, multimediaType);
        
        // Προσθήκη του job στο πεδίο publishedJobListings του χρήστη
        users[randomUserIndex].publishedPosts.push(post._id);
        posts.push(post);
        console.log(`POST ${i+1} CREATED`)
    }
    console.log("POSTS DONE\n\n")
    

    // ---------------------------------------------------------------------------------------------------------- COMMENTS
    for (let i = 0; i < n_comments; i++) {
        console.log(`CREATING COMMENT ${i + 1}`)
        // Select random user as author
        const randomUserIndex = Math.floor(Math.random() * users.length);
        const author = users[randomUserIndex];
        
        // Select random post from user's possible timeline
        const possibleTimeline = getPossibleTimeline(author)
        if (!possibleTimeline.length) {
            continue
        }
        const randomPostIndex = Math.floor(Math.random() * possibleTimeline.length);
        const randomPostId = possibleTimeline[randomPostIndex].$oid.toString()
        const post = posts.find(item => item._id.$oid.toString() === randomPostId)

        // Generate Comment
        const comment = commentGeneration.createComment(post, author._id);

        // Add comment to both comments list and post's commentsList
        comments.push(comment)
        post.commentsList.push(comment._id)

        // Update author's data
        author.publishedComments.push(comment._id);
        author.postInteractions.push(post._id);
        author.interactionSource = true;

        console.log(`COMMENT ${i+1} CREATED`)
    }
    console.log("COMMENTS DONE\n\n")
    
    // ---------------------------------------------------------------------------------------------------------- LIKES
    for (let i = 0; i < n_likes; i++) {
        console.log(`CREATING LIKE ${i + 1}`)

        // Select random user as author
        const randomUserIndex = Math.floor(Math.random() * users.length);
        const author = users[randomUserIndex];

        // Select random post from user's possible timeline
        const possibleTimeline = getPossibleTimeline(author)
        if (!possibleTimeline.length) {
            continue
        }
        const randomPostIndex = Math.floor(Math.random() * possibleTimeline.length);
        const randomPostId = possibleTimeline[randomPostIndex].$oid.toString()
        const post = posts.find(item => item._id.$oid.toString() === randomPostId)

        // Add author to post's likes list if not already liked
        if (!post.likesList.find(item => item.$oid === author._id.$oid)){

            post.likesList.push(author._id)
   
            // Update author's data
            author.likedPosts.push(post._id);
            author.postInteractions.push(post._id);
            author.interactionSource = true;
        }

        console.log(`LIKE ${i+1} CREATED`)
    }
    console.log("LIKES DONE\n\n")


    // ---------------------------------------------------------------------------------------------------------- JOB / POST INTERACTIONS
    console.log("Creating JOB/POST interactions")
    users.forEach(user => {
        jobGeneration.createJobInteractions(user, jobs, getPossibleJobsTimeline)
        postGeneration.createPostInteractions(user, posts, getPossibleTimeline)
    });
    console.log("JOB/POST INTERACTIONS DONE\n")

    // ---------------------------------------------------------------------------------------------------------- FILE GENERATION
    fs.writeFileSync('./dataGeneration/generatedData/users.json', JSON.stringify(users, null, 2));
    fs.writeFileSync('./dataGeneration/generatedData/jobs.json', JSON.stringify(jobs, null, 2));
    fs.writeFileSync('./dataGeneration/generatedData/posts.json', JSON.stringify(posts, null, 2));
    fs.writeFileSync('./dataGeneration/generatedData/comments.json', JSON.stringify(comments, null, 2));
    
    console.log('Users, jobs and posts data generated successfully!');
}

generateData()