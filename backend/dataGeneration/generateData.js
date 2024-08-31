const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const { lp_bucket } = require("../googleCloudStorage.js")


// Δημιουργία των κενών arrays για τους χρήστες και τα jobs
let users = [];
let jobs = [];

const workingPositions = [
    "Computer Scientist",
    "Lawyer",
    "Chef",
    "Doctor",
    "Influencer"
]

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
function createUser(id, gender, profilePic) {
    return {
        _id: id,
        name: faker.person.firstName(gender),
        surname: faker.person.lastName(gender),
        dateOfBirth: faker.date.between({ from: '1930-07-10T00:00:00.000+00:00', to: '2007-01-01T00:00:00.000+00:00' }),
        email: faker.internet.email(),
        password: passwordHash,
        phoneNumber: faker.phone.number(),
        profilePicture: profilePic,
        bio: faker.lorem.sentence(),
        placeOfResidence: faker.location.city(),
        workingPosition: faker.person.jobTitle(),
        employmentOrganization: faker.company.name(),
        professionalExperience: faker.lorem.sentences(3),
        education: faker.lorem.sentences(2),
        skills: faker.lorem.words(5).split(' '),
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
        createdAt: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)}),
        updatedAt: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
    };
}

// Λειτουργία για τη δημιουργία θέσεων εργασίας (jobs)
function createJob(authorId) {
    return {
        _id: new mongoose.Types.ObjectId(),
        author: authorId,
        title: faker.person.jobTitle(),
        employer: faker.company.name(),
        location: faker.location.city(),
        description: faker.lorem.paragraph(),
        requirements: faker.lorem.sentences(2).split('. '),
        benefits: faker.lorem.sentences(2).split('. '),
        responsibilities: faker.lorem.sentences(2).split('. '),
        workingArrangement: faker.number.int({min: 0, max: 1}),
        employmentType: faker.number.int({min: 0, max: 2}),
        employeesRange: faker.number.int({min: 0, max: 9}),
        applicants: [],
        createdAt: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)}),
        updatedAt: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
    };
}

const configureNetwork = (user, network_to_push) => {
    // Προσθήκη τυχαίων χρηστών στο δίκτυο
    for (let i = 0; i < Math.floor(Math.random() * 10)/* + 5*/; i++) {  // ΞΕΣΧΟΛΙΑΣΕ ΤΟ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (network_to_push[user._id].length > 0){
            user.network.push()
            continue;
        }
        let randomUserId;
        do {
            randomUserId = users[Math.floor(Math.random() * users.length)]._id;
        } while (randomUserId === user._id || user.network.includes(randomUserId));
        user.network.push(randomUserId);
        randomUserId.network.push(user._id);
    }
}

const networkToPush = (user, network_to_push) => {
    // Clean up
    toAdd = []
    
    network_to_push[user._id].forEach(item => {
        if (!user.network.includes(item)){
            toAdd.push(item)
        }
    })

    toAdd.forEach(item => {
        user.network.push(item)
    })
}

async function generateData() {
    // Δημιουργία χρηστών
    for (let i = 0; i < 10; i++) {
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const url = await createProfilePicture(gender);
        console.log(url)

        users.push(createUser(new mongoose.Types.ObjectId(), gender, url));
    }

    // Δημιουργία θέσεων εργασίας
    for (let i = 0; i < 10; i++) {
        // Επιλογή τυχαίου χρήστη ως author
        const randomUserIndex = Math.floor(Math.random() * users.length);
        const authorId = users[randomUserIndex]._id;
        
        const job = createJob(authorId);

        // Προσθήκη του job στο πεδίο publishedJobListings του χρήστη
        users[randomUserIndex].publishedJobListings.push(job._id);
        jobs.push(job);
    }

    network_to_push = {}
    // Προσθήκη δικτύου χρηστών και interactions
    users.forEach(user => {
        configureNetwork(user, network_to_push)
        networkToPush(user, network_to_push)

        console.log("MEXRI EDW FTANW")
        // Προσθήκη job interactions και applied jobs
        let randomJobInteractions = [];
        for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
            console.log("ITERATION GIA INTERACTIONS")
            const randomJobIndex = Math.floor(Math.random() * jobs.length);
            const job = jobs[randomJobIndex];

            if (!randomJobInteractions.includes(job._id)) {
                randomJobInteractions.push(job._id);
                user.jobInteractions.push(job._id);

                // Apply σε τυχαία jobs
                if (Math.random() > 0.5) {
                    user.appliedJobs.push(job._id);
                    job.applicants.push(user._id);
                }
            }
        }
        console.log("TELOS?")
    });

    // Γράψιμο των δεδομένων σε JSON αρχεία
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2));

    console.log('Users and jobs data generated successfully!');
}

generateData()