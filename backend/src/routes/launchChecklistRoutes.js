import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import { createAuditLog } from "../services/auditLogService.js"

const router = express.Router()

const allowedStatuses = ["PENDING", "IN_PROGRESS", "DONE", "BLOCKED"]

const defaultChecklistItems = [
  {
    key: "domain-live",
    category: "Deployment",
    title: "Custom domain is live",
    description: "Confirm truehireglobal.com opens correctly on desktop and mobile.",
  },
  {
    key: "backend-live",
    category: "Deployment",
    title: "Backend API is live",
    description: "Confirm Render backend health endpoint and live API routes are working.",
  },
  {
    key: "database-storage",
    category: "Deployment",
    title: "Database and storage are connected",
    description: "Confirm Neon database and Supabase file uploads work on the live site.",
  },
  {
    key: "admin-roles",
    category: "Security",
    title: "Admin access is protected",
    description: "Confirm only admin accounts can access admin dashboard controls.",
  },
  {
    key: "session-timeout",
    category: "Security",
    title: "Dormant users are logged out",
    description: "Confirm admin, employer, and job seeker accounts log out after inactivity.",
  },
  {
    key: "protected-files",
    category: "Security",
    title: "CVs and verification files are protected",
    description: "Confirm private files cannot be opened without a valid authorised login.",
  },
  {
    key: "manual-payments",
    category: "Payments",
    title: "Manual payment confirmation works",
    description: "Confirm employer submits payment reference and admin confirms or rejects it.",
  },
  {
    key: "job-review",
    category: "Jobs",
    title: "Job review process works",
    description: "Confirm jobs move from payment confirmation to pending review, then approved, rejected, or flagged.",
  },
  {
    key: "employer-verification",
    category: "Verification",
    title: "Employer verification works",
    description: "Confirm employers can submit documents and admin can verify, reject, or flag them.",
  },
  {
    key: "email-notifications",
    category: "Communication",
    title: "Core email notifications work",
    description: "Confirm OTP, payment, job status, new application, and application status emails are delivered.",
  },
  {
    key: "audit-trail",
    category: "Control",
    title: "Audit trail records key actions",
    description: "Confirm payment, job, application, and employer verification actions appear in audit logs.",
  },
  {
    key: "seo-pages",
    category: "SEO",
    title: "SEO basics are ready",
    description: "Confirm sitemap, robots file, titles, privacy, terms, payment policy, and job posting policy are live.",
  },
  {
    key: "mobile-testing",
    category: "Testing",
    title: "Mobile experience tested",
    description: "Confirm home, jobs, pricing, employer, sign-in, register, dashboard, and admin pages work on mobile.",
  },
  {
    key: "launch-content",
    category: "Marketing",
    title: "Launch content prepared",
    description: "Prepare launch message, employer outreach message, social media posts, and support contact details.",
  },
]

function cleanText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength)
}

async function ensureDefaultChecklistItems() {
  for (const item of defaultChecklistItems) {
    await prisma.launchChecklistItem.upsert({
      where: { key: item.key },
      update: {
        category: item.category,
        title: item.title,
        description: item.description,
      },
      create: item,
    })
  }
}

router.get("/admin", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    await ensureDefaultChecklistItems()

    const items = await prisma.launchChecklistItem.findMany({
      orderBy: [
        { category: "asc" },
        { createdAt: "asc" },
      ],
    })

    const total = items.length
    const done = items.filter((item) => item.status === "DONE").length
    const blocked = items.filter((item) => item.status === "BLOCKED").length
    const inProgress = items.filter((item) => item.status === "IN_PROGRESS").length

    res.json({
      status: "success",
      items,
      summary: {
        total,
        done,
        blocked,
        inProgress,
        pending: total - done - blocked - inProgress,
        completionRate: total ? Math.round((done / total) * 100) : 0,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Could not load launch checklist.",
    })
  }
})

router.patch("/admin/:key", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const { key } = req.params
    const { status, adminNote } = req.body

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid checklist status.",
      })
    }

    const existingItem = await prisma.launchChecklistItem.findUnique({
      where: { key },
    })

    if (!existingItem) {
      return res.status(404).json({
        status: "error",
        message: "Checklist item not found.",
      })
    }

    const updatedItem = await prisma.launchChecklistItem.update({
      where: { key },
      data: {
        status,
        adminNote: cleanText(adminNote, 1000),
        completedAt: status === "DONE" ? new Date() : null,
      },
    })

    await createAuditLog({
      req,
      action: "ADMIN_UPDATED_LAUNCH_CHECKLIST",
      targetType: "LaunchChecklistItem",
      targetId: updatedItem.id,
      description: `Admin updated launch checklist item to ${status}: ${updatedItem.title}`,
      metadata: {
        key: updatedItem.key,
        category: updatedItem.category,
        title: updatedItem.title,
        previousStatus: existingItem.status,
        newStatus: status,
        adminNote: cleanText(adminNote, 1000),
      },
    })

    res.json({
      status: "success",
      message: "Launch checklist item updated.",
      item: updatedItem,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Could not update launch checklist item.",
    })
  }
})

export default router