
import { useState, useEffect, useCallback } from "react";
import { toast as sonnerToast, Toast as SonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<SonnerToast[]>([]);

  const toast = useCallback(
    ({ title, description, action, variant }: ToastProps) => {
      const toastId = sonnerToast(title, {
        description,
        action,
      });

      setToasts((toasts) => [...toasts, { id: toastId, title, description }]);
      return toastId;
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Re-export the sonner toast functions
export const toast = sonnerToast;
