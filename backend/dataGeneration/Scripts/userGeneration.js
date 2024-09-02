const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const fs = require('fs');
const { lp_bucket } = require("../../googleCloudStorage.js")


// Password123!
const passwordHash = "$2b$10$n1PImv8oYIgb10NqQynuw.4xd5FTYCz0RAz6dIuNsrC2OSjW8hj82";

const male_pfp_path = "dataGeneration/ProfilePictures/male/";
const female_pfp_path = "dataGeneration/ProfilePictures/female/"; 


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
function createUser(gender, profilePic, workingPosition, employmentOrganization, skills) {
    return {
        _id: {
            $oid: new mongoose.Types.ObjectId()
        },
        name: faker.person.firstName(gender),
        surname: faker.person.lastName(gender),
        dateOfBirth: {
            $date: faker.date.between({ from: '1960-07-10T00:00:00.000+00:00', to: '2007-01-01T00:00:00.000+00:00' })
        },
        email: faker.internet.email(),
        password: passwordHash,
        phoneNumber: faker.phone.number(),
        profilePicture: profilePic,
        bio: faker.lorem.sentence(),
        placeOfResidence: faker.location.city(),
        workingPosition: workingPosition,
        employmentOrganization: employmentOrganization,
        professionalExperience: faker.lorem.sentences(3),
        education: faker.lorem.sentences(2),
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
        createdAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)})
        },
        updatedAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
        }
    };
}

const configureNetwork = (user, network_to_push, users) => {
    // Προσθήκη τυχαίων χρηστών στο δίκτυο
    for (let i = 0; i < Math.floor(Math.random() * 10)/* + 5*/; i++) {  // ΞΕΣΧΟΛΙΑΣΕ ΤΟ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let randomUserId;

        do {
            randomUserId = users[Math.floor(Math.random() * users.length)]._id;
            const isAlreadyInNetwork = user.network.find(item => item.$oid.toString() === randomUserId.$oid.toString());
            const userIdStr = user._id.$oid.toString();

            if (randomUserId.$oid.toString() === userIdStr || isAlreadyInNetwork){
                randomUserId = null
            }

        } while (!randomUserId);

        // Add selected user to current user's network
        user.network.push(randomUserId);
        // console.log(`Adding ${randomUserId.$oid} to ${user._id.$oid}'s network`)

        // Create empty list for user, if they did not exist before
        if (!network_to_push[randomUserId.$oid])
            network_to_push[randomUserId.$oid] = []
        // add user's id to selected user's network to push
        network_to_push[randomUserId.$oid].push(user._id);
    }
}

const networkToPush = (user, network_to_push) => {
    // Clean up
    toAdd = []
    
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