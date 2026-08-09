import express from "express"
import path from "path"
import fs from "fs"
import prisma from "../config/prisma.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

function getSafeFileName(fileName) {
  if (!fileName) return null

  const cleanFileName = path.basename(fileName)

  if (
    cleanFileName !== fileName ||
    cleanFileName.includes("..") ||
    cleanFileName.includes("/") ||
    cleanFileName.includes("\\")
  ) {
    return null
  }

  return cleanFileName
}

function sendProtectedFile(res, folderPath, fileName) {
  const safeFileName = getSafeFileName(fileName)

  if (!safeFileName) {
    return res.status(400).json({
      status: "error",
      message: "Invalid file request.",
    })
  }

  const filePath = path.join(folderPath, safeFileName)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "error",
      message: "File not found.",
    })
  }

  return res.sendFile(filePath)
}

router.get("/cvs/:fileName", protect, async (req, res) => {
  try {
    const { fileName } = req.params
    const safeFileName = getSafeFileName(fileName)

    if (!safeFileName) {
      return res.status(400).json({
        status: "error",
        message: "Invalid CV request.",
      })
    }

    const application = await prisma.application.findFirst({
      where: {
        cvFileUrl: {
          contains: safeFileName,
        },
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
        message: "CV record not found.",
      })
    }

    const isAdmin = req.user.role === "ADMIN"
    const isApplicant = application.userId === req.user.id
    const isEmployer =
      req.user.role === "EMPLOYER" &&
      application.job?.employer?.userId === req.user.id

    if (!isAdmin && !isApplicant && !isEmployer) {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to open this CV.",
      })
    }

    const cvFolder = path.join(process.cwd(), "uploads", "cvs")

    return sendProtectedFile(res, cvFolder, safeFileName)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      status: "error",
      message: "Failed to open CV.",
    })
  }
})

router.get(
  "/verification/:documentType/:fileName",
  protect,
  async (req, res) => {
    try {
      const { documentType, fileName } = req.params
      const safeFileName = getSafeFileName(fileName)

      if (!safeFileName) {
        return res.status(400).json({
          status: "error",
          message: "Invalid document request.",
        })
      }

      const documentConfig = {
        "business-registration": {
          fieldName: "businessRegistrationFileUrl",
          folderPath: path.join(
            process.cwd(),
            "uploads",
            "verification-documents",
            "business-registration"
          ),
        },
        "tax-documents": {
          fieldName: "taxDocumentFileUrl",
          folderPath: path.join(
            process.cwd(),
            "uploads",
            "verification-documents",
            "tax-documents"
          ),
        },
        "authorization-letters": {
          fieldName: "authorizationLetterFileUrl",
          folderPath: path.join(
            process.cwd(),
            "uploads",
            "verification-documents",
            "authorization-letters"
          ),
        },
      }

      const selectedDocument = documentConfig[documentType]

      if (!selectedDocument) {
        return res.status(400).json({
          status: "error",
          message: "Invalid verification document type.",
        })
      }

      const verification = await prisma.employerVerification.findFirst({
        where: {
          [selectedDocument.fieldName]: {
            contains: safeFileName,
          },
        },
        include: {
          employer: true,
        },
      })

      if (!verification) {
        return res.status(404).json({
          status: "error",
          message: "Verification document record not found.",
        })
      }

      const isAdmin = req.user.role === "ADMIN"
      const isEmployerOwner =
        req.user.role === "EMPLOYER" &&
        verification.employer?.userId === req.user.id

      if (!isAdmin && !isEmployerOwner) {
        return res.status(403).json({
          status: "error",
          message: "You are not allowed to open this document.",
        })
      }

      return sendProtectedFile(
        res,
        selectedDocument.folderPath,
        safeFileName
      )
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        status: "error",
        message: "Failed to open verification document.",
      })
    }
  }
)

export default router