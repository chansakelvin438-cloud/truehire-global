import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import employerVerificationRoutes from "./routes/employerVerificationRoutes.js"
import safetyReportRoutes from "./routes/safetyReportRoutes.js"
import path from "path"
import uploadRoutes from "./routes/uploadRoutes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)

app.use(express.json())
app.use(morgan("dev"))
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

app.get("/", (req, res) => {
  res.json({
    message: "TrueHire Global backend is running",
    status: "success",
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend health check passed",
    app: "TrueHire Global API",
    time: new Date().toISOString(),
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/applicationRoutes", applicationRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/employer-verifications", employerVerificationRoutes)
app.use("/api/safety-reports", safetyReportRoutes)
app.use("/api/uploads", uploadRoutes)

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  })
})

app.use((error, req, res, next) => {
  console.error(error)

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  })
})

app.listen(PORT, () => {
  console.log(`TrueHire Global backend running on http://localhost:${PORT}`)
})