import {
  Bookmark,
  History,
  LayoutDashboard,
  ListChecks,
  Mail,
  MessageSquare,
  Settings,
} from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon: typeof LayoutDashboard;
  hint?: string;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard, hint: "Overview" },
  { title: "AI Email Generator", to: "/email", icon: Mail, hint: "Draft & refine" },
  { title: "AI Task Planner", to: "/planner", icon: ListChecks, hint: "Plan your work" },
  { title: "AI Assistant", to: "/assistant", icon: MessageSquare, hint: "Chat" },
  { title: "History", to: "/history", icon: History },
  { title: "Saved Work", to: "/saved", icon: Bookmark },
  { title: "Settings", to: "/settings", icon: Settings },
];
