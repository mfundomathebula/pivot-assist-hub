import { z } from "zod";

export type ServiceId = "full-glam" | "soft-glam";

export const services = [
  {
    id: "full-glam" as const,
    name: "Full Glam",
    price: 500,
    description:
      "Bold, expressive and creative. Full glam is perfect when you want your eyes to make a statement, whether that's through colourful, bright or creative eyeshadow.",
    perfectFor:
      "Perfect for: Clients who want colour, creativity and a more dramatic glam.",
    tags: ["Colourful Eyes", "Creative Eyeshadow", "Bright Looks", "Defined Glam"],
  },
  {
    id: "soft-glam" as const,
    name: "Soft Glam",
    price: 400,
    description:
      "Soft, polished and timeless. Soft glam focuses on nude tones, beautifully defined brows and softer eyeshadow to enhance your natural features.",
    perfectFor:
      "Perfect for: Clients who want an elegant, subtle and beautifully refined look.",
    tags: ["Nude Tones", "Soft Eyeshadow", "Defined Brows", "Natural Definition"],
  },
];

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

export const bookingInputSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name").max(80),
  customerPhone: z
    .string()
    .trim()
    .min(9, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+()\s-]+$/, "Please enter a valid phone number"),
  customerEmail: z
    .string()
    .trim()
    .max(160)
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  service: z.enum(["full-glam", "soft-glam"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a time"),
  notes: z.string().trim().max(1200).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;

/** Local calendar date (YYYY-MM-DD) in the studio's timezone. */
export function studioToday(timeZone = "Africa/Johannesburg") {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

/** Current time (HH:MM) in the studio's timezone. */
export function studioNowTime(timeZone = "Africa/Johannesburg") {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function fromMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function buildSlots(opening: string, closing: string, duration: number) {
  const slots: string[] = [];
  const end = toMinutes(closing);
  for (let t = toMinutes(opening); t + duration <= end; t += duration) {
    slots.push(fromMinutes(t));
  }
  return slots;
}

export function formatDateLong(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatPrice(price: number) {
  return `R${price}`;
}
