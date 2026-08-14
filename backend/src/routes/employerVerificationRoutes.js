import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import {
  cleanEmail,
  cleanPhone,
  cleanText,
  isValidEmail,
  rejectDangerousInput,
} from "../utils/validation.js"
import { createAuditLog } from "../services/auditLogServices.js"

const router = express.Router()

function formatVerificationStatus(status) {
  if (status === "VERIFICATION_PENDING") return "Verification Pending"
  if (status === "SUBMITTED_FOR_REVIEW") return "Submitted for Review"
  if (status === "VERIFIED") return "Verified"
  if (status === "FLAGGED") return "Flagged"
  if (status === "REJECTED") return "Rejected"
  return "Verification Pending"
}

function normaliseVerificationStatus(status) {
  const cleanStatus = cleanText(status, 50)
    .toUpperCase()
    .replace(/[\s-]/g, "_")

  const statusMap = {
    VERIFICATION_PENDING: "VERIFICATION_PENDING",
    SUBMITTED_FOR_REVIEW: "SUBMITTED_FOR_REVIEW",
    SUBMITTED: "SUBMITTED_FOR_REVIEW",
    VERIFIED: "VERIFIED",
    FLAGGED: "FLAGGED",
    REJECTED: "REJECTED",
  }

  return statusMap[cleanStatus] || null
}

function isValidWebsiteUrl(website) {
  if (!website) return true

  try {
    const url = new URL(website)

    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isAllowedVerificationDocumentUrl(fileUrl, documentType) {
  if (!fileUrl || typeof fileUrl !== "string") {
    return false
  }

  const documentTypeMap = {
    businessRegistration: "business-registration",
    taxDocument: "tax-document",
    authorizationLetter: "authorization-letter",
    "business-registration": "business-registration",
    "tax-document": "tax-document",
    "authorization-letter": "authorization-letter",
  }

  const storageDocumentType = documentTypeMap[documentType]

  if (!storageDocumentType) {
    return false
  }

  const allowedNewPath = `/api/files/verification/${storageDocumentType}/`
  const allowedOldPath = "/uploads/verification-documents/"

  return (
    fileUrl.startsWith(allowedNewPath) ||
    fileUrl.startsWith(allowedOldPath)
  )
}

function formatVerificationRequest(request) {
  return {
    id: request.id,
    employerId: request.employerId,
    companyName: request.companyName,
    email: request.email,
    phone: request.phone,
    companyRegistrationNumber: request.companyRegistrationNumber,
    tpin: request.tpin,
    businessType: request.businessType,
    address: request.address,
    contactPerson: request.contactPerson,
    website: request.website,

    businessRegistrationFileName: request.businessRegistrationFileName,
    businessRegistrationFileUrl: request.businessRegistrationFileUrl,

    taxDocumentFileName: request.taxDocumentFileName,
    taxDocumentFileUrl: request.taxDocumentFileUrl,

    authorizationLetterFileName: request.authorizationLetterFileName,
    authorizationLetterFileUrl: request.authorizationLetterFileUrl,

    status: formatVerificationStatus(request.status),
    submittedAt: new Intl.DateTimeFormat("en-GB").format(request.createdAt),
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,

    employer: request.employer
      ? {
          id: request.employer.id,
          companyName: request.employer.companyName,
          phone: request.employer.phone,
          website: request.employer.website,
          address: request.employer.address,
          verificationStatus: formatVerificationStatus(
            request.employer.verificationStatus
          ),
          user: request.employer.user
            ? {
                id: request.employer.user.id,
                name: request.employer.user.name,
                email: request.employer.user.email,
                phone: request.employer.user.phone,
              }
            : null,
        }
      : null,
  }
}

router.post("/", protect, allowRoles("EMPLOYER"), async (req, res) => {
  try {
    const unsafeInputError = rejectDangerousInput({
      "Company name": req.body.companyName,
      Email: req.body.email,
      Phone: req.body.phone,
      "Company registration number": req.body.companyRegistrationNumber,
      TPIN: req.body.tpin,
      "Business type": req.body.businessType,
      Address: req.body.address,
      "Contact person": req.body.contactPerson,
      Website: req.body.website,

      "Business registration file name": req.body.businessRegistrationFileName,
      "Business registration file link": req.body.businessRegistrationFileUrl,

      "Tax document file name": req.body.taxDocumentFileName,
      "Tax document file link": req.body.taxDocumentFileUrl,

      "Authorisation letter file name": req.body.authorizationLetterFileName,
      "Authorisation letter file link": req.body.authorizationLetterFileUrl,
    })

    if (unsafeInputError) {
      return res.status(400).json({
        status: "error",
        message: unsafeInputError,
      })
    }

    const employerProfile = await prisma.employerProfile.findUnique({
      where: {
        userId: req.user.id,
      },
    })

    if (!employerProfile) {
      return res.status(400).json({
        status: "error",
        message: "Employer profile not found.",
      })
    }

    const companyName = cleanText(req.body.companyName, 160)
    const email = cleanEmail(req.body.email)
    const phone = cleanPhone(req.body.phone)
    const companyRegistrationNumber = cleanText(
      req.body.companyRegistrationNumber,
      120
    )
    const tpin = cleanText(req.body.tpin, 80)
    const businessType = cleanText(req.body.businessType, 120)
    const address = cleanText(req.body.address, 250)
    const contactPerson = cleanText(req.body.contactPerson, 120)
    const website = cleanText(req.body.website, 250)

    const businessRegistrationFileName = cleanText(
      req.body.businessRegistrationFileName,
      260
    )
    const businessRegistrationFileUrl = cleanText(
      req.body.businessRegistrationFileUrl,
      1000
    )

    const taxDocumentFileName = cleanText(req.body.taxDocumentFileName, 260)
    const taxDocumentFileUrl = cleanText(req.body.taxDocumentFileUrl, 1000)

    const authorizationLetterFileName = cleanText(
      req.body.authorizationLetterFileName,
      260
    )
    const authorizationLetterFileUrl = cleanText(
      req.body.authorizationLetterFileUrl,
      1000
    )

    if (
      !companyName ||
      !email ||
      !companyRegistrationNumber ||
      !tpin ||
      !businessType ||
      !address ||
      !contactPerson
    ) {
      return res.status(400).json({
        status: "error",
        message: "Please fill in all required verification fields.",
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid company email address.",
      })
    }

    if (!isValidWebsiteUrl(website)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid website link beginning with http:// or https://.",
      })
    }

    if (
      !isAllowedVerificationDocumentUrl(
        businessRegistrationFileUrl,
        "businessRegistration"
      )
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid business registration document link.",
      })
    }

    if (!isAllowedVerificationDocumentUrl(taxDocumentFileUrl, "taxDocument")) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tax document link.",
      })
    }

    if (
      !isAllowedVerificationDocumentUrl(
        authorizationLetterFileUrl,
        "authorizationLetter"
      )
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid authorisation letter link.",
      })
    }

    if (companyName.length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Company name is too short.",
      })
    }

    if (companyRegistrationNumber.length < 3) {
      return res.status(400).json({
        status: "error",
        message: "Company registration number is too short.",
      })
    }

    if (tpin.length < 3) {
      return res.status(400).json({
        status: "error",
        message: "TPIN is too short.",
      })
    }

    const request = await prisma.employerVerification.create({
      data: {
        employerId: employerProfile.id,
        companyName,
        email,
        phone: phone || "",
        companyRegistrationNumber,
        tpin,
        businessType,
        address,
        contactPerson,
        website: website || "",

        businessRegistrationFileName: businessRegistrationFileName || "",
        businessRegistrationFileUrl: businessRegistrationFileUrl || "",

        taxDocumentFileName: taxDocumentFileName || "",
        taxDocumentFileUrl: taxDocumentFileUrl || "",

        authorizationLetterFileName: authorizationLetterFileName || "",
        authorizationLetterFileUrl: authorizationLetterFileUrl || "",

        status: "SUBMITTED_FOR_REVIEW",
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    })

    await createAuditLog({
      req,
      action: "EMPLOYER_SUBMITTED_VERIFICATION",
      targetType: "EmployerVerification",
      targetId: verification.id,
      description: `Employer submitted verification for company: ${companyName}`,
      metadata: {
        verificationId: verification.id,
        employerId: employerProfile.id,
        companyName,
        companyRegistrationNumber,
        tpin,
        businessType,
        email,
        phone,
        status: verification.status,
      },
    })

    await prisma.employerProfile.update({
      where: {
        id: employerProfile.id,
      },
      data: {
        companyName,
        phone: phone || employerProfile.phone,
        website: website || employerProfile.website,
        address,
        verificationStatus: "SUBMITTED_FOR_REVIEW",
      },
    })

    res.status(201).json({
      status: "success",
      message: "Employer verification submitted successfully.",
      verification: formatVerificationRequest(request),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to submit employer verification.",
    })
  }
})

router.get(
  "/my-verification",
  protect,
  allowRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: {
          userId: req.user.id,
        },
      })

      if (!employerProfile) {
        return res.status(400).json({
          status: "error",
          message: "Employer profile not found.",
        })
      }

      const verification = await prisma.employerVerification.findFirst({
        where: {
          employerId: employerProfile.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          employer: {
            include: {
              user: true,
            },
          },
        },
      })

      res.json({
        status: "success",
        verificationStatus: formatVerificationStatus(
          employerProfile.verificationStatus
        ),
        verification: verification ? formatVerificationRequest(verification) : null,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to fetch employer verification.",
      })
    }
  }
)

router.get("/admin/all", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const verifications = await prisma.employerVerification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    })

    res.json({
      status: "success",
      verifications: verifications.map(formatVerificationRequest),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch employer verification requests.",
    })
  }
})

router.patch("/:verificationId/status", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const { verificationId } = req.params
    const requestedStatus = cleanText(req.body.status, 50)

    const newStatus = normaliseVerificationStatus(requestedStatus)

    if (!newStatus) {
      return res.status(400).json({
        status: "error",
        message: "Invalid verification status.",
      })
    }

    const existingVerification = await prisma.employerVerification.findUnique({
      where: {
        id: verificationId,
      },
    })

    if (!existingVerification) {
      return res.status(404).json({
        status: "error",
        message: "Verification request not found.",
      })
    }

    const updatedVerification = await prisma.employerVerification.update({
      where: {
        id: verificationId,
      },
      data: {
        status: newStatus,
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    })

    await createAuditLog({
      req,
      action:
        status === "VERIFIED"
          ? "ADMIN_APPROVED_EMPLOYER_VERIFICATION"
          : status === "REJECTED"
            ? "ADMIN_REJECTED_EMPLOYER_VERIFICATION"
            : status === "FLAGGED"
              ? "ADMIN_FLAGGED_EMPLOYER_VERIFICATION"
              : "ADMIN_UPDATED_EMPLOYER_VERIFICATION",
      targetType: "EmployerVerification",
      targetId: updatedVerification.id,
      description: `Admin changed employer verification status to ${status}: ${updatedVerification.companyName}`,
      metadata: {
        verificationId: updatedVerification.id,
        employerId: updatedVerification.employerId,
        companyName: updatedVerification.companyName,
        companyRegistrationNumber: updatedVerification.companyRegistrationNumber,
        tpin: updatedVerification.tpin,
        previousStatus: verification.status,
        newStatus: status,
      },
    })

    await prisma.employerProfile.update({
      where: {
        id: updatedVerification.employerId,
      },
      data: {
        verificationStatus: newStatus,
      },
    })

    res.json({
      status: "success",
      message: "Employer verification status updated successfully.",
      verification: formatVerificationRequest(updatedVerification),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to update employer verification status.",
    })
  }
})

export default router