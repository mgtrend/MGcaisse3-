import { toast } from "sonner"
import { Check, AlertCircle, Info, AlertTriangle } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Système de notification unifié utilisant Sonner
 * Remplace les alert() par des notifications visuelles élégantes
 */
export const notify = (message: string, type: ToastType = "info", options?: ToastOptions) => {
  const { description, duration = 5000, action } = options || {}

  const icons = {
    success: <Check className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  }

  const toastOptions = {
    duration,
    icon: icons[type],
    description,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  }

  switch (type) {
    case "success":
      toast.success(message, toastOptions)
      break
    case "error":
      toast.error(message, toastOptions)
      break
    case "warning":
      toast.warning(message, toastOptions)
      break
    case "info":
    default:
      toast.info(message, toastOptions)
      break
  }
}
