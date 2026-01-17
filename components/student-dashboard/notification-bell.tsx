"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { authFetch, BASE_URL } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface NotificationTranslation {
  id: number
  lang: string
  title: string
  message: string
}

interface Notification {
  id: number
  type: string
  is_read: boolean
  created_at: string
  translations: NotificationTranslation[]
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/api/notifications/`)
      if (res.ok) {
        const data = await res.json()
        const notifs = data.results || data || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await authFetch(`${BASE_URL}/api/notifications/${id}/read/`, {
        method: "POST",
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await authFetch(`${BASE_URL}/api/notifications/read-all/`, {
        method: "POST",
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const getNotificationContent = (notification: Notification) => {
    const translation = notification.translations[0]
    if (translation) {
      return { title: translation.title, message: translation.message }
    }
    return { title: "Notification", message: "" }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-purple-600 hover:text-purple-700"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const { title, message } = getNotificationContent(notification)
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.is_read && "bg-purple-50"
                    )}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-1 h-2 w-2 rounded-full shrink-0",
                          notification.is_read ? "bg-gray-300" : "bg-purple-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
