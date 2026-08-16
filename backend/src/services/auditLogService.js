import prisma from "../config/prisma.js"

function cleanText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength)
}

function getRequestIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    null
  )
}

export async function createAuditLog({
  req,
  action,
  targetType,
  targetId,
  description,
  metadata = {},
}) {
  try {
    const actor = req?.user || {}

    await prisma.auditLog.create({
      data: {
        action: cleanText(action, 120),
        actorId: actor.id || null,
        actorRole: actor.role || null,
        actorName: actor.name || null,
        actorEmail: actor.email || null,
        targetType: cleanText(targetType, 120),
        targetId: targetId ? String(targetId) : null,
        description: cleanText(description, 1000),
        metadata,
        ipAddress: getRequestIp(req),
        userAgent: req?.headers?.["user-agent"] || null,
      },
    })
  } catch (error) {
    console.error("Audit log creation failed:", error)
  }
}