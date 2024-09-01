const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const { lp_bucket } = require("../googleCloudStorage.js")
const classes = require('./classes.json');


// Δημιουργία των κενών arrays για τους χρήστες και τα jobs
let users = [];
let jobs = [];
let posts = [];

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
function createUser(id, gender, profilePic, workingPosition, employmentOrganization, skills) {
    return {
        _id: id,
        name: faker.person.firstName(gender),
        surname: faker.person.lastName(gender),
        dateOfBirth: faker.date.between({ from: '1960-07-10T00:00:00.000+00:00', to: '2007-01-01T00:00:00.000+00:00' }),
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
        createdAt: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)}),
        updatedAt: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
    };
}

// Λειτουργία για τη δημιουργία θέσεων εργασίας (jobs)
function createJob(authorId, title, employer, requirements) {
    return {
        _id: new mongoose.Types.ObjectId(),
        author: authorId,
        title: title,
        employer: employer,
        location: faker.location.city(),
        description: faker.lorem.paragraph(),
        requirements: requirements,
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

// Λειτουργία για τη δημιουργία θέσεων εργασίας (jobs)
function createPost(authorId, fileURL, fileType) {
    return {
        _id: new mongoose.Types.ObjectId(),
        author: authorId,
        caption: faker.lorem.paragraph(),
        multimediaURL: fileURL,
        multimediaType: fileType,
        commentsList : [], // List of commentIds
        likesList : [],
        createdAt: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)}),
        updatedAt: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
    };
}

const configureNetwork = (user, network_to_push) => {
    // Προσθήκη τυχαίων χρηστών στο δίκτυο
    for (let i = 0; i < Math.floor(Math.random() * 10)/* + 5*/; i++) {  // ΞΕΣΧΟΛΙΑΣΕ ΤΟ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let randomUserId;
        do {
            randomUserId = users[Math.floor(Math.random() * users.length)]._id;
            // console.log("users.length: ", users.length)
            // console.log("userid: ", user._id)
            // console.log("randomuserid: ", randomUserId)
            // console.log("user.network: ", user.network)
        } while (randomUserId === user._id || user.network.includes(randomUserId));
        user.network.push(randomUserId);
        if (!network_to_push[randomUserId])
            network_to_push[randomUserId] = []
        network_to_push[randomUserId].push(user._id);
    }
}

const networkToPush = (user, network_to_push) => {
    // Clean up
    toAdd = []
    
    if (network_to_push[user._id]){
        network_to_push[user._id].forEach(item => {
            if (!user.network.includes(item)){
                toAdd.push(item)
            }
        })
    }
    

    toAdd.forEach(item => {
        user.network.push(item)
    })
}

const createJobInteractions = (user) => {
    // Προσθήκη job interactions και applied jobs
    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        console.log("ITERATION GIA INTERACTIONS")
        const randomJobIndex = Math.floor(Math.random() * jobs.length);
        const job = jobs[randomJobIndex];

        if (!user.jobInteractions.includes(job._id)) {
            user.jobInteractions.push(job._id);

            // Apply σε τυχαία jobs
            if (Math.random() > 0.4) {  // So 2/5 chances they applied
                user.appliedJobs.push(job._id);
                job.applicants.push(user._id);
            }
        }
    }
}

const getRandomItemFromList = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}

const determineClass = (value) => {
    // console.log(classes["ComputerScience"])

    for (let key in class_chances) {
        if (value < class_chances[`${key}`]) {
            return classes[`${key}`];
        }
    }
    return undefined;
}

async function generateData() {
    const n_users = 10;
    // const n_jobs = n_users * 0.2;
    // const n_posts = n_users * 0.4;
    const n_jobs = 10;
    const n_posts = 10;

    // Δημιουργία χρηστών
    for (let i = 0; i < n_users; i++) {
        console.log("CREATING USER")
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const url = await createProfilePicture(gender);
        console.log(url)

        const randValue = Math.random();
        const selectedClass = determineClass(randValue);

        if (!selectedClass){
            console.log(randValue)
            console.log("eimai malakas")
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
        
        users.push(createUser(new mongoose.Types.ObjectId(), gender, url, workingPosition, employmentOrganization, skills));
        console.log("USER CREATED")
    }
    console.log("USER CREATION DONE")

    // Δημιουργία θέσεων εργασίας
    for (let i = 0; i < n_jobs; i++) {
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

            // Add to user's skills
            requirements.push(requirement)
        }
        console.log("CREATING JOB")
        const job = createJob(authorId, title, employer, requirements);
        console.log("JOB CREATED")

        // Προσθήκη του job στο πεδίο publishedJobListings του χρήστη
        users[randomUserIndex].publishedJobListings.push(job._id);
        jobs.push(job);
    }

    console.log("JOBS DONE")

    // Create posts
    for (let i = 0; i < n_posts; i++) {
        console.log("CREATING POST")

        // Επιλογή τυχαίου χρήστη ως author
        const randomUserIndex = Math.floor(Math.random() * users.length);
        const authorId = users[randomUserIndex]._id;
        
        let fileURL, fileType;

        const job = createJob(authorId, title, employer, requirements);
        console.log("POST CREATED")

        // Προσθήκη του job στο πεδίο publishedJobListings του χρήστη
        users[randomUserIndex].publishedJobListings.push(job._id);
        jobs.push(job);
    }

    let network_to_push = {}
    // Προσθήκη δικτύου χρηστών και interactions
    users.forEach(user => {
        configureNetwork(user, network_to_push) // Να ξεσχολιασουμε το + 5 !!!!!!!!!!!!!!!!!!!!!!!!!!!
    });
    users.forEach(user => {
        networkToPush(user, network_to_push)

        // Προσθήκη job interactions και applied jobs
        createJobInteractions(user)
    });

    // Γράψιμο των δεδομένων σε JSON αρχεία
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2));

    console.log('Users and jobs data generated successfully!');
}

generateData()