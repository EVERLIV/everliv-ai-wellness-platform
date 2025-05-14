
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

// Export the toast function directly from sonner
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
