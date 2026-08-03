import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import { analyseJobRisk } from "../utils/scamRisk.js"

const router = express.Router()

function formatJobStatus(status) {
  if (status === "PENDING_REVIEW") return "Pending Review"
  if (status === "APPROVED") return "Approved"
  if (status === "FLAGGED") return "Flagged"
  if (status === "REJECTED") return "Rejected"
  return "Pending Review"
}

function formatPaymentStatus(status) {
  if (status === "PAYMENT_DISABLED") return "Payment Disabled"
  return status || "Payment Disabled"
}

function parseReasons(reasons) {
  try {
    return JSON.parse(reasons || "[]")
  } catch {
    return []
  }
}

function formatJob(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    email: job.email,
    phone: job.phone,
    location: job.location,
    type: job.type,
    category: job.category,
    salary: job.salary,
    deadline: job.deadline,
    experience: job.experience,
    description: job.description,
    requirements: job.requirements,
    status: formatJobStatus(job.status),
    paymentStatus: formatPaymentStatus(job.paymentStatus),
    scamRiskLevel: job.scamRiskLevel,
    scamRiskScore: job.scamRiskScore,
    scamRiskReasons: parseReasons(job.scamRiskReasons),
    adminNote: job.adminNote,
    submittedAt: new Intl.DateTimeFormat("en-GB").format(job.createdAt),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  }
}

router.get("/public", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json({
      status: "success",
      jobs: jobs.map(formatJob),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch public jobs",
    })
  }
})

router.get("/public/:id", async (req, res) => {
  try {
    const { id } = req.params

    const job = await prisma.job.findFirst({
      where: {
        id,
        status: "APPROVED",
      },
    })

    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found or not approved yet",
      })
    }

    res.json({
      status: "success",
      job: formatJob(job),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch job details",
    })
  }
})

router.post("/", protect, allowRoles("EMPLOYER"), async (req, res) => {
  try {
    const employerProfile = await prisma.employerProfile.findUnique({
      where: { userId: req.user.id },
    })

    if (!employerProfile) {
      return res.status(400).json({
        status: "error",
        message: "Employer profile not found. Please register as an employer.",
      })
    }

    const {
      title,
      company,
      email,
      phone,
      location,
      type,
      category,
      salary,
      deadline,
      experience,
      description,
      requirements,
    } = req.body

    if (
      !title ||
      !location ||
      !type ||
      !category ||
      !deadline ||
      !description ||
      !requirements
    ) {
      return res.status(400).json({
        status: "error",
        message: "Please fill in all required job fields.",
      })
    }

    const jobData = {
      title,
      company: company || employerProfile.companyName,
      email: email || req.user.email,
      phone: phone || req.user.phone || employerProfile.phone,
      location,
      type,
      category,
      salary: salary || "Negotiable",
      deadline,
      experience: experience || "Not specified",
      description,
      requirements,
    }

    const risk = analyseJobRisk(jobData)

    const job = await prisma.job.create({
      data: {
        employerId: employerProfile.id,
        ...jobData,
        status: "PENDING_REVIEW",
        paymentStatus: "PAYMENT_DISABLED",
        scamRiskLevel: risk.level,
        scamRiskScore: risk.score,
        scamRiskReasons: JSON.stringify(risk.reasons),
      },
    })

    res.status(201).json({
      status: "success",
      message: "Job submitted for admin review",
      job: formatJob(job),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to submit job advert",
    })
  }
})
router.get("/admin/all-jobs", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    })

    res.json({
      status: "success",
      jobs: jobs.map(formatJob),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch admin job queue",
    })
  }
})

router.patch("/:id/status", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const statusMap = {
      Approved: "APPROVED",
      Flagged: "FLAGGED",
      Rejected: "REJECTED",
      "Pending Review": "PENDING_REVIEW",
    }

    const newStatus = statusMap[status]

    if (!newStatus) {
      return res.status(400).json({
        status: "error",
        message: "Invalid job status",
      })
    }

    const existingJob = await prisma.job.findUnique({
      where: { id },
    })

    if (!existingJob) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      })
    }

    const risk = analyseJobRisk(existingJob)

    let finalStatus = newStatus
    let adminNote = existingJob.adminNote || ""

    if (newStatus === "APPROVED" && risk.level === "High Risk") {
      finalStatus = "FLAGGED"
      adminNote =
        "This job was automatically flagged because it contains high-risk scam indicators. Admin cannot approve jobs that ask applicants to pay money."
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: finalStatus,
        scamRiskLevel: risk.level,
        scamRiskScore: risk.score,
        scamRiskReasons: JSON.stringify(risk.reasons),
        adminNote: finalStatus === "APPROVED" ? "" : adminNote,
      },
    })

    res.json({
      status: "success",
      message: "Job status updated successfully",
      job: formatJob(updatedJob),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to update job status",
    })
  }
})

router.get("/employer/my-jobs", protect, allowRoles("EMPLOYER"), async (req, res) => {
  try {
    const employerProfile = await prisma.employerProfile.findUnique({
      where: { userId: req.user.id },
    })

    if (!employerProfile) {
      return res.status(400).json({
        status: "error",
        message: "Employer profile not found.",
      })
    }

    const jobs = await prisma.job.findMany({
      where: { employerId: employerProfile.id },
      orderBy: { createdAt: "desc" },
    })

    res.json({
      status: "success",
      jobs: jobs.map(formatJob),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch employer jobs",
    })
  }
})

export default router