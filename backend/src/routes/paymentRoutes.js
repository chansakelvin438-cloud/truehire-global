import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"
import { sendPaymentStatusEmail } from "../services/emailService.js"

const router = express.Router()

const allowedPaymentMethods = [
  "MTN_MOBILE_MONEY",
  "AIRTEL_MONEY",
  "ZAMTEL_KWACHA",
  "BANK_TRANSFER",
]

const allowedAdminStatuses = ["CONFIRMED", "REJECTED"]

function cleanText(value) {
  return String(value || "").trim()
}

function isValidTransactionReference(value) {
  const cleaned = cleanText(value)
  return cleaned.length >= 4 && cleaned.length <= 80
}

router.post(
  "/manual-submit",
  protect,
  allowRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const {
        jobId,
        paymentMethod,
        transactionReference,
        payerPhone,
        note,
      } = req.body

      if (!jobId) {
        return res.status(400).json({
          status: "error",
          message: "Job ID is required.",
        })
      }

      if (!allowedPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid payment method.",
        })
      }

      if (!isValidTransactionReference(transactionReference)) {
        return res.status(400).json({
          status: "error",
          message: "Please enter a valid transaction reference.",
        })
      }

      const employerProfile = await prisma.employerProfile.findUnique({
        where: { userId: req.user.id },
      })

      if (!employerProfile) {
        return res.status(404).json({
          status: "error",
          message: "Employer profile not found.",
        })
      }

      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          employerId: employerProfile.id,
        },
      })

      if (!job) {
        return res.status(404).json({
          status: "error",
          message: "Job not found or you are not allowed to submit payment for it.",
        })
      }

      if (job.paymentStatus === "PAID") {
        return res.status(400).json({
          status: "error",
          message: "This job has already been paid for.",
        })
      }

      const existingPendingSubmission = await prisma.paymentSubmission.findFirst({
        where: {
          jobId: job.id,
          employerId: employerProfile.id,
          status: "SUBMITTED",
        },
      })

      if (existingPendingSubmission) {
        return res.status(400).json({
          status: "error",
          message:
            "A payment confirmation has already been submitted for this job and is awaiting admin review.",
        })
      }

      const payment = await prisma.paymentSubmission.create({
        data: {
          jobId: job.id,
          employerId: employerProfile.id,
          amount: job.amountDue || 50,
          currency: job.currency || "ZMW",
          paymentMethod,
          transactionReference: cleanText(transactionReference),
          payerPhone: cleanText(payerPhone),
          note: cleanText(note),
          status: "SUBMITTED",
        },
        include: {
          job: true,
        },
      })

      await prisma.job.update({
        where: { id: job.id },
        data: {
          paymentStatus: "PAYMENT_SUBMITTED",
        },
      })

      res.status(201).json({
        status: "success",
        message: "Payment confirmation submitted successfully.",
        payment,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Could not submit payment confirmation.",
      })
    }
  }
)

router.get(
  "/my-payments",
  protect,
  allowRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: { userId: req.user.id },
      })

      if (!employerProfile) {
        return res.status(404).json({
          status: "error",
          message: "Employer profile not found.",
        })
      }

      const payments = await prisma.paymentSubmission.findMany({
        where: {
          employerId: employerProfile.id,
        },
        include: {
          job: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.json({
        status: "success",
        payments,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Could not load payment submissions.",
      })
    }
  }
)

router.get(
  "/admin",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const payments = await prisma.paymentSubmission.findMany({
        include: {
          job: true,
          employer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.json({
        status: "success",
        payments,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Could not load admin payment submissions.",
      })
    }
  }
)

router.patch(
  "/admin/:id/status",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params
      const { status, adminNote } = req.body

      if (!allowedAdminStatuses.includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid payment status.",
        })
      }

      const payment = await prisma.paymentSubmission.findUnique({
        where: { id },
        include: {
          job: true,
          employer: {
            include: {
              user: true,
            },
          },
        },
      })

      if (!payment) {
        return res.status(404).json({
          status: "error",
          message: "Payment submission not found.",
        })
      }

      const updatedPayment = await prisma.paymentSubmission.update({
        where: { id },
        data: {
          status,
          adminNote: cleanText(adminNote),
        },
        include: {
          job: true,
          employer: {
            include: {
              user: true,
            },
          },
        },
      })

      if (status === "CONFIRMED") {
        await prisma.job.update({
          where: { id: payment.jobId },
          data: {
            paymentStatus: "PAID",
            status: "PENDING_REVIEW",
          },
        })
      }

      if (status === "REJECTED") {
        await prisma.job.update({
          where: { id: payment.jobId },
          data: {
            paymentStatus: "PAYMENT_REJECTED",
            status: "PENDING_PAYMENT",
          },
        })
      }

      try {
        if (payment.employer?.user?.email) {
          await sendPaymentStatusEmail({
            to: payment.employer.user.email,
            employerName:
              payment.employer.companyName || payment.employer.user.name,
            jobTitle: payment.job?.title || "your job advert",
            status,
            adminNote: cleanText(adminNote),
          })
        }
      } catch (emailError) {
        console.error("Payment status email failed:", emailError)
      }

      res.json({
        status: "success",
        message:
          status === "CONFIRMED"
            ? "Payment confirmed. Job moved to admin review."
            : "Payment rejected. Employer must resubmit payment confirmation.",
        payment: updatedPayment,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Could not update payment status.",
      })
    }
  }
)

export default router