const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const fs = require('fs');
const { lp_bucket } = require("../../googleCloudStorage.js");


// Password123!
const passwordHash = "$2b$10$n1PImv8oYIgb10NqQynuw.4xd5FTYCz0RAz6dIuNsrC2OSjW8hj82";

const male_pfp_path = "dataGeneration/ProfilePictures/male/";
const female_pfp_path = "dataGeneration/ProfilePictures/female/";

const determineUserClass = (user, userClasses) => {
    return Object.keys(userClasses).find(key => userClasses[key].find(uid => uid.$oid.toString() === user._id.$oid.toString()))
}

// Get a profile picture from local and upload it to google storage
const createProfilePicture = async (gender) => {
    const rand = Math.floor(Math.random() * 20) + 1
    const pfp_path = `${gender==='male' ? male_pfp_path : female_pfp_path}${rand}.jpg`;
    const fileBuffer = fs.readFileSync(pfp_path);
    // Upload to google storage and return the path

    try {
        const uniqueFileName = `${Date.now()}-${gender}-${rand}`;
        const blob = lp_bucket.file(uniqueFileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: 'image/jpeg'  // Set the MIME type for the image
            }
        });
        
        return new Promise((resolve, reject) => {
            blobStream.on("error", (err) => {
                reject(err);
            });
            
            blobStream.on("finish", () => {
                const url = process.env.GS_PATH + uniqueFileName
                resolve(url);
            });

            blobStream.end(fileBuffer);
        });
    } catch (error) {
        console.error("Error uploading file to google cloud:", error);
        throw new Error("Error uploading file to google cloud");
    }
}

// Λειτουργία για τη δημιουργία χρηστών
function createUser(userClasses, key, gender, profilePic, workingPosition, employmentOrganization, skills) {
    const id = {$oid: new mongoose.Types.ObjectId()}
    userClasses[`${key}`].push(id)

    return {
        _id: id,
        name: faker.person.firstName(gender),
        surname: faker.person.lastName(gender),
        dateOfBirth: {
            $date: faker.date.between({ from: '1960-07-10T00:00:00.000+00:00', to: '2007-01-01T00:00:00.000+00:00' })
        },
        email: faker.internet.email().toLowerCase(),
        password: passwordHash,
        phoneNumber: faker.phone.number(),
        profilePicture: profilePic,
        bio: faker.lorem.sentence(),
        placeOfResidence: faker.location.city(),
        workingPosition: workingPosition,
        employmentOrganization: employmentOrganization,
        professionalExperience: [],
        education: [],
        skills: skills,
        recentConversations: [],
        network: [], // Θα προστεθούν τυχαίοι χρήστες αργότερα
        publishedPosts: [],
        publishedJobListings: [],
        likedPosts: [],
        publishedComments: [],
        privateDetails: ["dateOfBirth", "phoneNumber"],
        appliedJobs: [],
        postNotifications: [],
        linkUpRequests: [],
        jobInteractions: [],
        postInteractions: [],
        interactionSource: false,
        jobSuggestions: [],
        postSuggestions: []
    };
}

const configureNetwork = (user, userClasses, network_to_push, users) => {

    console.log(`Configuring network for <${user._id.$oid}>`)

    const userId = user._id.$oid;
    
    const userClass = determineUserClass(user, userClasses);
    
    // List of user ids in the same class
    const classUsers = userClasses[`${userClass}`];
    // console.log("classUsers: ",classUsers.length)
    
    // List of user ids of the same class that have already connected with the current user
    const connectedClassUsers = networkToPush[userId] ? networkToPush[userId].filter(u => determineUserClass(u, userClasses) === userClass) : [];
    // console.log("connectedClassUsers: ",connectedClassUsers.length)
    
    // List of user ids of different class that have already connected with the current user
    const connectedDifferentClassUsers = networkToPush[userId] ? networkToPush[userId].filter(uid => !connectedClassUsers.find(u => u.$oid.toString() === uid.$oid.toString())) : [];
    // console.log("connectedDifferentClassUsers: ",connectedDifferentClassUsers.length)
    
    // List of available class user ids
    let availableClassUsers = classUsers.filter(uid => !connectedClassUsers.find(u => u.$oid.toString() === uid.$oid.toString()));
    // console.log("availableClassUsers: ",availableClassUsers.length)
    
    // List of users in a different class from current user
    const differentClassUsers = users.filter(u => !classUsers.find(uid => u._id.$oid.toString() === uid.$oid.toString()))
    // console.log("differentClassUsers: ",differentClassUsers.length)
    
    // List of users of different class not connected to current user
    let availableDifferentClassUsers = differentClassUsers.filter(uid => !connectedDifferentClassUsers.find(u => u.$oid.toString() === uid.$oid.toString()))
    // console.log("availableDifferentClassUsers: ",availableDifferentClassUsers.length)

    // Max 5% of all users
    let n_initialConnections = Math.floor(Math.random() * 0.05 * users.length);
    // console.log("n_initialConnections: ",n_initialConnections)
    
    // Max 70% of same class users, else, max 80% of network connections, subtract already connected class users
    const n_classConnections = Math.round(Math.max(Math.random(), 0.5) * Math.min(0.8 * n_initialConnections, 0.7 * classUsers.length)) - connectedClassUsers.length
    // console.log("n_classConnections: ",n_classConnections)
    
    // Up to 20% of class connections, random connections
    const n_randomConnections = Math.round(Math.random() * 0.2 * n_classConnections);
    // console.log("n_randomConnections: ",n_randomConnections)
    
    // Create remaining same class connections
    for (let i=0; i < n_classConnections; i++){
        
        // Get random available user id
        const randomUserId = availableClassUsers[Math.floor(Math.random() * availableClassUsers.length)];

        // Create connection (add to user's network, and add user's id to randomUsers's network to push)
        user.network.push(randomUserId)

        // Create empty list for user, if they had no previous connections
        if (!network_to_push[randomUserId.$oid])
            network_to_push[randomUserId.$oid] = []
        // add user's id to selected user's network to push
        network_to_push[randomUserId.$oid].push(user._id);

        // Remove from available users
        availableClassUsers = availableClassUsers.filter(uid => uid.$oid.toString() !== randomUserId.$oid.toString())

    }

    // Create remaining different class connections
    for (let i=0; i < n_randomConnections; i++){
        
        // Get random available user id
        const randomUserId = availableDifferentClassUsers[Math.floor(Math.random() * availableDifferentClassUsers.length)]._id;
        
        // Create connection (add to user's network, and add user's id to randomUsers's network to push)
        user.network.push(randomUserId)

        // Create empty list for user, if they had no previous connections
        if (!network_to_push[randomUserId.$oid])
            network_to_push[randomUserId.$oid] = []
        // add user's id to selected user's network to push
        network_to_push[randomUserId.$oid].push(user._id);

        // Remove from available users
        availableDifferentClassUsers = availableDifferentClassUsers.filter(u => u._id.$oid.toString() !== randomUserId.$oid.toString())
    }
}

const networkToPush = (user, network_to_push) => {
    // Clean up
    toAdd = []

    console.log(user.network)
    
    if (network_to_push[user._id.$oid]){
        network_to_push[user._id.$oid].forEach(item => {
            const found = user.network.find(id => id.$oid.toString() === item.$oid.toString())
            if (!found){
                toAdd.push(item)
            }
        })
    }
    
    toAdd.forEach(item => {
        user.network.push(item)
    })
}

module.exports = {
    createProfilePicture,
    createUser,
    configureNetwork,
    networkToPush
};