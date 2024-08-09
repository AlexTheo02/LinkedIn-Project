const express = require("express")
const {
    getAllJobs,
    getJob,
    createJob,
    updateJob
} = require("../controllers/jobController.js")

// Instance of the Router
const router = express.Router()

// GET all jobs
router.get("/", getAllJobs)

// GET a signle job
router.get("/:id", getJob)

// POST a new job
router.post("/", createJob)

// UPDATE a job
router.patch("/:id", updateJob)


module.exports = router