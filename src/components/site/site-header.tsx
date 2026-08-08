import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Book", href: "/book" },
];

export function SiteHeader({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const onDark = variant === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl",
        onDark
          ? "border-white/10 bg-foreground/80 text-background"
          : "border-border bg-background/85",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-1.5">
          <span className="font-display text-xl tracking-tight sm:text-2xl">Pearlii</span>
          <span className="font-display text-xl italic text-primary sm:text-2xl">Beauty</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] uppercase tracking-[0.16em] transition-colors",
                onDark
                  ? "text-background/70 hover:text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/book"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pink sm:inline-flex"
          >
            Book Your Glam
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid size-10 place-items-center rounded-full border transition-colors md:hidden",
              onDark ? "border-white/20" : "border-border",
            )}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={cn(
            "border-t md:hidden",
            onDark ? "border-white/10 bg-foreground" : "border-border bg-background",
          )}
        >
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3.5 text-sm uppercase tracking-[0.16em] last:border-0"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-3 mb-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-[13px] font-medium uppercase tracking-[0.14em] text-primary-foreground"
            >
              Book Your Glam
            </Link>
            <a href={site.phoneHref} className="pb-3 text-center text-xs text-muted-foreground">
              {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
