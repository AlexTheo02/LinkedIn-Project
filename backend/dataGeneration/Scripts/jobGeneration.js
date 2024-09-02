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
            $date: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)})
        },
        updatedAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
        }
    };
}

const createJobInteractions = (user, jobs) => {
    // Προσθήκη job interactions και applied jobs
    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        const randomJobIndex = Math.floor(Math.random() * jobs.length);
        const job = jobs[randomJobIndex];

        if (!user.jobInteractions.find(item => item.$oid === job._id)) {
            user.jobInteractions.push(job._id);

            // Apply σε τυχαία jobs
            if (Math.random() > 0.4) {  // So 2/5 chances they applied
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