import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  MailCheck,
} from "lucide-react"
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/api"

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    try {
      setLoading(true)
      setError("")

      const response = await getMyNotifications()

      setNotifications(response.notifications || [])
      setUnreadCount(response.unreadCount || 0)
    } catch (error) {
      setError(error.message || "Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      setUpdatingId(notificationId)

      const response = await markNotificationAsRead(notificationId)

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? response.notification
            : notification
        )
      )

      setUnreadCount((currentCount) => Math.max(currentCount - 1, 0))
    } catch (error) {
      alert(error.message || "Failed to mark notification as read")
    } finally {
      setUpdatingId("")
    }
  }

  async function handleMarkAllRead() {
    try {
      setMarkingAll(true)

      const response = await markAllNotificationsAsRead()

      setNotifications(response.notifications || [])
      setUnreadCount(response.unreadCount || 0)
    } catch (error) {
      alert(error.message || "Failed to mark all notifications as read")
    } finally {
      setMarkingAll(false)
    }
  }

  function getStatusClass(status) {
    if (status === "Shortlisted") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Interview Scheduled") {
      return "bg-teal-400/10 text-teal-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    if (status === "Reviewed") {
      return "bg-blue-400/10 text-blue-300"
    }

    return "bg-yellow-400/10 text-yellow-300"
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold">
            <Bell size={28} className="text-yellow-300" />
            Notifications
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            See updates from employers about your job applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
            {unreadCount} Unread
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 px-4 py-2 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
            >
              <MailCheck size={16} />
              {markingAll ? "Updating..." : "Mark All Read"}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-bold text-teal-300">
            Loading notifications...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
          <AlertTriangle size={36} className="mx-auto text-red-300" />

          <h3 className="mt-4 text-xl font-extrabold text-red-300">
            Could not load notifications
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-300">{error}</p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl border p-6 ${
                notification.isRead
                  ? "border-white/10 bg-zinc-950"
                  : "border-yellow-400/30 bg-yellow-400/10"
              }`}
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        notification.status
                      )}`}
                    >
                      {notification.status || "Update"}
                    </span>

                    {!notification.isRead && (
                      <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-extrabold text-zinc-950">
                        New
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 flex items-center gap-2 text-xl font-extrabold">
                    <FileText size={20} className="text-teal-300" />
                    {notification.title || "Application update"}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {notification.message}
                  </p>

                  <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-zinc-500">
                    <Clock size={14} />
                    {notification.receivedAt || "Recently"}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3">
                  {notification.jobId && (
                    <Link
                      to={`/jobs/${notification.jobId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                    >
                      <Eye size={16} />
                      View Job
                    </Link>
                  )}

                  {!notification.isRead && (
                    <button
                      type="button"
                      disabled={updatingId === notification.id}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      <CheckCircle2 size={16} />
                      {updatingId === notification.id
                        ? "Updating..."
                        : "Mark Read"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <Bell size={32} />
          </div>

          <h3 className="mt-6 text-2xl font-extrabold">
            No notifications yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            When an employer reviews, shortlists, schedules, or rejects your application,
            the update will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default NotificationsPanel