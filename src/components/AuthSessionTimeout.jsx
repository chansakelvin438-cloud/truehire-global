import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SESSION_TIMEOUT_MS = 30 * 60 * 1000

const activityEvents = [
  "click",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
]

function clearAuthSession() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")
  localStorage.removeItem("userRole")
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("lastActivityAt")
  sessionStorage.setItem("sessionExpired", "true")
}

export default function AuthSessionTimeout() {
  const navigate = useNavigate()

  useEffect(() => {
    function isLoggedIn() {
      return Boolean(localStorage.getItem("authToken"))
    }

    function updateActivityTime() {
      if (isLoggedIn()) {
        localStorage.setItem("lastActivityAt", String(Date.now()))
      }
    }

    updateActivityTime()

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, updateActivityTime, { passive: true })
    })

    const intervalId = window.setInterval(() => {
      if (!isLoggedIn()) return

      const lastActivityAt = Number(
        localStorage.getItem("lastActivityAt") || Date.now()
      )

      const inactiveFor = Date.now() - lastActivityAt

      if (inactiveFor >= SESSION_TIMEOUT_MS) {
        clearAuthSession()
        navigate("/signin?session=expired", { replace: true })
      }
    }, 30 * 1000)

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, updateActivityTime)
      })

      window.clearInterval(intervalId)
    }
  }, [navigate])

  return null
}