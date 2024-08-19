const Job = require("../models/jobModel.js")
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

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    addApplicant,
    removeApplicant,
    updateJob
}