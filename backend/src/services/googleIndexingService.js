import { GoogleAuth } from "google-auth-library"

const INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish"

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing"

const SITE_URL =
  process.env.GOOGLE_INDEXING_SITE_URL || "https://truehireglobal.com"

function isGoogleIndexingEnabled() {
  return process.env.GOOGLE_INDEXING_ENABLED === "true"
}

function getGoogleIndexingCredentials() {
  const base64Value = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON_BASE64

  if (!base64Value) {
    return null
  }

  const jsonText = Buffer.from(base64Value, "base64").toString("utf8")
  const credentials = JSON.parse(jsonText)

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Invalid Google Indexing service account credentials.")
  }

  return credentials
}

export function buildPublicJobUrl(jobId) {
  return `${SITE_URL}/jobs/${jobId}`
}

export async function notifyGoogleIndexing(url, type = "URL_UPDATED") {
  if (!isGoogleIndexingEnabled()) {
    return {
      skipped: true,
      reason: "Google Indexing API is disabled.",
    }
  }

  if (!["URL_UPDATED", "URL_DELETED"].includes(type)) {
    throw new Error("Invalid Google Indexing notification type.")
  }

  const credentials = getGoogleIndexingCredentials()

  if (!credentials) {
    return {
      skipped: true,
      reason: "Google Indexing credentials are missing.",
    }
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: [INDEXING_SCOPE],
  })

  const client = await auth.getClient()

  const response = await client.request({
    url: INDEXING_ENDPOINT,
    method: "POST",
    data: {
      url,
      type,
    },
  })

  return {
    skipped: false,
    url,
    type,
    data: response.data,
  }
}

export async function notifyGoogleJobUpdated(jobId) {
  const url = buildPublicJobUrl(jobId)
  return notifyGoogleIndexing(url, "URL_UPDATED")
}

export async function notifyGoogleJobDeleted(jobId) {
  const url = buildPublicJobUrl(jobId)
  return notifyGoogleIndexing(url, "URL_DELETED")
}