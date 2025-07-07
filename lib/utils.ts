import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  BarChart,
  Box,
  Brain,
  Clipboard,
  Cloud,
  Code,
  Cpu,
  CreditCard,
  Currency,
  Database,
  DollarSign,
  FileText,
  Globe,
  Headphones,
  Lock,
  Monitor,
  Palette,
  Scale,
  Shield,
  Smartphone,
  Terminal,
  Users,
  type LucideIcon,
} from "lucide-react";

// Merge Tailwind and conditional classNames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert strings like "web-development" to "WebDevelopment"
export const formattedString = (input: string) => {
  return input
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
};

// List of supported icon names (must match DB category names exactly)
export type IconName =
  | "Software Development"
  | "Web Development"
  | "Mobile App Development"
  | "Data Science"
  | "Machine Learning"
  | "Artificial Intelligence"
  | "UI/UX Design"
  | "Product Management"
  | "Project Management"
  | "Quality Assurance"
  | "DevOps"
  | "Cybersecurity"
  | "Cloud Computing"
  | "Database Administration"
  | "Network Engineering"
  | "Business Analysis"
  | "Sales"
  | "Marketing"
  | "Customer Support"
  | "Human Resources"
  | "Finance"
  | "Accounting"
  | "Legal";

// Maps each category to its Lucide icon
export const iconMapping: Record<IconName, LucideIcon> = {
  "Software Development": Code,
  "Web Development": Monitor,
  "Mobile App Development": Smartphone,
  "Data Science": BarChart,
  "Machine Learning": Cpu,
  "Artificial Intelligence": Brain,
  "UI/UX Design": Palette,
  "Product Management": Box,
  "Project Management": Clipboard,
  "Quality Assurance": Shield,
  DevOps: Terminal,
  Cybersecurity: Lock,
  "Cloud Computing": Cloud,
  "Database Administration": Database,
  "Network Engineering": Globe,
  "Business Analysis": FileText,
  Sales: DollarSign,
  Marketing: CreditCard,
  "Customer Support": Headphones,
  "Human Resources": Users,
  Finance: Currency,
  Accounting: CreditCard,
  Legal: Scale,
};
