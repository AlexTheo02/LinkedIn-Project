const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

// Λειτουργία για τη δημιουργία θέσεων εργασίας (jobs)
function createJob(authorId, title, employer, requirements) {
    return {
        _id: {
            $oid: new mongoose.Types.ObjectId()
        },
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
        createdAt: {
            $date: faker.date.between({from: '2024-01-01', to: '2024-09-01'})
        },
        updatedAt: {
            $date: faker.date.between({from: '2024-09-02', to: Date.now() })
        }
    };
}

const createJobInteractions = (user, jobs, getPossibleJobsTimeline) => {
    const possibleJobs = getPossibleJobsTimeline(user);
    if (!possibleJobs.length){
        return
    }

    const n_jobInteractions = Math.max(Math.random() * possibleJobs.length * 0.7, possibleJobs.length * 0.2)

    for (let i = 0; i < n_jobInteractions; i++) {
        const randomJobIndex = Math.floor(Math.random() * possibleJobs.length);
        const job = possibleJobs[randomJobIndex];

        // Job is not already in jobInteractions list of the user
        if (!user.jobInteractions.find(item => item.$oid.toString() === job._id.$oid.toString())) {
            user.jobInteractions.push(job._id);

            // Figure out whether to apply to the current job with a 30% chance to do so
            if (Math.random() > 0.3) {
                user.appliedJobs.push(job._id);
                job.applicants.push(user._id);
            }
        }
    }
}

module.exports = {
    createJob,
    createJobInteractions
}