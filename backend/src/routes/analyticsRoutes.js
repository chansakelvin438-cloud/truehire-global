import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/admin", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalAdmins,

      totalJobs,
      pendingPaymentJobs,
      pendingReviewJobs,
      approvedJobs,
      flaggedJobs,
      rejectedJobs,

      totalApplications,
      submittedApplications,
      reviewedApplications,
      shortlistedApplications,
      interviewApplications,
      rejectedApplications,

      totalPayments,
      submittedPayments,
      confirmedPayments,
      rejectedPayments,
      confirmedPaymentAmount,

      totalVerifications,
      pendingVerifications,
      submittedVerifications,
      verifiedEmployers,
      flaggedVerifications,
      rejectedVerifications,

      totalSafetyReports,
      submittedSafetyReports,
      investigatingSafetyReports,
      resolvedSafetyReports,

      totalAuditLogs,
    ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { role: "JOB_SEEKER" } }),
      prisma.user.count({ where: { role: "EMPLOYER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),

      prisma.job.count(),
      prisma.job.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.job.count({ where: { status: "APPROVED" } }),
      prisma.job.count({ where: { status: "FLAGGED" } }),
      prisma.job.count({ where: { status: "REJECTED" } }),

      prisma.application.count(),
      prisma.application.count({ where: { status: "SUBMITTED" } }),
      prisma.application.count({ where: { status: "REVIEWED" } }),
      prisma.application.count({ where: { status: "SHORTLISTED" } }),
      prisma.application.count({ where: { status: "INTERVIEW_SCHEDULED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),

      prisma.paymentSubmission.count(),
      prisma.paymentSubmission.count({ where: { status: "SUBMITTED" } }),
      prisma.paymentSubmission.count({ where: { status: "CONFIRMED" } }),
      prisma.paymentSubmission.count({ where: { status: "REJECTED" } }),
      prisma.paymentSubmission.aggregate({
        where: { status: "CONFIRMED" },
        _sum: { amount: true },
      }),

      prisma.employerVerification.count(),
      prisma.employerVerification.count({
        where: { status: "VERIFICATION_PENDING" },
      }),
      prisma.employerVerification.count({
        where: { status: "SUBMITTED_FOR_REVIEW" },
      }),
      prisma.employerVerification.count({ where: { status: "VERIFIED" } }),
      prisma.employerVerification.count({ where: { status: "FLAGGED" } }),
      prisma.employerVerification.count({ where: { status: "REJECTED" } }),

      prisma.safetyReport.count(),
      prisma.safetyReport.count({ where: { status: "SUBMITTED" } }),
      prisma.safetyReport.count({ where: { status: "INVESTIGATING" } }),
      prisma.safetyReport.count({ where: { status: "RESOLVED" } }),

      prisma.auditLog.count(),
    ])

    res.json({
      status: "success",
      analytics: {
        users: {
          total: totalUsers,
          jobSeekers: totalJobSeekers,
          employers: totalEmployers,
          admins: totalAdmins,
        },

        jobs: {
          total: totalJobs,
          pendingPayment: pendingPaymentJobs,
          pendingReview: pendingReviewJobs,
          approved: approvedJobs,
          flagged: flaggedJobs,
          rejected: rejectedJobs,
        },

        applications: {
          total: totalApplications,
          submitted: submittedApplications,
          reviewed: reviewedApplications,
          shortlisted: shortlistedApplications,
          interviewScheduled: interviewApplications,
          rejected: rejectedApplications,
        },

        payments: {
          total: totalPayments,
          submitted: submittedPayments,
          confirmed: confirmedPayments,
          rejected: rejectedPayments,
          confirmedAmount: confirmedPaymentAmount._sum.amount || 0,
          currency: "ZMW",
        },

        verifications: {
          total: totalVerifications,
          pending: pendingVerifications,
          submitted: submittedVerifications,
          verified: verifiedEmployers,
          flagged: flaggedVerifications,
          rejected: rejectedVerifications,
        },

        safetyReports: {
          total: totalSafetyReports,
          submitted: submittedSafetyReports,
          investigating: investigatingSafetyReports,
          resolved: resolvedSafetyReports,
        },

        auditLogs: {
          total: totalAuditLogs,
        },
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: "error",
      message: "Could not load admin analytics.",
    })
  }
})

export default router