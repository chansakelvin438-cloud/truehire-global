import express from "express"
import prisma from "../config/prisma.js"
import { protect, allowRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

function formatNotification(notification) {
  return {
    id: notification.id,
    userId: notification.userId,
    jobId: notification.jobId,
    title: notification.title,
    message: notification.message,
    status: notification.status,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    receivedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(notification.createdAt),
  }
}

router.get(
  "/my-notifications",
  protect,
  allowRoles("JOB_SEEKER"),
  async (req, res) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: req.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.json({
        status: "success",
        unreadCount: notifications.filter((notification) => !notification.isRead)
          .length,
        notifications: notifications.map(formatNotification),
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to fetch notifications.",
      })
    }
  }
)

router.patch(
  "/:notificationId/read",
  protect,
  allowRoles("JOB_SEEKER"),
  async (req, res) => {
    try {
      const { notificationId } = req.params

      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: req.user.id,
        },
      })

      if (!notification) {
        return res.status(404).json({
          status: "error",
          message: "Notification not found.",
        })
      }

      const updatedNotification = await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          isRead: true,
        },
      })

      res.json({
        status: "success",
        message: "Notification marked as read.",
        notification: formatNotification(updatedNotification),
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to update notification.",
      })
    }
  }
)

router.patch(
  "/mark-all-read",
  protect,
  allowRoles("JOB_SEEKER"),
  async (req, res) => {
    try {
      await prisma.notification.updateMany({
        where: {
          userId: req.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      const notifications = await prisma.notification.findMany({
        where: {
          userId: req.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.json({
        status: "success",
        message: "All notifications marked as read.",
        unreadCount: 0,
        notifications: notifications.map(formatNotification),
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        status: "error",
        message: "Failed to mark all notifications as read.",
      })
    }
  }
)

export default router