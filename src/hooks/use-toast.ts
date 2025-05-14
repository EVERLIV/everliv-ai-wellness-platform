
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

import {
  useToast as useToastOriginal,
} from "@/components/ui/toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = useToastOriginal;

export type ToastActionProps = React.ComponentPropsWithoutRef<typeof Toast>;
