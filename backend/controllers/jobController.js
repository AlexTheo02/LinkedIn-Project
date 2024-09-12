const Job = require("../models/jobModel.js")
const User = require("../models/userModel.js")
const mongoose = require("mongoose")

// Get all jobs
const getAllJobs = async (request, response) => {
    // Get all jobs, sorted by most recently created
    const jobs = await Job.find({}).sort({createdAt: -1});

    response.status(200).json(jobs);
}

// Get a single job
const getJob = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Job not found"})
    }

    const job = await Job.findById(id);

    // Job does not exist
    if (!job) {
        return response.status(404).json({error: "Job not found"})
    }
    
    // Job exists
    response.status(200).json(job);
}

// Create a new job
const createJob = async (request, response) => {
    const author = request.user.id;

    const {
        title,
        employer,
        location,
        description,
        requirements,
        benefits,
        responsibilities,
        workingArrangement,
        employmentType,
        employeesRange,
        applicants
    } = request.body;

    console.log('Request body:', request.body);
    
    let emptyFields = [];

    if (!title){
        emptyFields.push('title')
    }
    if (!employer){
        emptyFields.push('employer')
    }
    if (!location){
        emptyFields.push('location')
    }
    if (!description){
        emptyFields.push('description')
    }
    
    if (emptyFields.length > 0){
        return response.status(401).json({error: `Please fill the fields: ${emptyFields.join(', ')}`, emptyFields})
    }
    
    // Add to mongodb database
    try {
        const job = await Job.create({
            author: author,
            title,
            employer,
            location,
            description,
            requirements,
            benefits,
            responsibilities,
            workingArrangement,
            employmentType,
            employeesRange,
            applicants
    });
        response.status(200).json(job)
    } catch (error) {
        response.status(400).json({error: error.message})
    }
}

// Apply for job
const addApplicant = async (request, response) => {
    const { id } = request.params;  // Job id
    const loggedInUserId = request.user.id; // Logged in user id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Job not found" });
    }

    try {
        const job = await Job.findById(id);
        if (!job) {
            return response.status(404).json({ error: "Job not found" });
        }

        // Check if the applicant already exists
        if (job.applicants.includes(loggedInUserId)) {
            return response.status(200).json({ message: "Applicant has already been added" });
        }

        job.applicants.push(loggedInUserId);
        await job.save();

        response.status(200).json({ message: "Applicant added" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Remove applicant
const removeApplicant = async (request, response) => {
    const { id } = request.params;  // Job id
    const loggedInUserId = request.user.id; // Logged in user id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({ error: "Job not found" });
    }

    try {
        const job = await Job.findById(id);
        if (!job) {
            return response.status(404).json({ error: "Job not found" });
        }

        job.applicants = job.applicants.filter(applicant => applicant.toString() !== loggedInUserId);

        await job.save();

        response.status(200).json({ message: "Applicant removed" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// Update a job
const updateJob = async (request, response) => {
    // Grab the id from the route parameters
    const { id } = request.params;

    // Check if id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(404).json({error: "Job not found"})
    }

    const job = await Job.findOneAndUpdate({_id: id}, {...request.body})

     // Job does not exist
     if (!job) {
        return response.status(404).json({error: "Job not found"})
    }
    
    // Job exists, send back updated job
    response.status(200).json(job);
}

const getTailoredJobs = async (request, response) => {
    const loggedInUserId = request.user.id; // Logged in user id

    const user = await User.findById(loggedInUserId);
    if (!user) {
        return response.status(404).json({error: "User not found"})
    }

    const publishedJobsIds = user.publishedJobListings

    // Fetch all skilled jobs (jobs that user has at least one required skill)
    let skilledJobs = await Job.find({requirements: {$in: user.skills}})

    if (!skilledJobs) {
        return response.status(404).json({error: "Skilled jobs not found"})
    }

    // Sort skilled jobs by desc matching req/skills percentage
    const getMatchingPercentage = (job) => {
        // Filter requirements to those that match
        const matchedRequirements = job.requirements.filter(req => user.skills.includes(req))

        const matchingPercentage = (matchedRequirements.length / job.requirements.length) * 100

        return matchingPercentage
    }

    skilledJobs.sort((a,b) => {
        mpA = getMatchingPercentage(a);
        mpB = getMatchingPercentage(b);

        return mpB - mpA;
    });

    // Fetch suggested job ids and keep the top 10
    let suggestedJobs = user.jobSuggestions

    // Removing user's jobs from skilled and suggested jobs
    skilledJobs = skilledJobs.filter(job => !publishedJobsIds.find(jobid => job._id.toString() === jobid.toString()))
    suggestedJobs = suggestedJobs.filter(id => !publishedJobsIds.find(jobid => jobid.toString() === id.toString()))

    // Combine the lists
    let tailoredJobs = []

    let i=0, j=0;
    while (i<skilledJobs.length || j < suggestedJobs.length){
        // Add 3 skilled Jobs
        for (let k=0; k<3 && i<skilledJobs.length; k++){
            tailoredJobs = [skilledJobs[i]._id, ...tailoredJobs]
            suggestedJobs = suggestedJobs.filter(jobId => jobId.toString() !== skilledJobs[i]._id.toString())
            i++;
        }

        // Add 1 suggested Job
        if (j < suggestedJobs.length) {
            tailoredJobs = [suggestedJobs[j], ...tailoredJobs]
            skilledJobs = skilledJobs.filter(jobId => jobId.toString() !== suggestedJobs[j].toString())
            j++;
        }
    }

    // Reorder the jobs (move applied jobs to the back)
    let reorderedJobs = []
    const appliedJobs = []
    for (let i=0; i<tailoredJobs.length; i++){
        const job = tailoredJobs[i]
        if (user.appliedJobs.includes(job)){
            appliedJobs.push(job)
        }
        else{
            reorderedJobs.push(job)
        }
    }
    reorderedJobs = [...publishedJobsIds, ...reorderedJobs, ...appliedJobs]

    // Populate the reorderedJobs job ids and return them
    try {
        // Create a map for ids to indices
        const idIndexMap = {}
        for (let i=0; i< reorderedJobs.length; i++){
            idIndexMap[reorderedJobs[i]] = i;
        }
        
        const jobs = await Job.find({_id: {$in: reorderedJobs}});
        // Sort the jobs to appear in the same order as reorderedJobs list
        jobs.sort((a,b) => {
            return idIndexMap[a._id.toString()] - idIndexMap[b._id.toString()]
        })
        response.status(200).json(jobs)
    } catch (error) {
        return response.status(400).json({error: "Internal server error"})
    }
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    addApplicant,
    removeApplicant,
    updateJob,
    getTailoredJobs
}