import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  )
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export const storageBuckets = {
  companyLogos:
    process.env.SUPABASE_COMPANY_LOGOS_BUCKET || "truehire-company-logos",
  cvs: process.env.SUPABASE_CVS_BUCKET || "truehire-cvs",
  verificationDocs:
    process.env.SUPABASE_VERIFICATION_DOCS_BUCKET ||
    "truehire-verification-docs",
}

export default supabase