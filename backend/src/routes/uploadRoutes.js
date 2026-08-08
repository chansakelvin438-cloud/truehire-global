import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

const companyLogoFolder = path.join(process.cwd(), "uploads", "company-logos")
const cvFolder = path.join(process.cwd(), "uploads", "cvs")

if (!fs.existsSync(companyLogoFolder)) {
  fs.mkdirSync(companyLogoFolder, { recursive: true })
}

if (!fs.existsSync(cvFolder)) {
  fs.mkdirSync(cvFolder, { recursive: true })
}

function createStorage(folder) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folder)
    },
    filename: function (req, file, cb) {
      const safeOriginalName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9.-]/g, "")

      const uniqueName = `${Date.now()}-${safeOriginalName}`

      cb(null, uniqueName)
    },
  })
}

function imageFileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP, and SVG images are allowed."))
  }

  cb(null, true)
}

function cvFileFilter(req, file, cb) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed."))
  }

  cb(null, true)
}

const companyLogoUpload = multer({
  storage: createStorage(companyLogoFolder),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
})

const cvUpload = multer({
  storage: createStorage(cvFolder),
  fileFilter: cvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

router.post(
  "/company-logo",
  protect,
  allowRoles("EMPLOYER"),
  companyLogoUpload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No logo file uploaded.",
        })
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`

      res.status(201).json({
        status: "success",
        message: "Company logo uploaded successfully.",
        fileName: req.file.filename,
        fileUrl: `${baseUrl}/uploads/company-logos/${req.file.filename}`,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to upload company logo.",
      })
    }
  }
)

router.post(
  "/cv",
  protect,
  allowRoles("JOB_SEEKER"),
  cvUpload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No CV file uploaded.",
        })
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`

      res.status(201).json({
        status: "success",
        message: "CV uploaded successfully.",
        fileName: req.file.originalname,
        storedFileName: req.file.filename,
        fileUrl: `${baseUrl}/uploads/cvs/${req.file.filename}`,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to upload CV.",
      })
    }
  }
)

export default router