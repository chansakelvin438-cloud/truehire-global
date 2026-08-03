import { protect } from "../middleware/authMiddleware.js"
import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../config/prisma.js"


const router = express.Router()

function normaliseRole(role) {
  if (role === "jobseeker" || role === "JOB_SEEKER") return "JOB_SEEKER"
  if (role === "employer" || role === "EMPLOYER") return "EMPLOYER"
  if (role === "admin" || role === "ADMIN") return "ADMIN"

  return null
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  )
}

router.post("/register", async (req, res) => {
  try {
    const {
      role,
      name,
      firstName,
      lastName,
      companyName,
      email,
      phone,
      password,
    } = req.body

    const userRole = normaliseRole(role)

    if (!userRole) {
      return res.status(400).json({
        status: "error",
        message: "Invalid account type",
      })
    }

    if (userRole === "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Admin accounts cannot be created publicly",
      })
    }

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "An account with this email already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const displayName =
      userRole === "EMPLOYER"
        ? companyName || name || "Employer Account"
        : name || `${firstName || ""} ${lastName || ""}`.trim() || "Job Seeker"

    const user = await prisma.user.create({
      data: {
        role: userRole,
        name: displayName,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        employerProfile:
          userRole === "EMPLOYER"
            ? {
                create: {
                  companyName: companyName || displayName,
                  phone,
                },
              }
            : undefined,
        jobSeekerProfile:
          userRole === "JOB_SEEKER"
            ? {
                create: {
                  fullName: displayName,
                  phone,
                },
              }
            : undefined,
      },
      include: {
        employerProfile: true,
        jobSeekerProfile: true,
      },
    })

    const token = createToken(user)

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        employerProfile: user.employerProfile,
        jobSeekerProfile: user.jobSeekerProfile,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Registration failed",
    })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        employerProfile: true,
        jobSeekerProfile: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      })
    }

    const requestedRole = normaliseRole(role)

    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({
        status: "error",
        message: "This account does not match the selected account type",
      })
    }

    const token = createToken(user)

    res.json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        employerProfile: user.employerProfile,
        jobSeekerProfile: user.jobSeekerProfile,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Login failed",
    })
  }
})

router.get("/me", protect, async (req, res) => {
  res.json({
    status: "success",
    user: {
      id: req.user.id,
      role: req.user.role,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      employerProfile: req.user.employerProfile,
      jobSeekerProfile: req.user.jobSeekerProfile,
    },
  })
})

export default router