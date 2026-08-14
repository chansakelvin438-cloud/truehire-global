import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

function cleanText(value, maxLength = 120) {
  return String(value || "").trim().slice(0, maxLength)
}

router.get("/admin", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1))
    const limit = Math.min(100, Math.max(10, Number(req.query.limit || 25)))
    const skip = (page - 1) * limit

    const action = cleanText(req.query.action)
    const targetType = cleanText(req.query.targetType)
    const search = cleanText(req.query.search, 200)

    const where = {
      ...(action ? { action } : {}),
      ...(targetType ? { targetType } : {}),
      ...(search
        ? {
            OR: [
              { action: { contains: search } },
              { actorEmail: { contains: search } },
              { actorName: { contains: search } },
              { targetType: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    }

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    res.json({
      status: "success",
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Could not load audit logs.",
    })
  }
})

export default router