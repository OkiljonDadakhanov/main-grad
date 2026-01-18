"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, CheckCheck, FileText, MessageSquare, Info, Inbox, X } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { authFetch, BASE_URL } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

interface NotificationTranslation {
  id: number
  lang: string
  title: string
  message: string
}

interface Notification {
  id: number
  type: "system" | "application" | "message" | string
  is_read: boolean
  created_at: string
  translations: NotificationTranslation[]
}

export default function NotificationBell() {
  const { locale, t } = useI18n()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [viewAllOpen, setViewAllOpen] = useState(false)
  const initialLoadDone = useRef(false)
  const prevUnreadCount = useRef(0)

  const fetchNotifications = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/api/notifications/`)
      if (res.ok) {
        const data = await res.json()
        const notifs = data.results || data || []

        const newUnreadCount = notifs.filter((n: Notification) => !n.is_read).length

        // Check if there are new notifications (only after initial load)
        if (initialLoadDone.current && newUnreadCount > prevUnreadCount.current) {
          // Broadcast event to refresh application data
          window.dispatchEvent(new CustomEvent("application-status-changed"))
        }

        prevUnreadCount.current = newUnreadCount
        initialLoadDone.current = true
        setNotifications(notifs)
        setUnreadCount(newUnreadCount)
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
    // Poll every 10 seconds for faster notification updates
    const interval = setInterval(fetchNotifications, 10000)

    // Also fetch immediately when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const getNotificationContent = (notification: Notification) => {
    const translation = notification.translations.find((t) => t.lang === locale)
      || notification.translations.find((t) => t.lang === "en")
      || notification.translations[0]

    if (translation) {
      return { title: translation.title, message: translation.message }
    }
    return { title: t("notifications.notification"), message: "" }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t("notifications.justNow")
    if (minutes < 60) return `${minutes}${t("notifications.minutesAgo")}`
    if (hours < 24) return `${hours}${t("notifications.hoursAgo")}`
    if (days < 7) return `${days}${t("notifications.daysAgo")}`
    return date.toLocaleDateString()
  }

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText size={16} className="text-blue-500" />
      case "message":
        return <MessageSquare size={16} className="text-green-500" />
      case "system":
      default:
        return <Info size={16} className="text-purple-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-100"
      case "message":
        return "bg-green-100"
      case "system":
      default:
        return "bg-purple-100"
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    setSelectedNotification(notification)
    setDetailOpen(true)
    setOpen(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen)
        // Fetch fresh notifications when opening the popover
        if (isOpen) {
          fetchNotifications()
        }
      }}>
        <PopoverTrigger asChild>
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 dark:bg-gray-900 dark:border-gray-800" align="end">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("notifications.title")}</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 rounded-full">
                  {unreadCount} {t("notifications.new")}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                <CheckCheck size={14} />
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="h-[350px] dark:bg-gray-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <div className="w-8 h-8 border-2 border-purple-200 dark:border-purple-500/30 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-3" />
                <p className="text-sm">{t("common.loading")}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Inbox size={28} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("notifications.noNotifications")}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("notifications.checkBackLater")}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => {
                  const { title, message } = getNotificationContent(notification)
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200",
                        !notification.is_read && "bg-purple-50/50 dark:bg-purple-500/5 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                          getTypeColor(notification.type)
                        )}>
                          {getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm text-gray-900 dark:text-gray-100 line-clamp-1",
                              !notification.is_read && "font-semibold"
                            )}>
                              {title}
                            </p>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          {message && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {message}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
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

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t dark:border-gray-800 px-4 py-2 bg-gray-50/50 dark:bg-gray-900">
              <button
                onClick={() => {
                  setOpen(false)
                  setViewAllOpen(true)
                }}
                className="w-full text-center text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-1 transition-colors"
              >
                {t("notifications.viewAll")}
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Notification Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedNotification && (
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  getTypeColor(selectedNotification.type)
                )}>
                  {getTypeIcon(selectedNotification.type)}
                </div>
              )}
              <div>
                <DialogTitle className="text-left dark:text-gray-100">
                  {selectedNotification && getNotificationContent(selectedNotification).title}
                </DialogTitle>
                {selectedNotification && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFullDate(selectedNotification.created_at)}
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedNotification && getNotificationContent(selectedNotification).message}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* View All Notifications Modal */}
      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-purple-600 dark:text-purple-400" />
                <DialogTitle className="dark:text-gray-100">{t("notifications.allNotifications")}</DialogTitle>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 rounded-full">
                    {unreadCount} {t("notifications.unread")}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  <CheckCheck size={14} />
                  {t("notifications.markAllRead")}
                </button>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="h-[60vh] mt-4 -mx-6 px-6">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Inbox size={28} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("notifications.noNotifications")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const { title, message } = getNotificationContent(notification)
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 border",
                        !notification.is_read
                          ? "bg-purple-50/50 dark:bg-purple-500/5 border-purple-200 dark:border-purple-500/20"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      )}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id)
                        }
                        setSelectedNotification(notification)
                        setViewAllOpen(false)
                        setDetailOpen(true)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          getTypeColor(notification.type)
                        )}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm text-gray-900 dark:text-gray-100",
                              !notification.is_read && "font-semibold"
                            )}>
                              {title}
                            </p>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          {message && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {message}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {formatFullDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
