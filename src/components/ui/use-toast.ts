
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };

// Helper functions for easier usage
export const toastHelpers = {
  success: (message: string) => {
    return toast({
      title: "Успешно",
      description: message,
    });
  },
  error: (message: string) => {
    return toast({
      title: "Ошибка",
      description: message,
      variant: "destructive"
    });
  }
};

