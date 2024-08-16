const express = require("express")
const {
    getAllJobs,
    getJob,
    createJob,
    addApplicant,
    removeApplicant,
    updateJob
} = require("../controllers/jobController.js")

const requireAuth = require('../middleware/requireAuth.js')

// Instance of the Router
const router = express.Router()

// require Authentcation for all Users routes
router.use(requireAuth)

// GET all jobs
router.get("/", getAllJobs)

// GET a signle job
router.get("/:id", getJob)

// POST a new job
router.post("/", createJob)

// Add applicant
router.patch("/addApplicant/:id", addApplicant)

// Remove applicant
router.patch("/removeApplicant/:id", removeApplicant)

// UPDATE a job
router.patch("/:id", updateJob)


module.exports = router