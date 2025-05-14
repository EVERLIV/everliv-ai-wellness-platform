
import { toast as sonnerToast } from "sonner";

// Re-export the toast functions in the expected format
export const toast = sonnerToast;

// Export the useToast hook with the expected interface
export const useToast = () => {
  return {
    toast: sonnerToast,
    // This is needed for compatibility with the Toaster component
    toasts: [] 
  };
};
