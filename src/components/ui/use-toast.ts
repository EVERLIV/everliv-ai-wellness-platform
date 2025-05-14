
import { useToast } from "@/hooks/use-toast";

export { useToast };

// Создаем объект toast для вызова toast уведомлений без хука
export const toast = {
  success: (message: string) => {
    // Это обертка будет перехвачена и обработана Sonner toast
    // или нашим пользовательским компонентом toast
    return {
      title: "Успешно",
      description: message,
    };
  },
  error: (message: string) => {
    return {
      title: "Ошибка",
      description: message,
      variant: "destructive"
    };
  }
};
