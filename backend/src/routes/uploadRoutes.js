import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { randomUUID } from "crypto"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

const ONE_MB = 1024 * 1024

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

const uploadProfiles = {
  companyLogo: {
    folder: companyLogoFolder,
    maxSize: 2 * ONE_MB,
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    publicPath: "/uploads/company-logos",
    successMessage: "Company logo uploaded successfully.",
    errorLabel: "company logo",
  },

  cv: {
    folder: cvFolder,
    maxSize: 5 * ONE_MB,
    allowedExtensions: [".pdf", ".doc", ".docx"],
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    publicPath: "/api/files/cvs",
    successMessage: "CV uploaded successfully.",
    errorLabel: "CV",
  },

  businessRegistration: {
    folder: businessRegistrationFolder,
    maxSize: 5 * ONE_MB,
    allowedExtensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"],
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    publicPath: "/api/files/verification/business-registration",
    successMessage: "Business registration document uploaded successfully.",
    errorLabel: "business registration document",
  },

  taxDocument: {
    folder: taxDocumentFolder,
    maxSize: 5 * ONE_MB,
    allowedExtensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"],
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    publicPath: "/api/files/verification/tax-documents",
    successMessage: "Tax document uploaded successfully.",
    errorLabel: "tax document",
  },

  authorizationLetter: {
    folder: authorizationLetterFolder,
    maxSize: 5 * ONE_MB,
    allowedExtensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"],
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    publicPath: "/api/files/verification/authorization-letters",
    successMessage: "Authorization letter uploaded successfully.",
    errorLabel: "authorization letter",
  },
}

for (const profile of Object.values(uploadProfiles)) {
  if (!fs.existsSync(profile.folder)) {
    fs.mkdirSync(profile.folder, { recursive: true })
  }
}

function formatFileSize(bytes) {
  const mb = bytes / ONE_MB
  return `${mb.toFixed(mb >= 10 ? 0 : 1)}MB`
}

function getExtension(file) {
  return path.extname(file.originalname || "").toLowerCase()
}

function createStorage(profile) {
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, profile.folder)
    },

    filename(req, file, cb) {
      const extension = getExtension(file)
      const uniqueName = `${Date.now()}-${randomUUID()}${extension}`

      cb(null, uniqueName)
    },
  })
}

function createFileFilter(profile) {
  return function fileFilter(req, file, cb) {
    const extension = getExtension(file)

    if (!profile.allowedExtensions.includes(extension)) {
      return cb(
        new Error(
          `Invalid ${profile.errorLabel} extension. Allowed: ${profile.allowedExtensions.join(
            ", "
          )}.`
        )
      )
    }

    if (!profile.allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid ${profile.errorLabel} type. Please upload an allowed file format.`
        )
      )
    }

    return cb(null, true)
  }
}

function createUpload(profile) {
  return multer({
    storage: createStorage(profile),
    fileFilter: createFileFilter(profile),
    limits: {
      fileSize: profile.maxSize,
      files: 1,
    },
  }).single("file")
}

function hasBytes(buffer, bytes) {
  if (buffer.length < bytes.length) return false

  return bytes.every((byte, index) => buffer[index] === byte)
}

function isPdf(buffer) {
  return buffer.slice(0, 4).toString("utf8") === "%PDF"
}

function isJpeg(buffer) {
  return hasBytes(buffer, [0xff, 0xd8, 0xff])
}

function isPng(buffer) {
  return hasBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
}

function isWebp(buffer) {
  return (
    buffer.slice(0, 4).toString("utf8") === "RIFF" &&
    buffer.slice(8, 12).toString("utf8") === "WEBP"
  )
}

function isDoc(buffer) {
  return hasBytes(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
}

function isDocx(buffer) {
  return buffer.slice(0, 2).toString("utf8") === "PK"
}

function fileSignatureMatches(filePath, extension) {
  const buffer = fs.readFileSync(filePath)

  if (extension === ".pdf") return isPdf(buffer)
  if (extension === ".jpg" || extension === ".jpeg") return isJpeg(buffer)
  if (extension === ".png") return isPng(buffer)
  if (extension === ".webp") return isWebp(buffer)
  if (extension === ".doc") return isDoc(buffer)
  if (extension === ".docx") return isDocx(buffer)

  return false
}

function deleteFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error("Failed to delete unsafe upload:", error)
  }
}

function getBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`
}

function getUploadErrorMessage(error, profile) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return `The ${profile.errorLabel} is too large. Maximum allowed size is ${formatFileSize(
        profile.maxSize
      )}.`
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return "Only one file can be uploaded at a time."
    }

    return "Upload failed. Please check the selected file."
  }

  return error.message || "Upload failed. Please try again."
}

function sendUploadedFileResponse(req, res, profile) {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "No file uploaded.",
    })
  }

  const extension = getExtension(req.file)
  const filePath = req.file.path

  if (!fileSignatureMatches(filePath, extension)) {
    deleteFileIfExists(filePath)

    return res.status(400).json({
      status: "error",
      message:
        "The uploaded file content does not match the selected file type. Please upload a valid file.",
    })
  }

  const baseUrl = getBaseUrl(req)

  return res.status(201).json({
    status: "success",
    message: profile.successMessage,
    fileName: req.file.originalname,
    storedFileName: req.file.filename,
    fileUrl: `${baseUrl}${profile.publicPath}/${req.file.filename}`,
  })
}

function handleUpload(profile) {
  const upload = createUpload(profile)

  return function uploadHandler(req, res) {
    upload(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          message: getUploadErrorMessage(error, profile),
        })
      }

      try {
        return sendUploadedFileResponse(req, res, profile)
      } catch (error) {
        console.error(error)

        if (req.file?.path) {
          deleteFileIfExists(req.file.path)
        }

        return res.status(500).json({
          status: "error",
          message: `Failed to upload ${profile.errorLabel}.`,
        })
      }
    })
  }
}

router.post(
  "/company-logo",
  protect,
  allowRoles("EMPLOYER"),
  handleUpload(uploadProfiles.companyLogo)
)

router.post(
  "/cv",
  protect,
  allowRoles("JOB_SEEKER"),
  handleUpload(uploadProfiles.cv)
)

router.post(
  "/verification/business-registration",
  protect,
  allowRoles("EMPLOYER"),
  handleUpload(uploadProfiles.businessRegistration)
)

router.post(
  "/verification/tax-document",
  protect,
  allowRoles("EMPLOYER"),
  handleUpload(uploadProfiles.taxDocument)
)

router.post(
  "/verification/authorization-letter",
  protect,
  allowRoles("EMPLOYER"),
  handleUpload(uploadProfiles.authorizationLetter)
)

export default router