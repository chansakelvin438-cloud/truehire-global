import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

const companyLogoFolder = path.join(process.cwd(), "uploads", "company-logos")
const cvFolder = path.join(process.cwd(), "uploads", "cvs")
const businessRegistrationFolder = path.join(
  process.cwd(),
  "uploads",
  "verification-documents",
  "business-registration"
)
const taxDocumentFolder = path.join(
  process.cwd(),
  "uploads",
  "verification-documents",
  "tax-documents"
)
const authorizationLetterFolder = path.join(
  process.cwd(),
  "uploads",
  "verification-documents",
  "authorization-letters"
)

const folders = [
  companyLogoFolder,
  cvFolder,
  businessRegistrationFolder,
  taxDocumentFolder,
  authorizationLetterFolder,
]

for (const folder of folders) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }
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

function verificationDocumentFileFilter(req, file, cb) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only PDF, DOC, DOCX, JPG, PNG, and WEBP files are allowed.")
    )
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

const businessRegistrationUpload = multer({
  storage: createStorage(businessRegistrationFolder),
  fileFilter: verificationDocumentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

const taxDocumentUpload = multer({
  storage: createStorage(taxDocumentFolder),
  fileFilter: verificationDocumentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

const authorizationLetterUpload = multer({
  storage: createStorage(authorizationLetterFolder),
  fileFilter: verificationDocumentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

function getBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`
}

function sendUploadedFileResponse(req, res, publicPath, successMessage) {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "No file uploaded.",
    })
  }

  const baseUrl = getBaseUrl(req)

  return res.status(201).json({
    status: "success",
    message: successMessage,
    fileName: req.file.originalname,
    storedFileName: req.file.filename,
    fileUrl: `${baseUrl}${publicPath}/${req.file.filename}`,
  })
}

function sendProtectedUploadedFileResponse(
  req,
  res,
  protectedPath,
  successMessage
) {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "No file uploaded.",
    })
  }

  const baseUrl = getBaseUrl(req)

  return res.status(201).json({
    status: "success",
    message: successMessage,
    fileName: req.file.originalname,
    storedFileName: req.file.filename,
    fileUrl: `${baseUrl}${protectedPath}/${req.file.filename}`,
  })
}

router.post(
  "/company-logo",
  protect,
  allowRoles("EMPLOYER"),
  companyLogoUpload.single("file"),
  (req, res) => {
    try {
      return sendUploadedFileResponse(
        req,
        res,
        "/uploads/company-logos",
        "Company logo uploaded successfully."
      )
    } catch (error) {
      console.error(error)

      return res.status(500).json({
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
      return sendProtectedUploadedFileResponse(
        req,
        res,
        "/api/files/cvs",
        "CV uploaded successfully."
      )
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        status: "error",
        message: "Failed to upload CV.",
      })
    }
  }
)

router.post(
  "/verification/business-registration",
  protect,
  allowRoles("EMPLOYER"),
  businessRegistrationUpload.single("file"),
  (req, res) => {
    try {
      return sendProtectedUploadedFileResponse(
        req,
        res,
        "/api/files/verification/business-registration",
        "Business registration document uploaded successfully."
      )
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        status: "error",
        message: "Failed to upload business registration document.",
      })
    }
  }
)

router.post(
  "/verification/tax-document",
  protect,
  allowRoles("EMPLOYER"),
  taxDocumentUpload.single("file"),
  (req, res) => {
    try {
      return sendProtectedUploadedFileResponse(
        req,
        res,
        "/api/files/verification/tax-documents",
        "Tax document uploaded successfully."
      )
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        status: "error",
        message: "Failed to upload tax document.",
      })
    }
  }
)

router.post(
  "/verification/authorization-letter",
  protect,
  allowRoles("EMPLOYER"),
  authorizationLetterUpload.single("file"),
  (req, res) => {
    try {
      return sendProtectedUploadedFileResponse(
        req,
        res,
        "/api/files/verification/authorization-letters",
        "Authorization letter uploaded successfully."
      )
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        status: "error",
        message: "Failed to upload authorization letter.",
      })
    }
  }
)

export default router