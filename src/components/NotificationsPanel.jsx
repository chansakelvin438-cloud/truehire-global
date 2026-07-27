import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BellRing, CheckCircle2, Trash2 } from "lucide-react"

function NotificationsPanel() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem("jobSeekerNotifications") || "[]"
    )

    const userNotifications = savedNotifications.filter(
      (notification) => notification.email === currentUser.email
    )

    setNotifications(userNotifications)
  }, [currentUser.email])

  function markAsRead(notificationId) {
    const allNotifications = JSON.parse(
      localStorage.getItem("jobSeekerNotifications") || "[]"
    )

    const updatedNotifications = allNotifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    )

    localStorage.setItem(
      "jobSeekerNotifications",
      JSON.stringify(updatedNotifications)
    )

    setNotifications(
      updatedNotifications.filter(
        (notification) => notification.email === currentUser.email
      )
    )
  }

  function clearNotifications() {
    const allNotifications = JSON.parse(
      localStorage.getItem("jobSeekerNotifications") || "[]"
    )

    const remainingNotifications = allNotifications.filter(
      (notification) => notification.email !== currentUser.email
    )

    localStorage.setItem(
      "jobSeekerNotifications",
      JSON.stringify(remainingNotifications)
    )

    setNotifications([])
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold">
            <BellRing className="text-yellow-300" size={30} />
            Notifications
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Employer updates about your applications appear here.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {unreadCount > 0 && (
            <span className="rounded-full bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              {unreadCount} unread
            </span>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearNotifications}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/40 px-5 py-2 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
            >
              <Trash2 size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl border p-6 ${
                notification.isRead
                  ? "border-white/10 bg-zinc-950"
                  : "border-teal-400/20 bg-teal-400/10"
              }`}
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
                    {notification.status}
                  </span>

                  <h3 className="mt-4 text-2xl font-extrabold">
                    {notification.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-zinc-500">
                    {notification.createdAt}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to={`/jobs/${notification.jobId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                  >
                    View Job
                    <ArrowRight size={17} />
                  </Link>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                    >
                      <CheckCircle2 size={17} />
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <BellRing size={28} />
          </div>

          <h3 className="mt-5 text-2xl font-extrabold">
            No notifications yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Employer updates about your applications will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default NotificationsPanel