"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactElement
  variant?: "default" | "destructive"
}

export const useToast = () => {
  const toast = React.useCallback((props: ToastProps) => {
    const { title, description, variant = "default" } = props
    
    if (variant === "destructive") {
      sonnerToast.error(title || description || "An error occurred")
    } else {
      sonnerToast.success(title || description || "Success")
    }
  }, [])

  return { toast }
}
