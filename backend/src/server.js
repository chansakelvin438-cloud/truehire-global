import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import path from "path"

import authRoutes from "./routes/authRoutes.js"
import passwordResetRoutes from "./routes/passwordResetRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import employerVerificationRoutes from "./routes/employerVerificationRoutes.js"
import safetyReportRoutes from "./routes/safetyReportRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import auditLogRoutes from "./routes/auditLogRoutes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"
const isProduction = process.env.NODE_ENV === "production"

app.set("trust proxy", 1)

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://truehireglobal.com",
  "https://www.truehireglobal.com",
  "http://localhost:5173",
].filter(Boolean)

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(
  express.json({
    limit: "1mb",
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
)

if (!isProduction) {
  app.use(morgan("dev"))
}

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
})

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many password reset attempts. Please try again later.",
  },
})

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many form submissions. Please try again later.",
  },
})

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many upload attempts. Please try again later.",
  },
})

app.use(generalLimiter)

app.use("/api/auth/login", authLimiter)
app.use("/api/auth/register", authLimiter)
app.use("/api/password-reset", passwordResetLimiter)
app.use("/api/safety-reports", publicFormLimiter)
app.use("/api/uploads", uploadLimiter)

app.use(
  "/uploads/company-logos",
  express.static(path.join(process.cwd(), "uploads", "company-logos"), {
    maxAge: isProduction ? "7d" : 0,
  })
)

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "TrueHire Global API is running securely.",
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "TrueHire Global API health check passed.",
    environment: process.env.NODE_ENV || "development",
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/password-reset", passwordResetRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/audit-logs", auditLogRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/employer-verifications", employerVerificationRoutes)
app.use("/api/safety-reports", safetyReportRoutes)
app.use("/api/uploads", uploadRoutes)
app.use("/api/files", fileRoutes)

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found.",
  })
})

app.use((error, req, res, next) => {
  console.error(error)

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "Request blocked by security policy.",
    })
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error.",
  })
})

app.listen(PORT, () => {
  console.log(`TrueHire Global API running on port ${PORT}`)
})