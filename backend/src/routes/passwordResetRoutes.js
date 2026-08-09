import express from "express"
import bcrypt from "bcryptjs"
import { randomInt } from "crypto"
import prisma from "../config/prisma.js"
import {
  cleanEmail,
  cleanPhone,
  cleanText,
  isValidPassword,
  rejectDangerousInput,
} from "../utils/validation.js"

const router = express.Router()

function normaliseIdentifier(identifier) {
  if (!identifier) return ""

  const cleanIdentifier = cleanText(identifier, 254)

  if (cleanIdentifier.includes("@")) {
    return cleanEmail(cleanIdentifier)
  }

  return cleanPhone(cleanIdentifier)
}

function generateOtp() {
  return String(randomInt(100000, 1000000))
}

function getExpiryDate() {
  return new Date(Date.now() + 10 * 60 * 1000)
}

function isProduction() {
  return process.env.NODE_ENV === "production"
}

async function findUserByIdentifier(identifier) {
  const cleanIdentifier = normaliseIdentifier(identifier)

  if (!cleanIdentifier) return null

  return prisma.user.findFirst({
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
  })
}

function getOtpChannel(user, identifier) {
  const cleanIdentifier = normaliseIdentifier(identifier)

  if (cleanIdentifier.includes("@")) {
    return {
      channel: "EMAIL",
      deliveryTarget: user.email,
    }
  }

  return {
    channel: "PHONE",
    deliveryTarget: user.phone || cleanIdentifier,
  }
}

router.post("/request", async (req, res) => {
  try {
    const identifier = normaliseIdentifier(req.body.identifier)

    const unsafeInputError = rejectDangerousInput({
      Identifier: identifier,
    })

    if (unsafeInputError) {
      return res.status(400).json({
        status: "error",
        message: unsafeInputError,
      })
    }

    if (!identifier) {
      return res.status(400).json({
        status: "error",
        message: "Please enter your email address or phone number.",
      })
    }

    const user = await findUserByIdentifier(identifier)

    if (!user) {
      return res.json({
        status: "success",
        message:
          "If an account exists, a password reset OTP has been prepared.",
      })
    }

    const { channel, deliveryTarget } = getOtpChannel(user, identifier)

    if (!deliveryTarget) {
      return res.status(400).json({
        status: "error",
        message: "No delivery target found for this account.",
      })
    }

    const otp = generateOtp()
    const codeHash = await bcrypt.hash(otp, 10)

    await prisma.passwordResetOtp.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    })

    await prisma.passwordResetOtp.create({
      data: {
        userId: user.id,
        deliveryTarget,
        channel,
        codeHash,
        expiresAt: getExpiryDate(),
      },
    })

    console.log("")
    console.log("====================================")
    console.log("TrueHire Password Reset OTP")
    console.log(`User: ${user.email}`)
    console.log(`Channel: ${channel}`)
    console.log(`Send to: ${deliveryTarget}`)
    console.log(`OTP: ${otp}`)
    console.log("Expires in: 10 minutes")
    console.log("====================================")
    console.log("")

    res.json({
      status: "success",
      message:
        channel === "EMAIL"
          ? "Password reset OTP has been sent to your email address."
          : "Password reset OTP has been sent to your phone number.",
      devOtp: isProduction() ? undefined : otp,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to prepare password reset OTP.",
    })
  }
})

router.post("/confirm", async (req, res) => {
  try {
    const identifier = normaliseIdentifier(req.body.identifier)
    const otp = cleanText(req.body.otp, 6)
    const newPassword = req.body.newPassword

    const unsafeInputError = rejectDangerousInput({
      Identifier: identifier,
      OTP: otp,
    })

    if (unsafeInputError) {
      return res.status(400).json({
        status: "error",
        message: unsafeInputError,
      })
    }

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Please provide identifier, OTP, and new password.",
      })
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        status: "error",
        message: "OTP must be a 6-digit number.",
      })
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long.",
      })
    }

    const user = await findUserByIdentifier(identifier)

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP.",
      })
    }

    const passwordResetOtp = await prisma.passwordResetOtp.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!passwordResetOtp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP.",
      })
    }

    const isOtpValid = await bcrypt.compare(String(otp), passwordResetOtp.codeHash)

    if (!isOtpValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP.",
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    await prisma.passwordResetOtp.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    })

    res.json({
      status: "success",
      message: "Password reset successfully. You can now sign in.",
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Failed to reset password.",
    })
  }
})

export default router