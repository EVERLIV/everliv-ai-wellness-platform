
import { toast as sonnerToast, type ToastT } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
