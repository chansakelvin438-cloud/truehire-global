import { useEffect } from "react"

const SITE_NAME = "TrueHire Global"
const SITE_URL = "https://truehireglobal.com"
const DEFAULT_DESCRIPTION =
  "TrueHire Global connects job seekers with verified employers through safer, reviewed, and trusted job opportunities."

function setMeta(name, content, attribute = "name") {
  if (!content) return

  let tag = document.querySelector(`meta[${attribute}="${name}"]`)

  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }

  tag.setAttribute("content", content)
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')

  if (!link) {
    link = document.createElement("link")
    link.setAttribute("rel", "canonical")
    document.head.appendChild(link)
  }

  link.setAttribute("href", url)
}

function setJsonLd(id, data) {
  if (!data) return

  const existing = document.getElementById(id)

  if (existing) {
    existing.remove()
  }

  const script = document.createElement("script")
  script.id = id
  script.type = "application/ld+json"
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = `${SITE_URL}/favicon.svg`,
  noIndex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const canonicalUrl = `${SITE_URL}${path}`

    document.title = fullTitle

    setMeta("description", description)
    setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow")

    setMeta("og:title", fullTitle, "property")
    setMeta("og:description", description, "property")
    setMeta("og:type", "website", "property")
    setMeta("og:url", canonicalUrl, "property")
    setMeta("og:image", image, "property")

    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", fullTitle)
    setMeta("twitter:description", description)
    setMeta("twitter:image", image)

    setCanonical(canonicalUrl)

    setJsonLd("truehire-jsonld", jsonLd)

    return () => {
      const existing = document.getElementById("truehire-jsonld")
      if (existing) existing.remove()
    }
  }, [title, description, path, image, noIndex, jsonLd])

  return null
}