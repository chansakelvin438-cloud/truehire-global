import path from "path"
import { randomUUID } from "crypto"
import supabase, { storageBuckets } from "../config/supabase.js"

export function generateStorageFileName(originalName) {
  const ext = path.extname(originalName || "").toLowerCase()
  return `${Date.now()}-${randomUUID()}${ext}`
}

export async function uploadToSupabaseStorage({
  bucket,
  filePath,
  buffer,
  contentType,
}) {
  const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
    contentType,
    upsert: false,
    cacheControl: "3600",
  })

  if (error) {
    throw new Error(error.message || "File upload failed")
  }

  return filePath
}

export function getPublicFileUrl({ bucket, filePath }) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export async function downloadFromSupabaseStorage({ bucket, filePath }) {
  const { data, error } = await supabase.storage.from(bucket).download(filePath)

  if (error) {
    throw new Error(error.message || "File not found")
  }

  const arrayBuffer = await data.arrayBuffer()
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: data.type || "application/octet-stream",
  }
}

export { storageBuckets }