import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Sparkles } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { services } from "@/lib/booking-schema";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Makeup Artist in Vosloorus | PearliiBeauty — Soft & Full Glam" },
      {
        name: "description",
        content:
          "Professional makeup artist in Vosloorus, Gauteng. Soft glam from R400 and full glam from R500 — makeup designed around your vision. Book online, open daily 09:00–16:00.",
      },
      {
        name: "keywords",
        content:
          "makeup artist Vosloorus, makeup artist in Vosloorus, makeup services Vosloorus, soft glam Vosloorus, full glam Vosloorus, makeup artist Gauteng, makeup artist near me",
      },
      { property: "og:title", content: "PearliiBeauty — Makeup Artist in Vosloorus, Gauteng" },
      {
        property: "og:description",
        content:
          "Your vision. Your glam. Your confidence. Soft and full glam makeup in Vosloorus — book your appointment online.",
      },
      { name: "twitter:title", content: "PearliiBeauty — Makeup Artist in Vosloorus" },
      {
        name: "twitter:description",
        content: "Soft glam R400 · Full glam R500 · Vosloorus, Gauteng · Open daily 09:00–16:00.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: "PearliiBeauty",
          description:
            "Professional makeup artist in Vosloorus, Gauteng offering soft glam and full glam makeup services.",
          telephone: "+27652305824",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Vosloorus",
            addressRegion: "Gauteng",
            addressCountry: "ZA",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "09:00",
              closes: "16:00",
            },
          ],
          priceRange: "R400 – R500",
          makesOffer: services.map((s) => ({
            "@type": "Offer",
            name: s.name,
            price: s.price,
            priceCurrency: "ZAR",
            description: s.description,
          })),
        }),
      },
    ],
  }),
  component: Home,
});

const principles = [
  { n: "01", title: "Listen", body: "I take the time to understand exactly what you want." },
  { n: "02", title: "Create", body: "Your ideas become the starting point for your look." },
  {
    n: "03",
    title: "Personalise",
    body: "No two clients are the same, so your makeup shouldn't be either.",
  },
  {
    n: "04",
    title: "Confidence",
    body: "You should leave my chair feeling beautiful, confident and completely yourself.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-foreground text-background">
          <div className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 -left-32 size-[22rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="eyebrow">Professional Makeup Artist · Vosloorus</p>
              <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
                Your Vision.
                <br />
                Your <span className="italic text-primary">Glam</span>.
                <br />
                Your Confidence.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-background/70 sm:text-lg">
                Makeup designed around you — from soft, effortless glam to bold, colourful and
                creative looks.
              </p>

              <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-background/70">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <dd>{site.location}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <dd>Monday – Sunday | 09:00 – 16:00</dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-pink"
                >
                  Book Your Glam
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-background transition-colors hover:bg-white/10"
                >
                  Explore Services
                </a>
              </div>
            </div>

            {/* Replace this frame with your own photograph when you're ready. */}
            <div className="photo-frame aspect-[4/5] w-full max-w-md justify-self-center lg:justify-self-end">
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <Sparkles className="mx-auto size-6 text-primary" />
                  <p className="mt-4 font-display text-3xl text-foreground">
                    Pearlii<span className="italic text-primary">Beauty</span>
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Soft glam · Full glam
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10">
            <p className="mx-auto max-w-4xl px-5 py-8 text-center font-display text-xl italic leading-snug text-background/85 sm:px-8 sm:text-2xl">
              “You should leave my chair feeling like the most confident version of yourself.”
            </p>
          </div>
        </section>

        {/* BRAND / INTRO */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">The philosophy</p>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                Makeup That
                <br />
                Starts With <span className="italic text-primary">You.</span>
              </h2>
              <div className="mt-8 photo-frame aspect-[5/4] w-full">
                <div className="absolute inset-0 grid place-items-center">
                  <p className="font-display text-2xl italic text-foreground/70">
                    Your vision, first.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Your face is not a canvas for someone else's idea of beauty. Your makeup should
                reflect you, your personality and the look you've imagined.
              </p>
              <p>
                I want every client to feel heard, understood and comfortable enough to express
                exactly what they want. Whether you're looking for soft, elegant beauty or something
                bold, colourful and creative, my goal is to bring your vision to life.
              </p>
              <p className="text-foreground">
                Because when you leave my chair, I want you to feel like a more confident and
                beautiful version of yourself.
              </p>
              <div className="border-l-2 border-primary pl-5">
                <p className="font-display text-2xl italic leading-snug text-foreground">
                  “My goal is for every client to feel heard and to have their vision executed
                  exactly the way they want it.”
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="scroll-mt-24 bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="text-center">
              <p className="eyebrow">Services</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">Choose Your Glam</h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                Whatever your vision, let's bring it to life.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={i * 120}>
                  <article className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-9">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-3xl">{service.name}</h3>
                      <span className="rounded-full bg-primary-soft px-4 py-1.5 font-display text-xl text-primary-soft-foreground">
                        R{service.price}
                      </span>
                    </div>
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <p className="mt-5 rounded-2xl bg-surface p-4 text-sm text-foreground">
                      {service.perfectFor}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-border px-3.5 py-1.5 text-[12px] uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/book"
                      search={{ service: service.id }}
                      className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] text-background transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Book {service.name}
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* YOUR VISION MATTERS */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="eyebrow">The approach</p>
            <h2 className="mt-4 max-w-md font-display text-4xl leading-tight sm:text-5xl">
              Your Vision <span className="italic text-primary">Matters.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div className="h-full bg-card p-7 transition-colors hover:bg-primary-soft/40">
                  <p className="font-display text-4xl text-primary/60">{p.n}</p>
                  <h3 className="mt-4 text-sm uppercase tracking-[0.2em]">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="scroll-mt-24 bg-foreground py-20 text-background sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="photo-frame aspect-[4/5] w-full max-w-sm">
                <div className="absolute inset-0 grid place-items-center">
                  <p className="font-display text-2xl italic text-foreground/70">The artist</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow">About</p>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                Behind the <span className="italic text-primary">Glam</span>
              </h2>
              <div className="mt-7 space-y-5 leading-relaxed text-background/70">
                <p>
                  Makeup has always been my way of creating — a way of turning how someone feels
                  about themselves into something they can see in the mirror. What I love most isn't
                  a single signature look; it's the moment a client recognises herself in it.
                </p>
                <p>
                  So I ask questions. I listen. If you arrive knowing exactly what you want, we'll
                  build it together. If you're unsure, we'll figure it out together — colours,
                  textures, how bold or how soft, what feels like you.
                </p>
                <p>
                  Comfort matters just as much as artistry. My chair is a space where you can speak
                  freely about your preferences, change your mind, and be completely honest about
                  what you love.
                </p>
                <p className="font-display text-2xl italic leading-snug text-background">
                  “Everyone who leaves my chair should feel like a more confident and beautiful
                  version of themselves.”
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CLIENT EXPERIENCE */}
        <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal>
            <p className="eyebrow">The experience</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              More Than Just <span className="italic text-primary">Makeup.</span>
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>From the moment you sit in my chair, your vision matters.</p>
              <p>
                Whether you already know exactly what you want or need help figuring it out, I'll
                take the time to understand you and the look you're going for.
              </p>
              <p className="text-foreground">
                My goal isn't simply to apply makeup. It's to make sure you leave my chair feeling
                heard, beautiful and confident.
              </p>
            </div>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <Reveal>
              <p className="eyebrow">Contact</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">Ready to Get Glammed?</h2>
              <dl className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <MapPin className="mx-auto size-5 text-primary" />
                  <dt className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm">Vosloorus, Gauteng</dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <Phone className="mx-auto size-5 text-primary" />
                  <dt className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Call or WhatsApp
                  </dt>
                  <dd className="mt-1 text-sm">
                    <a href={site.phoneHref} className="hover:text-primary">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <Clock className="mx-auto size-5 text-primary" />
                  <dt className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Hours
                  </dt>
                  <dd className="mt-1 text-sm">
                    Monday – Sunday
                    <br />
                    09:00 – 16:00
                  </dd>
                </div>
              </dl>
              <Link
                to="/book"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-9 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-pink"
              >
                Book Your Glam
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
