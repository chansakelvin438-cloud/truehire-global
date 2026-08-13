import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import {
  cleanEmail,
  cleanPhone,
  cleanText,
  isValidEmail,
  rejectDangerousInput,
} from "../utils/validation.js"

const router = express.Router()

function formatJobStatus(status) {
  if (status === "PENDING_REVIEW") return "Pending Review"
  if (status === "APPROVED") return "Approved"
  if (status === "FLAGGED") return "Flagged"
  if (status === "REJECTED") return "Rejected"
  return "Pending Review"
}

function normaliseJobStatus(status) {
  const cleanStatus = cleanText(status, 50)
    .toUpperCase()
    .replace(/[\s-]/g, "_")

  const statusMap = {
    PENDING_REVIEW: "PENDING_REVIEW",
    PENDING: "PENDING_REVIEW",
    APPROVED: "APPROVED",
    FLAGGED: "FLAGGED",
    REJECTED: "REJECTED",
  }

  return statusMap[cleanStatus] || null
}

function parseDeadline(deadline) {
  if (!deadline) return null

  const deadlineDate = new Date(`${deadline}T00:00:00`)

  if (Number.isNaN(deadlineDate.getTime())) {
    return null
  }

  return deadlineDate
}

function getTodayDateOnly() {
  const today = new Date()

  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function getDeadlineInfo(deadline) {
  const deadlineDate = parseDeadline(deadline)

  if (!deadlineDate) {
    return {
      isDeadlineValid: false,
      isDeadlineReached: true,
      canApply: false,
      deadlineStatus: "Invalid deadline",
    }
  }

  const todayOnly = getTodayDateOnly()
  const isDeadlineReached = deadlineDate <= todayOnly

  return {
    isDeadlineValid: true,
    isDeadlineReached,
    canApply: !isDeadlineReached,
    deadlineStatus: isDeadlineReached ? "Applications closed" : "Open",
  }
}

function parseScamRiskReasons(value) {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)

    if (Array.isArray(parsed)) {
      return parsed
    }

    return []
  } catch {
    return String(value)
      .split("|")
      .map((reason) => reason.trim())
      .filter(Boolean)
  }
}

function isAllowedLogoUrl(companyLogo) {
  if (!companyLogo) return true

  const logo = String(companyLogo)

  if (logo.startsWith("javascript:")) return false
  if (logo.startsWith("data:")) return false

  return (
    logo.includes("/uploads/company-logos/") ||
    logo.startsWith("http://") ||
    logo.startsWith("https://")
  )
}

function analyseJobRisk(jobData) {
  const text = [
    jobData.title,
    jobData.company,
    jobData.location,
    jobData.salary,
    jobData.description,
    jobData.requirements,
  ]
    .join(" ")
    .toLowerCase()

  let score = 0
  const reasons = []

  const paymentPatterns = [
    "application fee",
    "registration fee",
    "interview fee",
    "medical fee",
    "training fee",
    "processing fee",
    "transport fee",
    "pay before",
    "pay first",
    "send money",
    "mobile money",
    "airtel money",
    "mtn momo",
    "deposit",
  ]

  const urgencyPatterns = [
    "urgent hiring",
    "apply immediately",
    "limited slots",
    "first come first served",
    "start tomorrow",
  ]

  const suspiciousContactPatterns = [
    "whatsapp only",
    "telegram",
    "dm me",
    "inbox me",
    "call only",
  ]

  for (const pattern of paymentPatterns) {
    if (text.includes(pattern)) {
      score += 35
      reasons.push(`Mentions possible payment request: ${pattern}`)
    }
  }

  for (const pattern of urgencyPatterns) {
    if (text.includes(pattern)) {
      score += 10
      reasons.push(`Uses urgency wording: ${pattern}`)
    }
  }

  for (const pattern of suspiciousContactPatterns) {
    if (text.includes(pattern)) {
      score += 15
      reasons.push(`Uses suspicious contact wording: ${pattern}`)
    }
  }

  if (!jobData.email || !isValidEmail(jobData.email)) {
    score += 20
    reasons.push("Employer email is missing or invalid")
  }

  if (!jobData.company || jobData.company.length < 2) {
    score += 15
    reasons.push("Company name appears incomplete")
  }

  if (!jobData.description || jobData.description.length < 50) {
    score += 15
    reasons.push("Job description is too short")
  }

  if (!jobData.requirements || jobData.requirements.length < 20) {
    score += 10
    reasons.push("Job requirements are too short")
  }

  const finalScore = Math.min(score, 100)

  let level = "Low Risk"

  if (finalScore >= 70) {
    level = "High Risk"
  } else if (finalScore >= 35) {
    level = "Medium Risk"
  }

  return {
    level,
    score: finalScore,
    reasons,
  }
}

function formatJob(job) {
  const deadlineInfo = getDeadlineInfo(job.deadline)

  return {
    id: job.id,
    employerId: job.employerId,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
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

    status: job.status,
    statusLabel: formatJobStatus(job.status),

    paymentStatus: job.paymentStatus,
    scamRiskLevel: job.scamRiskLevel || "Low Risk",
    scamRiskScore: job.scamRiskScore || 0,
    scamRiskReasons: parseScamRiskReasons(job.scamRiskReasons),
    adminNote: job.adminNote,

    isDeadlineValid: deadlineInfo.isDeadlineValid,
    isDeadlineReached: deadlineInfo.isDeadlineReached,
    canApply: deadlineInfo.canApply,
    deadlineStatus: deadlineInfo.deadlineStatus,

    postedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(job.createdAt),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,

    employer: job.employer
      ? {
          id: job.employer.id,
          companyName: job.employer.companyName,
          phone: job.employer.phone,
          website: job.employer.website,
          address: job.employer.address,
          verificationStatus: job.employer.verificationStatus,
        }
      : null,
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
      include: {
        employer: true,
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
      message: "Failed to fetch jobs.",
    })
  }
})

router.get("/public/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        status: "APPROVED",
      },
      include: {
        employer: true,
      },
    })

    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found or not available.",
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
      message: "Failed to fetch job.",
    })
  }
})

router.post("/", protect, allowRoles("EMPLOYER"), async (req, res) => {
  try {
    const unsafeInputError = rejectDangerousInput({
      "Job title": req.body.title,
      Company: req.body.company,
      "Company logo": req.body.companyLogo,
      Email: req.body.email,
      Phone: req.body.phone,
      Location: req.body.location,
      Type: req.body.type,
      Category: req.body.category,
      Salary: req.body.salary,
      Deadline: req.body.deadline,
      Experience: req.body.experience,
      Description: req.body.description,
      Requirements: req.body.requirements,
    })

    if (unsafeInputError) {
      return res.status(400).json({
        status: "error",
        message: unsafeInputError,
      })
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    })

    if (!employerProfile) {
      return res.status(400).json({
        status: "error",
        message: "Employer profile not found.",
      })
    }

    const title = cleanText(req.body.title, 160)
    const company = cleanText(
      req.body.company || employerProfile.companyName,
      160
    )
    const companyLogo = cleanText(req.body.companyLogo, 1000)
    const email = cleanEmail(req.body.email)
    const phone = cleanPhone(req.body.phone)
    const location = cleanText(req.body.location, 160)
    const type = cleanText(req.body.type, 80)
    const category = cleanText(req.body.category, 120)
    const salary = cleanText(req.body.salary, 120)
    const deadline = cleanText(req.body.deadline, 20)
    const experience = cleanText(req.body.experience, 120)
    const description = cleanText(req.body.description, 5000)
    const requirements = cleanText(req.body.requirements, 5000)

    if (
      !title ||
      !company ||
      !email ||
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

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid employer email address.",
      })
    }

    if (!isAllowedLogoUrl(companyLogo)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid company logo link.",
      })
    }

    const deadlineInfo = getDeadlineInfo(deadline)

    if (!deadlineInfo.isDeadlineValid || deadlineInfo.isDeadlineReached) {
      return res.status(400).json({
        status: "error",
        message: "Please choose a future application deadline.",
      })
    }

    if (description.length < 50) {
      return res.status(400).json({
        status: "error",
        message: "Job description must be at least 50 characters long.",
      })
    }

    if (requirements.length < 20) {
      return res.status(400).json({
        status: "error",
        message: "Job requirements must be at least 20 characters long.",
      })
    }

    const risk = analyseJobRisk({
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
    })

    const job = await prisma.job.create({
      data: {
        employerId: employerProfile.id,
        title,
        company,
        companyLogo: companyLogo || "",
        email,
        phone: phone || "",
        location,
        type,
        category,
        salary: salary || "",
        deadline,
        experience: experience || "",
        description,
        requirements,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING_PAYMENT",
        pricingPlan: "LAUNCH_OFFER",
        amountDue: 50,
        currency: "ZMW",
        scamRiskLevel: risk.level,
        scamRiskScore: risk.score,
        scamRiskReasons: JSON.stringify(risk.reasons),
      },
      include: {
        employer: true,
      },
    })

    res.status(201).json({
      status: "success",
      message: "Job submitted for review successfully.",
      job: formatJob(job),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to submit job advert.",
    })
  }
})

router.get(
  "/employer/my-jobs",
  protect,
  allowRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: {
          userId: req.user.id,
        },
      })

      if (!employerProfile) {
        return res.status(400).json({
          status: "error",
          message: "Employer profile not found.",
        })
      }

      const jobs = await prisma.job.findMany({
        where: {
          employerId: employerProfile.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          employer: true,
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
        message: "Failed to fetch employer jobs.",
      })
    }
  }
)

router.get("/admin/all-jobs", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employer: true,
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
      message: "Failed to fetch admin jobs.",
    })
  }
})

router.patch("/:jobId/status", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const { jobId } = req.params
    const requestedStatus = normaliseJobStatus(req.body.status)
    const adminNote = cleanText(req.body.adminNote, 1000)

    if (!requestedStatus) {
      return res.status(400).json({
        status: "error",
        message: "Invalid job status.",
      })
    }

    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        employer: true,
      },
    })

    if (!existingJob) {
      return res.status(404).json({
        status: "error",
        message: "Job not found.",
      })
    }
    if (status === "APPROVED" && job.paymentStatus !== "PAID") {
        return res.status(400).json({
            status: "error",
            message: "This job cannot be approved until payment is confirmed.",
        })
    }

    const deadlineInfo = getDeadlineInfo(existingJob.deadline)

    if (
      requestedStatus === "APPROVED" &&
      (!deadlineInfo.isDeadlineValid || deadlineInfo.isDeadlineReached)
    ) {
      return res.status(400).json({
        status: "error",
        message: "This job cannot be approved because the deadline is invalid or reached.",
      })
    }

    let finalStatus = requestedStatus
    let finalAdminNote = adminNote || existingJob.adminNote || ""

    if (
      requestedStatus === "APPROVED" &&
      existingJob.scamRiskLevel === "High Risk"
    ) {
      finalStatus = "FLAGGED"
      finalAdminNote =
        "This job was automatically flagged because it contains high-risk wording."
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        status: finalStatus,
        adminNote: finalAdminNote,
      },
      include: {
        employer: true,
      },
    })

    res.json({
      status: "success",
      message:
        finalStatus === "FLAGGED" && requestedStatus === "APPROVED"
          ? "Job was flagged due to high-risk content."
          : "Job status updated successfully.",
      job: formatJob(updatedJob),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to update job status.",
    })
  }
})

export default router