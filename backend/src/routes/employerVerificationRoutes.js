import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

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
  const statusMap = {
    "Verification Pending": "VERIFICATION_PENDING",
    "Submitted for Review": "SUBMITTED_FOR_REVIEW",
    Verified: "VERIFIED",
    Flagged: "FLAGGED",
    Rejected: "REJECTED",
  }

  return statusMap[status] || null
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
    taxDocumentFileName: request.taxDocumentFileName,
    authorizationLetterFileName: request.authorizationLetterFileName,
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

    const {
      companyName,
      email,
      phone,
      companyRegistrationNumber,
      tpin,
      businessType,
      address,
      contactPerson,
      website,
      businessRegistrationFileName,
      taxDocumentFileName,
      authorizationLetterFileName,
    } = req.body

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
        taxDocumentFileName: taxDocumentFileName || "",
        authorizationLetterFileName: authorizationLetterFileName || "",
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

router.get("/my-verification", protect, allowRoles("EMPLOYER"), async (req, res) => {
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
})

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
    const { status } = req.body

    const newStatus = normaliseVerificationStatus(status)

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