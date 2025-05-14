
import { toast as sonnerToast, type ToastT } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export const toast = {
  ...sonnerToast,
  error: (message: string) => sonnerToast.error(message),
  success: (message: string) => sonnerToast.success(message)
};

export const useToast = () => {
  return {
    toast
  };
};
