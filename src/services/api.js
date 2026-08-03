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