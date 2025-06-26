
import { LucideIcon } from "lucide-react";

export interface StepConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  component: React.ReactNode;
}
