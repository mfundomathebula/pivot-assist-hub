import { Link, useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import logo from "@/assets/lumen-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "./nav-items";

const workspaceItems = navItems.slice(0, 4);
const libraryItems = navItems.slice(4);

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 rounded-xl px-1 py-1">
          <img src={logo} alt="" className="size-8 shrink-0 rounded-lg" />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Lumen AI</span>
              <span className="block truncate text-xs text-muted-foreground">
                Productivity assistant
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                    <Link to={item.to}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Library</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                    <Link to={item.to}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="surface-soft flex items-start gap-2 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="min-w-0">Always review AI output before you send or act on it.</p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
