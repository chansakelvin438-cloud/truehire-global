export const featuredJobs = [
  {
    id: 1,
    title: "Sales Support Officer",
    company: "Verified Company Zambia",
    location: "Lusaka, Zambia",
    type: "Full-time",
    category: "Sales & Customer Service",
    salary: "Negotiable",
    deadline: "30 July 2026",
    experience: "1–2 years",
    description:
      "Support customer service, sales reporting, product activation, and daily branch operations for a growing company.",
    responsibilities: [
      "Assist customers with product and service enquiries.",
      "Support sales reporting and daily branch operations.",
      "Help with product activation and customer follow-ups.",
      "Maintain professional communication with clients.",
    ],
    requirements: [
      "Diploma or degree in business, economics, sales, or related field.",
      "Good communication and customer service skills.",
      "Basic computer skills and ability to prepare reports.",
      "Sales or telecom experience is an added advantage.",
    ],
    source: "sample",
    trustBadge: "Verified Employer",
  },
  {
    id: 2,
    title: "Procurement Assistant",
    company: "Verified Supplies Limited",
    location: "Kitwe, Zambia",
    type: "Hybrid",
    category: "Procurement & Logistics",
    salary: "K4,000 – K6,000",
    deadline: "5 August 2026",
    experience: "Entry level",
    description:
      "Assist with supplier quotations, purchase orders, inventory records, and procurement documentation.",
    responsibilities: [
      "Request and compare supplier quotations.",
      "Prepare purchase order documentation.",
      "Maintain procurement and inventory records.",
      "Support supplier follow-ups and delivery tracking.",
    ],
    requirements: [
      "Diploma or degree in procurement, business, economics, or related field.",
      "Good record keeping and communication skills.",
      "Knowledge of supplier management is an added advantage.",
      "Ability to work with deadlines and documentation.",
    ],
    source: "sample",
    trustBadge: "Verified Employer",
  },
  {
    id: 3,
    title: "Junior Data Analyst",
    company: "Remote Analytics Africa",
    location: "Remote / Africa",
    type: "Remote",
    category: "Data & Technology",
    salary: "$300 – $600 monthly",
    deadline: "12 August 2026",
    experience: "Entry level",
    description:
      "Analyse business data, prepare reports, clean datasets, and support management decision-making.",
    responsibilities: [
      "Clean and organise business datasets.",
      "Prepare dashboards and basic reports.",
      "Support data analysis for business decisions.",
      "Work with Excel, Power BI, R, Python, or similar tools.",
    ],
    requirements: [
      "Degree or certificate in economics, statistics, data science, or related field.",
      "Strong Excel skills.",
      "Basic knowledge of data analysis tools.",
      "Good attention to detail and problem-solving ability.",
    ],
    source: "sample",
    trustBadge: "Verified Employer",
  },
]

function normaliseEmployerJob(job) {
  const employerVerificationStatus =
    localStorage.getItem("employerVerificationStatus") || "Verification Pending"

  const requirements =
    typeof job.requirements === "string"
      ? job.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      : ["Requirements will be confirmed by the employer."]

  return {
    id: job.id,
    title: job.title || "Untitled Job",
    company: job.company || "Verified Employer",
    location: job.location || "Not specified",
    type: job.type || "Full-time",
    category: job.category || "General",
    salary: job.salary || "Negotiable",
    deadline: job.deadline || "Not specified",
    experience: job.experience || "Not specified",
    description: job.description || "No job description provided.",
    responsibilities: [
      "Responsibilities will be confirmed by the employer.",
      "Applicants should review the full job description carefully before applying.",
    ],
    requirements:
      requirements.length > 0
        ? requirements
        : ["Requirements will be confirmed by the employer."],
    source: "employer-submitted",
    status: job.status,
    verificationStatus: employerVerificationStatus,
    trustBadge:
      employerVerificationStatus === "Verified"
        ? "Highly Verified Employer"
        : "Verified Employer",
  }
}

export function getApprovedEmployerJobs() {
  try {
    const employerJobs = JSON.parse(localStorage.getItem("employerJobs") || "[]")

    return employerJobs
      .filter((job) => job.status === "Approved")
      .map(normaliseEmployerJob)
  } catch {
    return []
  }
}

export function getPublicJobs() {
  return [...featuredJobs, ...getApprovedEmployerJobs()]
}