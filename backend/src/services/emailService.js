import nodemailer from "nodemailer"

function isEmailEnabled() {
  return process.env.EMAIL_ENABLED === "true"
}

function hasSmtpConfig() {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  )
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function getFromAddress() {
  const fromName = process.env.SMTP_FROM_NAME || "TrueHire Global"
  const fromEmail =
    process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "no-reply@truehireglobal.com"

  return `"${fromName}" <${fromEmail}>`
}

export async function sendPasswordResetOtp({ to, name, otp }) {
  if (!isEmailEnabled() || !hasSmtpConfig()) {
    console.log("")
    console.log("====================================")
    console.log("Email sending is not enabled/configured.")
    console.log("Password reset OTP was not emailed.")
    console.log(`To: ${to}`)
    console.log(`OTP: ${otp}`)
    console.log("====================================")
    console.log("")

    return {
      sent: false,
      reason: "EMAIL_NOT_CONFIGURED",
    }
  }

  const transporter = createTransporter()

  const safeName = name || "TrueHire User"

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: "Your TrueHire Global Password Reset OTP",
    text: `
Hello ${safeName},

Your TrueHire Global password reset OTP is:

${otp}

This OTP expires in 10 minutes.

If you did not request this password reset, please ignore this email.

TrueHire Global
Verified Jobs. Trusted Employers. Real Careers.
    `.trim(),
    html: `
      <div style="font-family: Arial, sans-serif; background:#09090b; padding:32px;">
        <div style="max-width:620px; margin:auto; background:#18181b; border:1px solid #27272a; border-radius:24px; padding:32px; color:#ffffff;">
          <h1 style="margin:0; color:#2dd4bf;">TrueHire Global</h1>

          <p style="margin-top:16px; color:#d4d4d8;">Hello ${safeName},</p>

          <p style="color:#d4d4d8; line-height:1.7;">
            Your password reset OTP is:
          </p>

          <div style="margin:24px 0; background:#facc15; color:#09090b; font-size:32px; font-weight:800; letter-spacing:8px; text-align:center; padding:18px; border-radius:16px;">
            ${otp}
          </div>

          <p style="color:#d4d4d8; line-height:1.7;">
            This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>

          <p style="color:#a1a1aa; font-size:13px; line-height:1.7;">
            If you did not request this password reset, please ignore this email.
          </p>

          <hr style="border:none; border-top:1px solid #27272a; margin:24px 0;" />

          <p style="color:#a1a1aa; font-size:13px;">
            TrueHire Global — Verified Jobs. Trusted Employers. Real Careers.
          </p>
        </div>
      </div>
    `,
  })

  return {
    sent: true,
  }
}