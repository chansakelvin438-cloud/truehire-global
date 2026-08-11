import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import prisma from "./config/prisma.js"

dotenv.config()

const isProduction = process.env.NODE_ENV === "production"

const adminEmail = process.env.ADMIN_EMAIL || "no-reply@truehireglobal.com"
const adminName = process.env.ADMIN_NAME || "TrueHire Admin"

const adminPassword =
  process.env.ADMIN_PASSWORD || (isProduction ? "" : "Admin12345")

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  if (existingAdmin) {
    console.log(`Admin already exists: ${existingAdmin.email}`)
    return
  }

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be set and must be at least 8 characters long."
    )
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.create({
    data: {
      role: "ADMIN",
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    },
  })

  console.log(`Admin user created: ${admin.email}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })