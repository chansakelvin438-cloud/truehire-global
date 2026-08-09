import { useState } from "react"
import { Download } from "lucide-react"
import { openProtectedFile } from "../services/api"

function ProtectedFileButton({ fileUrl, label = "Open File", className = "" }) {
  const [opening, setOpening] = useState(false)

  async function handleOpenFile() {
    try {
      setOpening(true)
      await openProtectedFile(fileUrl)
    } catch (error) {
      alert(error.message || "Failed to open file")
    } finally {
      setOpening(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleOpenFile}
      disabled={opening}
      className={
        className ||
        "mt-3 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
      }
    >
      <Download size={16} />
      {opening ? "Opening..." : label}
    </button>
  )
}

export default ProtectedFileButton