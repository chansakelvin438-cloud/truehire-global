import express from "express"
import prisma from "../config/prisma.js"
import { protect } from "../middleware/authMiddleware.js"
import {
  downloadFromSupabaseStorage,
  storageBuckets,
} from "../services/storageService.js"

const router = express.Router()

function sendFileResponse(res, { buffer, contentType, fileName }) {
  res.setHeader("Content-Type", contentType)
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`)
  res.send(buffer)
}

router.get("/cvs/:fileName", protect, async (req, res) => {
  try {
    const { fileName } = req.params
    const user = req.user

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ cvFileName: fileName }, { cvFileUrl: { contains: fileName } }],
      },
      include: {
        job: {
          include: {
            employer: true,
          },
        },
      },
    })

    if (!application) {
      return res.status(404).json({
        status: "error",
        message: "CV not found.",
      })
    }

    const isAdmin = user.role === "ADMIN"
    const isApplicant = application.userId === user.id
    const isEmployerOwner =
      user.role === "EMPLOYER" &&
      application.job?.employer?.userId === user.id

    if (!isAdmin && !isApplicant && !isEmployerOwner) {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to access this CV.",
      })
    }

    const file = await downloadFromSupabaseStorage({
      bucket: storageBuckets.cvs,
      filePath: fileName,
    })

    sendFileResponse(res, {
      ...file,
      fileName,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: "error",
      message: "Could not open file.",
    })
  }
})

router.get(
  "/verification/:documentType/:fileName",
  protect,
  async (req, res) => {
    try {
      const { documentType, fileName } = req.params
      const user = req.user

      const allowedDocumentTypes = [
        "business-registration",
        "tax-document",
        "authorization-letter",
      ]

      if (!allowedDocumentTypes.includes(documentType)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid document type.",
        })
      }

      const verification = await prisma.employerVerification.findFirst({
        where: {
          OR: [
            { businessRegistrationFileName: fileName },
            { businessRegistrationFileUrl: { contains: fileName } },
            { taxDocumentFileName: fileName },
            { taxDocumentFileUrl: { contains: fileName } },
            { authorizationLetterFileName: fileName },
            { authorizationLetterFileUrl: { contains: fileName } },
          ],
        },
        include: {
          employer: true,
        },
      })

      if (!verification) {
        return res.status(404).json({
          status: "error",
          message: "Verification document not found.",
        })
      }

      const isAdmin = user.role === "ADMIN"
      const isEmployerOwner =
        user.role === "EMPLOYER" && verification.employer?.userId === user.id

      if (!isAdmin && !isEmployerOwner) {
        return res.status(403).json({
          status: "error",
          message: "You are not allowed to access this document.",
        })
      }

      const file = await downloadFromSupabaseStorage({
        bucket: storageBuckets.verificationDocs,
        filePath: `${documentType}/${fileName}`,
      })

      sendFileResponse(res, {
        ...file,
        fileName,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        status: "error",
        message: "Could not open file.",
      })
    }
  }
)

export default router