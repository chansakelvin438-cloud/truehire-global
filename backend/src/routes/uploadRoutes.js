import express from "express"
import multer from "multer"
import path from "path"
import {
  generateStorageFileName,
  getPublicFileUrl,
  storageBuckets,
  uploadToSupabaseStorage,
} from "../services/storageService.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

const imageTypes = ["image/jpeg", "image/png", "image/webp"]
const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

function isAllowedExtension(originalName, allowedExtensions) {
  const ext = path.extname(originalName || "").toLowerCase()
  return allowedExtensions.includes(ext)
}

function validateFile(file, allowedMimeTypes, allowedExtensions) {
  if (!file) {
    throw new Error("No file uploaded.")
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Unsupported file type.")
  }

  if (!isAllowedExtension(file.originalname, allowedExtensions)) {
    throw new Error("Unsupported file extension.")
  }
}

function handleUploadError(error, res) {
  console.error(error)

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      status: "error",
      message: error.code === "LIMIT_FILE_SIZE" ? "File is too large." : error.message,
    })
  }

  return res.status(400).json({
    status: "error",
    message: error.message || "Upload failed.",
  })
}

router.post(
  "/company-logo",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      validateFile(req.file, imageTypes, [".jpg", ".jpeg", ".png", ".webp"])

      const fileName = generateStorageFileName(req.file.originalname)

      await uploadToSupabaseStorage({
        bucket: storageBuckets.companyLogos,
        filePath: fileName,
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
      })

      const fileUrl = getPublicFileUrl({
        bucket: storageBuckets.companyLogos,
        filePath: fileName,
      })

      res.status(201).json({
        status: "success",
        fileName,
        fileUrl,
      })
    } catch (error) {
      handleUploadError(error, res)
    }
  }
)

router.post("/cv", protect, upload.single("file"), async (req, res) => {
  try {
    validateFile(req.file, documentTypes, [".pdf", ".doc", ".docx"])

    const fileName = generateStorageFileName(req.file.originalname)

    await uploadToSupabaseStorage({
      bucket: storageBuckets.cvs,
      filePath: fileName,
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
    })

    res.status(201).json({
      status: "success",
      fileName,
      fileUrl: `/api/files/cvs/${fileName}`,
    })
  } catch (error) {
    handleUploadError(error, res)
  }
})

async function uploadVerificationDocument(req, res, documentType) {
  try {
    validateFile(req.file, [...documentTypes, ...imageTypes], [
      ".pdf",
      ".doc",
      ".docx",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ])

    const fileName = generateStorageFileName(req.file.originalname)
    const filePath = `${documentType}/${fileName}`

    await uploadToSupabaseStorage({
      bucket: storageBuckets.verificationDocs,
      filePath,
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
    })

    res.status(201).json({
      status: "success",
      fileName,
      fileUrl: `/api/files/verification/${documentType}/${fileName}`,
    })
  } catch (error) {
    handleUploadError(error, res)
  }
}

router.post(
  "/verification/business-registration",
  protect,
  upload.single("file"),
  async (req, res) => {
    await uploadVerificationDocument(req, res, "business-registration")
  }
)

router.post(
  "/verification/tax-document",
  protect,
  upload.single("file"),
  async (req, res) => {
    await uploadVerificationDocument(req, res, "tax-document")
  }
)

router.post(
  "/verification/authorization-letter",
  protect,
  upload.single("file"),
  async (req, res) => {
    await uploadVerificationDocument(req, res, "authorization-letter")
  }
)

export default router