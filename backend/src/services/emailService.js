import nodemailer from "nodemailer"

function isEmailEnabled() {
  return process.env.EMAIL_ENABLED === "true"
}

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpSecure = process.env.SMTP_SECURE === "true"
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
}

function getFromAddress() {
  const fromName = process.env.SMTP_FROM_NAME || "TrueHire Global"
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER

  return `"${fromName}" <${fromEmail}>`
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

async function sendEmail({ to, subject, text, html }) {
  if (!isEmailEnabled()) {
    console.log("Email disabled. Intended email:", { to, subject })
    return { sent: false, reason: "EMAIL_DISABLED" }
  }

  const transporter = getTransporter()

  if (!transporter) {
    console.log("Email not configured. Intended email:", { to, subject })
    return { sent: false, reason: "EMAIL_NOT_CONFIGURED" }
  }

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    text,
    html,
  })

  return { sent: true }
}

function baseEmailTemplate({ title, preview, content }) {
  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#09090b;font-family:Arial,sans-serif;color:#ffffff;">
        <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
          <div style="border:1px solid rgba(255,255,255,0.12);background:#18181b;border-radius:24px;padding:28px;">
            <p style="margin:0 0 12px;color:#facc15;font-size:13px;font-weight:700;letter-spacing:0.04em;">
              TRUEHIRE GLOBAL
            </p>

            <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">
              ${escapeHtml(title)}
            </h1>

            ${
              preview
                ? `<p style="margin:16px 0 0;color:#d4d4d8;font-size:15px;line-height:1.7;">${escapeHtml(
                    preview
                  )}</p>`
                : ""
            }

            <div style="margin-top:24px;color:#d4d4d8;font-size:15px;line-height:1.7;">
              ${content}
            </div>

            <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.10);">
              <p style="margin:0;color:#a1a1aa;font-size:13px;line-height:1.6;">
                Verified Jobs. Trusted Employers. Real Careers.
              </p>
              <p style="margin:8px 0 0;color:#71717a;font-size:12px;line-height:1.6;">
                This is an automated message from TrueHire Global.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function sendPasswordResetOtp({ to, name, otp }) {
  const safeName = escapeHtml(name || "there")
  const safeOtp = escapeHtml(otp)

  return sendEmail({
    to,
    subject: "Your TrueHire Global password reset OTP",
    text: `Hello ${name || "there"}, your TrueHire Global password reset OTP is ${otp}. It expires in 10 minutes.`,
    html: baseEmailTemplate({
      title: "Password reset OTP",
      preview: "Use this OTP to reset your TrueHire Global password.",
      content: `
        <p>Hello ${safeName},</p>
        <p>Your password reset OTP is:</p>
        <div style="margin:20px 0;padding:18px;border-radius:18px;background:#27272a;text-align:center;">
          <span style="font-size:32px;font-weight:800;letter-spacing:6px;color:#facc15;">${safeOtp}</span>
        </div>
        <p>This OTP expires in 10 minutes. If you did not request it, you can ignore this email.</p>
      `,
    }),
  })
}

export async function sendPaymentStatusEmail({
  to,
  employerName,
  jobTitle,
  status,
  adminNote,
}) {
  const isConfirmed = status === "CONFIRMED"

  return sendEmail({
    to,
    subject: isConfirmed
      ? "Your TrueHire payment has been confirmed"
      : "Your TrueHire payment submission was rejected",
    text: isConfirmed
      ? `Hello ${employerName || "there"}, your payment for "${jobTitle}" has been confirmed. Your job advert has moved to admin review.`
      : `Hello ${employerName || "there"}, your payment submission for "${jobTitle}" was rejected. Admin note: ${adminNote || "No note provided."}`,
    html: baseEmailTemplate({
      title: isConfirmed ? "Payment confirmed" : "Payment rejected",
      preview: isConfirmed
        ? "Your job advert has moved to admin review."
        : "Please review the admin note and resubmit your payment reference.",
      content: `
        <p>Hello ${escapeHtml(employerName || "there")},</p>
        <p>
          Payment status for:
          <strong style="color:#ffffff;">${escapeHtml(jobTitle)}</strong>
        </p>
        <div style="margin:18px 0;padding:16px;border-radius:16px;background:${
          isConfirmed ? "#134e4a" : "#7f1d1d"
        };">
          <strong style="color:#ffffff;">${escapeHtml(status)}</strong>
        </div>
        ${
          adminNote
            ? `<p><strong style="color:#ffffff;">Admin note:</strong> ${escapeHtml(
                adminNote
              )}</p>`
            : ""
        }
        <p>
          ${
            isConfirmed
              ? "Your job advert has now moved to admin review."
              : "Please check your payment details and submit a new payment confirmation if required."
          }
        </p>
      `,
    }),
  })
}

export async function sendJobStatusEmail({
  to,
  employerName,
  jobTitle,
  status,
  adminNote,
}) {
  const isApproved = status === "APPROVED"

  return sendEmail({
    to,
    subject: isApproved
      ? "Your TrueHire job advert has been approved"
      : "Your TrueHire job advert status has changed",
    text: `Hello ${employerName || "there"}, your job advert "${jobTitle}" status is now ${status}. ${adminNote ? `Admin note: ${adminNote}` : ""}`,
    html: baseEmailTemplate({
      title: isApproved ? "Job advert approved" : "Job advert status updated",
      preview: `Your job advert status is now ${status}.`,
      content: `
        <p>Hello ${escapeHtml(employerName || "there")},</p>
        <p>
          Your job advert:
          <strong style="color:#ffffff;">${escapeHtml(jobTitle)}</strong>
        </p>
        <div style="margin:18px 0;padding:16px;border-radius:16px;background:${
          isApproved ? "#134e4a" : "#3f3f46"
        };">
          <strong style="color:#ffffff;">${escapeHtml(status)}</strong>
        </div>
        ${
          adminNote
            ? `<p><strong style="color:#ffffff;">Admin note:</strong> ${escapeHtml(
                adminNote
              )}</p>`
            : ""
        }
      `,
    }),
  })
}

export async function sendNewApplicationEmail({
  to,
  employerName,
  jobTitle,
  applicantName,
}) {
  return sendEmail({
    to,
    subject: "New application received on TrueHire Global",
    text: `Hello ${employerName || "there"}, ${applicantName} has applied for "${jobTitle}".`,
    html: baseEmailTemplate({
      title: "New job application",
      preview: "A job seeker has applied for one of your job adverts.",
      content: `
        <p>Hello ${escapeHtml(employerName || "there")},</p>
        <p>
          <strong style="color:#ffffff;">${escapeHtml(applicantName)}</strong>
          has applied for:
          <strong style="color:#ffffff;">${escapeHtml(jobTitle)}</strong>
        </p>
        <p>Please sign in to your employer dashboard to review the application.</p>
      `,
    }),
  })
}

export async function sendApplicationStatusEmail({
  to,
  applicantName,
  jobTitle,
  status,
}) {
  return sendEmail({
    to,
    subject: "Your TrueHire application status has changed",
    text: `Hello ${applicantName || "there"}, your application for "${jobTitle}" is now ${status}.`,
    html: baseEmailTemplate({
      title: "Application status updated",
      preview: `Your application status is now ${status}.`,
      content: `
        <p>Hello ${escapeHtml(applicantName || "there")},</p>
        <p>
          Your application for:
          <strong style="color:#ffffff;">${escapeHtml(jobTitle)}</strong>
        </p>
        <div style="margin:18px 0;padding:16px;border-radius:16px;background:#27272a;">
          <strong style="color:#facc15;">${escapeHtml(status)}</strong>
        </div>
        <p>Please sign in to your job seeker dashboard for more details.</p>
      `,
    }),
  })
}