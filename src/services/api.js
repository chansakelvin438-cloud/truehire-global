const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("authToken")

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export function loginUser(loginData) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  })
}
export function createJob(jobData) {
  return apiRequest("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  })
}

export function getMyEmployerJobs() {
  return apiRequest("/jobs/employer/my-jobs")
}

export function getAdminJobs() {
  return apiRequest("/jobs/admin/all-jobs")
}

export function updateAdminJobStatus(jobId, status) {
  return apiRequest(`/jobs/${jobId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function getPublicBackendJobs() {
  return apiRequest("/jobs/public")
}

export function getPublicBackendJob(id) {
  return apiRequest(`/jobs/public/${id}`)
}

export function submitJobApplication(jobId, applicationData) {
  return apiRequest(`/applications/jobs/${jobId}`, {
    method: "POST",
    body: JSON.stringify(applicationData),
  })
}

export function getMyApplications() {
  return apiRequest("/applications/my-applications")
}

export function getEmployerApplications() {
  return apiRequest("/applications/employer/applications")
}

export function updateEmployerApplicationStatus(applicationId, status) {
  return apiRequest(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function getMyNotifications() {
  return apiRequest("/notifications/my-notifications")
}

export function markNotificationAsRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  })
}

export function markAllNotificationsAsRead() {
  return apiRequest("/notifications/mark-all-read", {
    method: "PATCH",
  })
}

export function submitEmployerVerification(verificationData) {
  return apiRequest("/employer-verifications", {
    method: "POST",
    body: JSON.stringify(verificationData),
  })
}

export function getMyEmployerVerification() {
  return apiRequest("/employer-verifications/my-verification")
}

export function getAdminEmployerVerifications() {
  return apiRequest("/employer-verifications/admin/all")
}

export function updateEmployerVerificationStatus(verificationId, status) {
  return apiRequest(`/employer-verifications/${verificationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function submitSafetyReport(reportData) {
  return apiRequest("/safety-reports", {
    method: "POST",
    body: JSON.stringify(reportData),
  })
}

export function getAdminSafetyReports() {
  return apiRequest("/safety-reports/admin/all")
}

export function updateSafetyReportStatus(reportId, status) {
  return apiRequest(`/safety-reports/${reportId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export async function uploadCompanyLogo(file) {
  const token = localStorage.getItem("authToken")

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/uploads/company-logo`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload company logo")
  }

  return data
}

export async function uploadCv(file) {
  const token = localStorage.getItem("authToken")

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/uploads/cv`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload CV")
  }

  return data
}

export async function uploadBusinessRegistrationDocument(file) {
  const token = localStorage.getItem("authToken")

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/uploads/verification/business-registration`,
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload business registration document")
  }

  return data
}

export async function uploadTaxDocument(file) {
  const token = localStorage.getItem("authToken")

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/uploads/verification/tax-document`,
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload tax document")
  }

  return data
}

export async function uploadAuthorizationLetter(file) {
  const token = localStorage.getItem("authToken")

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/uploads/verification/authorization-letter`,
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload authorization letter")
  }

  return data
}

export async function openProtectedFile(fileUrl) {
  const token = localStorage.getItem("authToken")

  if (!token) {
    throw new Error("Please sign in to open this file.")
  }

  if (!fileUrl) {
    throw new Error("File link is missing.")
  }

  const apiServerUrl = API_BASE_URL.replace(/\/api\/?$/, "")

  let secureFileUrl = fileUrl

  // Convert older public CV links to the new protected route
  if (secureFileUrl.includes("/uploads/cvs/")) {
    secureFileUrl = secureFileUrl.replace("/uploads/cvs/", "/api/files/cvs/")
  }

  // Convert older public verification document links to the new protected routes
  if (
    secureFileUrl.includes(
      "/uploads/verification-documents/business-registration/"
    )
  ) {
    secureFileUrl = secureFileUrl.replace(
      "/uploads/verification-documents/business-registration/",
      "/api/files/verification/business-registration/"
    )
  }

  if (secureFileUrl.includes("/uploads/verification-documents/tax-documents/")) {
    secureFileUrl = secureFileUrl.replace(
      "/uploads/verification-documents/tax-documents/",
      "/api/files/verification/tax-documents/"
    )
  }

  if (
    secureFileUrl.includes(
      "/uploads/verification-documents/authorization-letters/"
    )
  ) {
    secureFileUrl = secureFileUrl.replace(
      "/uploads/verification-documents/authorization-letters/",
      "/api/files/verification/authorization-letters/"
    )
  }

  if (secureFileUrl.startsWith("/api/")) {
    secureFileUrl = `${apiServerUrl}${secureFileUrl}`
  }

  const newWindow = window.open("", "_blank")

  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Opening file...</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <p>Opening secure file...</p>
        </body>
      </html>
    `)
  }

  try {
    const response = await fetch(secureFileUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new Error(data?.message || "You are not allowed to open this file.")
    }

    const fileBlob = await response.blob()
    const fileObjectUrl = URL.createObjectURL(fileBlob)

    if (newWindow) {
      newWindow.location.href = fileObjectUrl
    } else {
      window.open(fileObjectUrl, "_blank")
    }

    setTimeout(() => {
      URL.revokeObjectURL(fileObjectUrl)
    }, 60 * 1000)
  } catch (error) {
    if (newWindow) {
      newWindow.close()
    }

    throw error
  }
}

export function requestPasswordReset(identifier) {
  return apiRequest("/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  })
}

export function confirmPasswordReset(resetData) {
  return apiRequest("/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(resetData),
  })
}

export function submitManualPayment(paymentData) {
  return apiRequest("/payments/manual-submit", {
    method: "POST",
    body: JSON.stringify(paymentData),
  })
}

export function getMyPayments() {
  return apiRequest("/payments/my-payments")
}

export function getAdminPayments() {
  return apiRequest("/payments/admin")
}

export function updateAdminPaymentStatus(paymentId, statusData) {
  return apiRequest(`/payments/admin/${paymentId}/status`, {
    method: "PATCH",
    body: JSON.stringify(statusData),
  })
}