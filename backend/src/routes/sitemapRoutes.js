import express from "express"
import prisma from "../config/prisma.js"

const router = express.Router()

const SITE_URL = "https://truehireglobal.com"

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/jobs", priority: "0.9", changefreq: "daily" },
  { path: "/employers", priority: "0.8", changefreq: "weekly" },
  { path: "/pricing", priority: "0.7", changefreq: "weekly" },
  { path: "/safety", priority: "0.7", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.4", changefreq: "monthly" },
  { path: "/terms", priority: "0.4", changefreq: "monthly" },
  { path: "/payment-policy", priority: "0.4", changefreq: "monthly" },
  { path: "/job-posting-policy", priority: "0.4", changefreq: "monthly" },
  { path: "/employer-verification-policy", priority: "0.4", changefreq: "monthly" },
  { path: "/applicant-safety-policy", priority: "0.4", changefreq: "monthly" },
]

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function toSitemapDate(value) {
  const date = value ? new Date(value) : new Date()

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString()
  }

  return date.toISOString()
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${toSitemapDate(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const approvedJobs = await prisma.job.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5000,
    })

    const staticEntries = staticPages.map((page) =>
      buildUrlEntry({
        loc: `${SITE_URL}${page.path}`,
        lastmod: new Date(),
        changefreq: page.changefreq,
        priority: page.priority,
      })
    )

    const jobEntries = approvedJobs.map((job) =>
      buildUrlEntry({
        loc: `${SITE_URL}/jobs/${job.id}`,
        lastmod: job.updatedAt || job.createdAt,
        changefreq: "daily",
        priority: "0.8",
      })
    )

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...jobEntries].join("")}
</urlset>`

    res.setHeader("Content-Type", "application/xml")
    res.setHeader("Cache-Control", "public, max-age=600")
    res.status(200).send(sitemap)
  } catch (error) {
    console.error("Sitemap generation failed:", error)

    res.status(500).type("text/plain").send("Could not generate sitemap.")
  }
})

export default router