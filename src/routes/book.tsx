import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAvailability, createBooking } from "@/lib/booking.functions";
import {
  bookingInputSchema,
  formatDateLong,
  services,
  studioToday,
  type ServiceId,
} from "@/lib/booking-schema";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  service: z.enum(["full-glam", "soft-glam"]).optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book Your Glam | PearliiBeauty Makeup Artist Vosloorus" },
      {
        name: "description",
        content:
          "Book your soft glam or full glam makeup appointment in Vosloorus, Gauteng. Pick your service, date and time — open daily 09:00 to 16:00.",
      },
      { property: "og:title", content: "Book Your Glam | PearliiBeauty" },
      {
        property: "og:description",
        content: "Choose your look, pick a time and secure your appointment in a few taps.",
      },
    ],
  }),
  component: BookPage,
});

type Step = 1 | 2 | 3 | 4;

const steps = [
  { n: 1, label: "Service" },
  { n: 2, label: "Date & Time" },
  { n: 3, label: "Details" },
  { n: 4, label: "Confirmed" },
] as const;

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(search.service ? 2 : 1);
  const [serviceId, setServiceId] = useState<ServiceId | null>(search.service ?? null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<{
    name: string;
    service: string;
    price: number;
    date: string;
    time: string;
  } | null>(null);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [serviceId]);
  const dateISO = selectedDate ? toISO(selectedDate) : null;

  const fetchAvailability = useServerFn(getAvailability);
  const availability = useQuery({
    queryKey: ["availability", dateISO],
    queryFn: () => fetchAvailability({ data: { date: dateISO! } }),
    enabled: Boolean(dateISO),
  });

  const submitBooking = useServerFn(createBooking);
  const booking = useMutation({
    mutationFn: submitBooking,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setConfirmed(result.booking);
      setStep(4);
    },
    onError: () => toast.error("We couldn't complete your booking. Please try again."),
  });

  const today = studioToday();
  const minDate = new Date(`${today}T00:00:00`);
  const maxDate = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + 120);

  function chooseService(id: ServiceId) {
    setServiceId(id);
    navigate({ to: "/book", search: { service: id }, replace: true });
    setStep(2);
  }

  function submit() {
    const payload = {
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email,
      service: serviceId!,
      date: dateISO!,
      time: time!,
      notes: form.notes,
    };
    const parsed = bookingInputSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    booking.mutate({ data: parsed.data });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center">
            <p className="eyebrow">Booking</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">
              {step === 4 ? "You're Booked" : "Book Your Glam"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {site.location} · Monday – Sunday · 09:00 – 16:00
            </p>
          </div>

          {/* Stepper */}
          <ol className="mx-auto mt-10 flex max-w-xl items-center">
            {steps.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <li key={s.n} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-full border text-xs font-medium transition-colors",
                        done && "border-primary bg-primary text-primary-foreground",
                        active && "border-foreground bg-foreground text-background",
                        !done && !active && "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-4" /> : s.n}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-[0.16em]",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <span
                      className={cn(
                        "mx-2 mb-5 h-px flex-1 transition-colors",
                        step > s.n ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-9">
            {/* STEP 1 — service */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl">Which look are you after?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Not sure? Choose the closest one — we'll refine it together in the chair.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => chooseService(s.id)}
                      className="group rounded-2xl border border-border p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-2xl">{s.name}</h3>
                        <span className="font-display text-xl text-primary">R{s.price}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.14em] text-primary">
                        Select <ArrowRight className="size-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — date & time */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl">Pick your date & time</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service?.name} · R{service?.price} · 60 minutes
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-border p-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setTime(null);
                      }}
                      disabled={{ before: minDate, after: maxDate }}
                      className="pointer-events-auto p-3"
                    />
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                      <Clock className="size-4" /> Available times
                    </h3>

                    {!dateISO && (
                      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" /> Choose a date to see open slots.
                      </p>
                    )}

                    {dateISO && availability.isPending && (
                      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Checking availability…
                      </p>
                    )}

                    {dateISO && availability.data && (
                      <>
                        {availability.data.dayBlocked ||
                        availability.data.slots.every((s) => !s.available) ? (
                          <p className="mt-4 rounded-2xl bg-surface p-4 text-sm text-muted-foreground">
                            No openings on this date. Please try another day, or call{" "}
                            <a href={site.phoneHref} className="text-primary">
                              {site.phone}
                            </a>
                            .
                          </p>
                        ) : (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {availability.data.slots.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                onClick={() => setTime(slot.time)}
                                className={cn(
                                  "rounded-xl border px-2 py-2.5 text-sm transition-colors",
                                  time === slot.time
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary",
                                  !slot.available &&
                                    "cursor-not-allowed border-dashed text-muted-foreground/50 line-through hover:border-dashed hover:border-border",
                                )}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-1 size-4" /> Back
                  </Button>
                  <Button
                    className="rounded-full px-7"
                    disabled={!dateISO || !time}
                    onClick={() => setStep(3)}
                  >
                    Continue <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 — details */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl">Your details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service?.name} · {dateISO ? formatDateLong(dateISO) : ""} at {time}
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      maxLength={80}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5 rounded-xl"
                      placeholder="Your name"
                    />
                    {errors["customerName"] && (
                      <p className="mt-1 text-xs text-destructive">{errors["customerName"]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      value={form.phone}
                      maxLength={20}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1.5 rounded-xl"
                      placeholder="082 000 0000"
                    />
                    {errors["customerPhone"] && (
                      <p className="mt-1 text-xs text-destructive">{errors["customerPhone"]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      maxLength={160}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5 rounded-xl"
                      placeholder="you@email.com"
                    />
                    {errors["customerEmail"] && (
                      <p className="mt-1 text-xs text-destructive">{errors["customerEmail"]}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Tell me your vision (optional)</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      maxLength={1200}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="mt-1.5 min-h-28 rounded-xl"
                      placeholder="Occasion, outfit colours, inspiration, anything you love or want to avoid…"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button variant="ghost" className="rounded-full" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-1 size-4" /> Back
                  </Button>
                  <Button
                    className="rounded-full px-7"
                    onClick={submit}
                    disabled={booking.isPending}
                  >
                    {booking.isPending ? (
                      <>
                        <Loader2 className="mr-1 size-4 animate-spin" /> Booking…
                      </>
                    ) : (
                      <>Confirm booking</>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4 — confirmation */}
            {step === 4 && confirmed && (
              <div className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft">
                  <Sparkles className="size-6 text-primary" />
                </span>
                <h2 className="mt-5 font-display text-3xl">See you soon, {confirmed.name}!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your appointment is confirmed and Pearlii has been notified.
                </p>

                <dl className="mx-auto mt-7 max-w-sm space-y-3 rounded-2xl bg-surface p-6 text-left text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Service</dt>
                    <dd className="font-medium">{confirmed.service}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-medium">{formatDateLong(confirmed.date)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Time</dt>
                    <dd className="font-medium">{confirmed.time}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-border pt-3">
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-display text-lg text-primary">R{confirmed.price}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-xs text-muted-foreground">
                  Need to change something? Call or WhatsApp{" "}
                  <a href={site.phoneHref} className="text-primary">
                    {site.phone}
                  </a>
                  .
                </p>

                <Button asChild variant="outline" className="mt-7 rounded-full px-7">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
