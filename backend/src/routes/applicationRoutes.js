import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import {
  sendNewApplicationEmail,
  sendApplicationStatusEmail,
} from "../services/emailService.js"
import { createAuditLog } from "../services/auditLogService.js"

const router = express.Router()

function parseDeadline(deadline) {
  if (!deadline) return null

  const parsedDate = new Date(`${deadline}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

function getTodayDateOnly() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function formatApplicationStatus(status) {
  if (status === "SUBMITTED") return "Submitted"
  if (status === "REVIEWED") return "Reviewed"
  if (status === "SHORTLISTED") return "Shortlisted"
  if (status === "INTERVIEW_SCHEDULED") return "Interview Scheduled"
  if (status === "REJECTED") return "Rejected"
  return "Submitted"
}

function normaliseApplicationStatus(status) {
  const statusMap = {
    Submitted: "SUBMITTED",
    Reviewed: "REVIEWED",
    Shortlisted: "SHORTLISTED",
    "Interview Scheduled": "INTERVIEW_SCHEDULED",
    Rejected: "REJECTED",
  }

  return statusMap[status] || null
}

function formatApplication(application) {
  return {
    id: application.id,
    jobId: application.jobId,
    userId: application.userId,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    cvFileName: application.cvFileName,
    cvFileUrl: application.cvFileUrl,
    coverNote: application.coverNote,
    status: formatApplicationStatus(application.status),
    submittedAt: new Intl.DateTimeFormat("en-GB").format(application.createdAt),
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    job: application.job
      ? {
          id: application.job.id,
          title: application.job.title,
          company: application.job.company,
          location: application.job.location,
          type: application.job.type,
          category: application.job.category,
          deadline: application.job.deadline,
          status: application.job.status,
        }
      : null,
    applicant: application.user
      ? {
          id: application.user.id,
          name: application.user.name,
          email: application.user.email,
          phone: application.user.phone,
        }
      : null,
  }
}

router.post("/jobs/:jobId", protect, allowRoles("JOB_SEEKER"), async (req, res) => {
  try {
    const { jobId } = req.params
    const { fullName, email, phone, cvFileName,
        cvFileUrl, coverNote } = req.body

    if (!fullName || !email) {
      return res.status(400).json({
        status: "error",
        message: "Full name and email are required.",
      })
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        status: "APPROVED",
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    })

    

    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found or not open for applications.",
      })
    }

    const deadlineDate = parseDeadline(job.deadline)
    const today = getTodayDateOnly()

    if (!deadlineDate || deadlineDate <= today) {
    return res.status(400).json({
        status: "error",
        message: "This job is no longer accepting applications because the deadline has been reached.",
    })
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        userId: req.user.id,
      },
    })

    if (existingApplication) {
      return res.status(409).json({
        status: "error",
        message: "You have already applied for this job.",
      })
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: req.user.id,
        fullName,
        email,
        phone,
        cvFileName: cvFileName || "",
        cvFileUrl: cvFileUrl || "",
        coverNote: coverNote || "",
        status: "SUBMITTED",
      },
      include: {
        job: true,
        user: true,
      },
    })

    try {
      if (job.employer?.user?.email) {
        await sendNewApplicationEmail({
          to: job.employer.user.email,
          employerName: job.employer.companyName || job.employer.user.name,
          jobTitle: job.title,
          applicantName: fullName,
        })
      }
    } catch (emailError) {
      console.error("New application email failed:", emailError)
    }

    res.status(201).json({
      status: "success",
      message: "Application submitted successfully.",
      application: formatApplication(application),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to submit application.",
    })
  }
})

router.get("/my-applications", protect, allowRoles("JOB_SEEKER"), async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        job: true,
        user: true,
      },
    })

    res.json({
      status: "success",
      applications: applications.map(formatApplication),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch your applications.",
    })
  }
})

router.get(
  "/employer/applications",
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

      const applications = await prisma.application.findMany({
        where: {
          job: {
            employerId: employerProfile.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          job: true,
          user: true,
        },
      })

      res.json({
        status: "success",
        applications: applications.map(formatApplication),
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to fetch employer applications.",
      })
    }
  }
)

router.patch(
  "/:applicationId/status",
  protect,
  allowRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const { applicationId } = req.params
      const { status } = req.body

      const newStatus = normaliseApplicationStatus(status)

      if (!newStatus) {
        return res.status(400).json({
          status: "error",
          message: "Invalid application status.",
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

      const existingApplication = await prisma.application.findFirst({
        where: {
          id: applicationId,
          job: {
            employerId: employerProfile.id,
          },
        },
        include: {
          user: true,
          job: {
            include: {
              employer: true,
            },
          },
        },
      })

      if (!existingApplication) {
        return res.status(404).json({
          status: "error",
          message: "Application not found for this employer.",
        })
      }

      const updatedApplication = await prisma.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status: newStatus,
        },
        include: {
          job: true,
          user: true,
        },
      })

      await createAuditLog({
        req,
        action: "EMPLOYER_UPDATED_APPLICATION_STATUS",
        targetType: "Application",
        targetId: existingApplication.id,
        description: `Employer changed application status to ${newStatus} for applicant: ${existingApplication.fullName}`,
        metadata: {
          applicationId: existingApplication.id,
          applicantName: existingApplication.fullName,
          applicantEmail: existingApplication.email,
          jobId: existingApplication.jobId,
          jobTitle: existingApplication.job?.title,
          employerId: employerProfile.id,
          previousStatus: existingApplication.status,
          newStatus,
        },
      })

      try {
        if (existingApplication.user?.email) {
          await sendApplicationStatusEmail({
            to: existingApplication.user.email,
            applicantName:
              existingApplication.fullName || existingApplication.user.name,
            jobTitle: existingApplication.job?.title || "your job application",
            status: newStatus,
          })
        }
      } catch (emailError) {
        console.error("Application status email failed:", emailError)
      }

      await prisma.notification.create({
        data: {
          userId: updatedApplication.userId,
          jobId: updatedApplication.jobId,
          title: "Application status updated",
          message: `Your application for ${updatedApplication.job.title} is now ${formatApplicationStatus(
            updatedApplication.status
          )}.`,
          status: formatApplicationStatus(updatedApplication.status),
        },
      })

      res.json({
        status: "success",
        message: "Application status updated successfully.",
        application: formatApplication(updatedApplication),
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to update application status.",
      })
    }
  }
)

export default router