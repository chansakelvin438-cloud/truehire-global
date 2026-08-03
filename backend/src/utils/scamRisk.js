export function analyseJobRisk(job) {
  const title = job.title || ""
  const description = job.description || ""
  const requirements = job.requirements || ""
  const company = job.company || ""
  const email = job.email || ""

  const text = `${title} ${description} ${requirements} ${company} ${email}`.toLowerCase()

  const riskRules = [
    { keyword: "registration fee", reason: "Mentions registration fee", points: 35 },
    { keyword: "application fee", reason: "Mentions application fee", points: 35 },
    { keyword: "interview fee", reason: "Mentions interview fee", points: 35 },
    { keyword: "medical fee", reason: "Mentions medical fee", points: 35 },
    { keyword: "processing fee", reason: "Mentions processing fee", points: 30 },
    { keyword: "pay before", reason: "Mentions payment before process", points: 35 },
    { keyword: "send money", reason: "Requests money transfer", points: 40 },
    { keyword: "urgent payment", reason: "Mentions urgent payment", points: 40 },
    { keyword: "whatsapp only", reason: "Uses WhatsApp-only communication", points: 20 },
    { keyword: "no experience needed", reason: "Uses vague no-experience wording", points: 10 },
    { keyword: "guaranteed job", reason: "Promises guaranteed employment", points: 25 },
  ]

  let score = 0
  const reasons = []

  riskRules.forEach((rule) => {
    if (text.includes(rule.keyword)) {
      score += rule.points
      reasons.push(rule.reason)
    }
  })

  const personalEmailDomains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]

  if (personalEmailDomains.some((domain) => email.toLowerCase().includes(domain))) {
    score += 10
    reasons.push("Uses a personal email address instead of a company domain")
  }

  const hasCriticalFeeWarning =
    text.includes("registration fee") ||
    text.includes("application fee") ||
    text.includes("interview fee") ||
    text.includes("medical fee") ||
    text.includes("processing fee") ||
    text.includes("send money") ||
    text.includes("urgent payment") ||
    text.includes("pay before")

  if (hasCriticalFeeWarning) {
    score = Math.max(score, 50)
    reasons.push("Contains payment-related wording that may indicate a scam")
  }

  let level = "Low Risk"

  if (score >= 50) {
    level = "High Risk"
  } else if (score >= 20) {
    level = "Medium Risk"
  }

  return {
    score,
    level,
    reasons: reasons.length > 0 ? Array.from(new Set(reasons)) : ["No major scam indicators detected"],
  }
}