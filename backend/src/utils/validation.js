const dangerousPatterns = [
  /<script\b/i,
  /<\/script>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /\bunion\s+select\b/i,
  /\bdrop\s+table\b/i,
  /\btruncate\s+table\b/i,
  /\balter\s+table\b/i,
]

export function cleanText(value, maxLength = 1000) {
  if (value === undefined || value === null) return ""

  return String(value)
    .replace(/\u0000/g, "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength)
}

export function cleanEmail(value) {
  return cleanText(value, 254).toLowerCase()
}

export function cleanPhone(value) {
  return cleanText(value, 30).replace(/[^\d+\s()-]/g, "")
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8
}

export function hasDangerousContent(value) {
  if (value === undefined || value === null) return false

  const text = String(value)

  return dangerousPatterns.some((pattern) => pattern.test(text))
}

export function rejectDangerousInput(fields) {
  for (const [label, value] of Object.entries(fields)) {
    if (hasDangerousContent(value)) {
      return `${label} contains unsafe content.`
    }
  }

  return ""
}