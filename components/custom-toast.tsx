"use client"

import { useToast } from "@/components/ui/use-toast"

type ToastType = "success" | "error" | "warning" | "info"

interface CustomToastProps {
  type: ToastType
  title: string
  description?: string
  duration?: number
}

const toastConfig = {
  success: {
    icon: "✅",
    className: "border-green-500 bg-green-50",
  },
  error: {
    icon: "❌",
    className: "border-red-500 bg-red-50",
  },
  warning: {
    icon: "⚠️",
    className: "border-yellow-500 bg-yellow-50",
  },
  info: {
    icon: "ℹ️",
    className: "border-blue-500 bg-blue-50",
  },
}

export function useCustomToast() {
  const { toast } = useToast()

  const showToast = ({ 
    type, 
    title, 
    description, 
    duration = 4000 
  }: CustomToastProps) => {
   
    const config = toastConfig[type]
    
    try {
      toast({
        title: `${config.icon} ${title}`,
        description,
        duration,
        className: config.className,
      })
      
    } catch (error) {
      console.error("❌ Toast error:", error)
    }
  }

  return {
    success: (title: string, description?: string, duration?: number) => {
     
      return showToast({ type: "success", title, description, duration })
    },
    error: (title: string, description?: string, duration?: number) => {
     
      return showToast({ type: "error", title, description, duration })
    },
    warning: (title: string, description?: string, duration?: number) => {
     
      return showToast({ type: "warning", title, description, duration })
    },
    info: (title: string, description?: string, duration?: number) => {
     
      return showToast({ type: "info", title, description, duration })
    },
  }
}