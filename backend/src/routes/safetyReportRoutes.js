import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

function formatReportStatus(status) {
  if (status === "SUBMITTED") return "Submitted"
  if (status === "INVESTIGATING") return "Investigating"
  if (status === "RESOLVED") return "Resolved"
  return "Submitted"
}

function normaliseReportStatus(status) {
  const statusMap = {
    Submitted: "SUBMITTED",
    Investigating: "INVESTIGATING",
    Resolved: "RESOLVED",
  }

  return statusMap[status] || null
}

function formatSafetyReport(report) {
  return {
    id: report.id,
    name: report.name,
    email: report.email,
    phone: report.phone,
    jobTitle: report.jobTitle,
    message: report.message,
    status: formatReportStatus(report.status),
    submittedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(report.createdAt),
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  }
}

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, jobTitle, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and report message are required.",
      })
    }

    const report = await prisma.safetyReport.create({
      data: {
        name,
        email,
        phone: phone || "",
        jobTitle: jobTitle || "",
        message,
        status: "SUBMITTED",
      },
    })

    res.status(201).json({
      status: "success",
      message: "Safety report submitted successfully.",
      report: formatSafetyReport(report),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to submit safety report.",
    })
  }
})

router.get("/admin/all", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const reports = await prisma.safetyReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json({
      status: "success",
      reports: reports.map(formatSafetyReport),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch safety reports.",
    })
  }
})

router.patch("/:reportId/status", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const { reportId } = req.params
    const { status } = req.body

    const newStatus = normaliseReportStatus(status)

    if (!newStatus) {
      return res.status(400).json({
        status: "error",
        message: "Invalid safety report status.",
      })
    }

    const existingReport = await prisma.safetyReport.findUnique({
      where: {
        id: reportId,
      },
    })

    if (!existingReport) {
      return res.status(404).json({
        status: "error",
        message: "Safety report not found.",
      })
    }

    const updatedReport = await prisma.safetyReport.update({
      where: {
        id: reportId,
      },
      data: {
        status: newStatus,
      },
    })

    res.json({
      status: "success",
      message: "Safety report status updated successfully.",
      report: formatSafetyReport(updatedReport),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to update safety report status.",
    })
  }
})

export default router