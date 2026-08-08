import { Link } from "@tanstack/react-router";

import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">
            Pearlii<span className="italic text-primary">Beauty</span>
          </p>
          <p className="mt-2 text-sm text-background/60">{site.tagline}</p>
          <p className="mt-5 max-w-xs font-display text-lg italic leading-snug text-background/80">
            “Your vision matters. Your beauty is personal. Your confidence is the goal.”
          </p>
        </div>

        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-background/50">Quick links</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-background/75">
            <li>
              <a href="/" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="/#services" className="hover:text-primary">
                Services
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-primary">
                About
              </a>
            </li>
            <li>
              <Link to="/book" className="hover:text-primary">
                Book
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-background/50">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-background/75">
            <li>
              <a href={site.phoneHref} className="hover:text-primary">
                {site.phone}
              </a>
            </li>
            <li>{site.location}</li>
            <li>Monday – Sunday</li>
            <li>09:00 – 16:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-background/45 sm:px-8">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
