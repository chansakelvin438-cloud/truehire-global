import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../config/prisma.js"
import { protect } from "../middleware/authMiddleware.js"
import {
  cleanEmail,
  cleanPhone,
  cleanText,
  isValidEmail,
  isValidPassword,
  rejectDangerousInput,
} from "../utils/validation.js"

const router = express.Router()

function normaliseRole(role) {
  const cleanRole = String(role || "")
    .toLowerCase()
    .replace(/[_\-\s]/g, "")

  if (cleanRole === "jobseeker") return "JOB_SEEKER"
  if (cleanRole === "employer") return "EMPLOYER"
  if (cleanRole === "admin") return "ADMIN"

  return null
}

function formatRole(role) {
  if (role === "JOB_SEEKER") return "jobseeker"
  if (role === "EMPLOYER") return "employer"
  if (role === "ADMIN") return "admin"

  return "jobseeker"
}

function formatVerificationStatus(status) {
  if (status === "VERIFICATION_PENDING") return "Verification Pending"
  if (status === "SUBMITTED_FOR_REVIEW") return "Submitted for Review"
  if (status === "VERIFIED") return "Verified"
  if (status === "FLAGGED") return "Flagged"
  if (status === "REJECTED") return "Rejected"

  return "Verification Pending"
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  )
}

function formatUser(user) {
  return {
    id: user.id,
    role: formatRole(user.role),
    roleCode: user.role,
    name: user.name,
    displayName: user.name,
    email: user.email,
    phone: user.phone,
    companyName: user.employerProfile?.companyName || "",
    verificationStatus: user.employerProfile
      ? formatVerificationStatus(user.employerProfile.verificationStatus)
      : "",
    jobSeekerProfile: user.jobSeekerProfile || null,
    employerProfile: user.employerProfile
      ? {
          ...user.employerProfile,
          verificationStatus: formatVerificationStatus(
            user.employerProfile.verificationStatus
          ),
        }
      : null,
  }
}

router.post("/register", async (req, res) => {
  try {
    const role = normaliseRole(req.body.role || req.body.accountType)

    if (!role) {
      return res.status(400).json({
        status: "error",
        message: "Please select a valid account type.",
      })
    }

    if (role === "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Admin registration is not allowed publicly.",
      })
    }

    const name = cleanText(
      req.body.name || req.body.fullName || req.body.companyName,
      120
    )
    const email = cleanEmail(req.body.email)
    const phone = cleanPhone(req.body.phone)
    const companyName = cleanText(req.body.companyName || name, 160)
    const password = req.body.password

    const unsafeInputError = rejectDangerousInput({
      Name: name,
      Email: email,
      Phone: phone,
      "Company name": companyName,
    })

    if (unsafeInputError) {
      return res.status(400).json({
        status: "error",
        message: unsafeInputError,
      })
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and password are required.",
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid email address.",
      })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long.",
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "An account with this email already exists.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        role,
        name,
        email,
        phone: phone || null,
        password: hashedPassword,

        ...(role === "JOB_SEEKER"
          ? {
              jobSeekerProfile: {
                create: {
                  fullName: name,
                  phone: phone || null,
                },
              },
            }
          : {}),

        ...(role === "EMPLOYER"
          ? {
              employerProfile: {
                create: {
                  companyName: companyName || name,
                  phone: phone || null,
                },
              },
            }
          : {}),
      },
      include: {
        jobSeekerProfile: true,
        employerProfile: true,
      },
    })

    const token = generateToken(user)

    res.status(201).json({
      status: "success",
      message: "Account created successfully.",
      token,
      user: formatUser(user),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to create account.",
    })
  }
})

router.post("/login", async (req, res) => {
  try {
    const identifier = cleanText(req.body.email || req.body.identifier, 254)
    const password = req.body.password
    const requestedRole = normaliseRole(
      req.body.role || req.body.accountType || req.body.requiredRole
    )

    const unsafeInputError = rejectDangerousInput({
      Identifier: identifier,
    })

    if (unsafeInputError) {
      return res.status(400).json({
        status: "error",
        message: unsafeInputError,
      })
    }

    if (!identifier || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email/phone and password are required.",
      })
    }

    const cleanIdentifier = identifier.includes("@")
      ? cleanEmail(identifier)
      : cleanPhone(identifier)

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: cleanIdentifier,
          },
          {
            phone: cleanIdentifier,
          },
        ],
      },
      include: {
        jobSeekerProfile: true,
        employerProfile: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email/phone or password.",
      })
    }

    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({
        status: "error",
        message: "This account type does not match the selected sign-in option.",
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email/phone or password.",
      })
    }

    const token = generateToken(user)

    res.json({
      status: "success",
      message: "Signed in successfully.",
      token,
      user: formatUser(user),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to sign in.",
    })
  }
})

router.get("/me", protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        jobSeekerProfile: true,
        employerProfile: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      })
    }

    res.json({
      status: "success",
      user: formatUser(user),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to fetch user.",
    })
  }
})

export default router