import bcrypt from "bcryptjs"
import prisma from "./config/prisma.js"

async function seedAdmin() {
  const adminEmail = "admin@truehireglobal.com"
  const adminPassword = "Admin12345"

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log("Admin account already exists.")
    console.log(`Email: ${adminEmail}`)
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.create({
    data: {
      role: "ADMIN",
      name: "TrueHire Global Admin",
      email: adminEmail,
      phone: "+260000000000",
      password: hashedPassword,
    },
  })

  console.log("Admin account created successfully.")
  console.log(`Email: ${adminEmail}`)
  console.log(`Password: ${adminPassword}`)
  console.log(`Admin ID: ${admin.id}`)
}

seedAdmin()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })