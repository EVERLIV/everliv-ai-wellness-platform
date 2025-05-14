
import { toast as sonnerToast, ToastT } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

// Export the toast function directly from sonner
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
