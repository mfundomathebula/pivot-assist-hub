import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Check, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/lumen-logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { navItems } from "./nav-items";
import { notifications } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const unread = notifications.filter((n) => !n.read).length;

  const matches = query.trim()
    ? navItems.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <SidebarTrigger className="shrink-0" />

        <Link to="/" className="flex shrink-0 items-center gap-2 md:hidden">
          <img src={logo} alt="Lumen AI" width={28} height={28} className="size-7 rounded-md" />
        </Link>

        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search Lumen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches[0]) {
                setQuery("");
                navigate({ to: matches[0].to });
              }
              if (e.key === "Escape") setQuery("");
            }}
            placeholder="Search tools, emails, plans…"
            className="h-10 rounded-xl bg-surface pl-9 pr-3"
          />
          {matches.length > 0 && (
            <div className="panel absolute left-0 right-0 top-12 z-40 animate-fade-in overflow-hidden p-1">
              {matches.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    navigate({ to: item.to });
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="rounded-xl"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl"
                aria-label={`Notifications, ${unread} unread`}
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary">{unread} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
                  <span className="flex w-full items-center gap-2 text-sm font-medium">
                    {n.read ? (
                      <Check className="size-3.5 text-muted-foreground" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                    <span className="truncate">{n.title}</span>
                  </span>
                  <span className="pl-5 text-xs text-muted-foreground">{n.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-accent"
                aria-label="Account menu"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    MM
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left lg:block">
                  <span className="block text-xs font-semibold leading-tight">Mfundo Mathebula</span>
                  <span className="block text-xs leading-tight text-muted-foreground">Pro plan</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Mfundo Mathebula</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/saved">Saved work</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/history">History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
