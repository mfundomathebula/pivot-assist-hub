import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  bookingInputSchema,
  buildSlots,
  getService,
  studioNowTime,
  studioToday,
  toMinutes,
} from "./booking-schema";

const dateSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function loadSettings() {
  const db = await admin();
  const { data } = await db
    .from("studio_settings")
    .select("appointment_duration_minutes, opening_time, closing_time")
    .eq("id", true)
    .maybeSingle();

  return {
    duration: data?.appointment_duration_minutes ?? 60,
    opening: (data?.opening_time ?? "09:00").slice(0, 5),
    closing: (data?.closing_time ?? "16:00").slice(0, 5),
  };
}

/** Public: which slots are still open on a given day. */
export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => dateSchema.parse(data))
  .handler(async ({ data }) => {
    const db = await admin();
    const { duration, opening, closing } = await loadSettings();
    const allSlots = buildSlots(opening, closing, duration);

    const today = studioToday();
    if (data.date < today) {
      return { date: data.date, slots: [], dayBlocked: true, duration, opening, closing };
    }

    const [{ data: booked }, { data: blocked }] = await Promise.all([
      db
        .from("bookings")
        .select("appointment_time")
        .eq("appointment_date", data.date)
        .neq("booking_status", "cancelled"),
      db.from("blocked_slots").select("blocked_time").eq("blocked_date", data.date),
    ]);

    const dayBlocked = (blocked ?? []).some((b) => b.blocked_time === null);
    const taken = new Set([
      ...(booked ?? []).map((b) => String(b.appointment_time).slice(0, 5)),
      ...(blocked ?? [])
        .filter((b) => b.blocked_time !== null)
        .map((b) => String(b.blocked_time).slice(0, 5)),
    ]);

    const nowMinutes = data.date === today ? toMinutes(studioNowTime()) : -1;

    const slots = allSlots.map((time) => ({
      time,
      available: !dayBlocked && !taken.has(time) && toMinutes(time) > nowMinutes,
    }));

    return { date: data.date, slots, dayBlocked, duration, opening, closing };
  });

/** Public: create a booking with full server-side validation. */
export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingInputSchema.parse(data))
  .handler(async ({ data }) => {
    const service = getService(data.service);
    if (!service) return { ok: false as const, error: "Please choose a service." };

    const { duration, opening, closing } = await loadSettings();
    const slots = buildSlots(opening, closing, duration);
    if (!slots.includes(data.time)) {
      return { ok: false as const, error: "That time is outside our working hours." };
    }

    const today = studioToday();
    if (data.date < today) {
      return { ok: false as const, error: "Please choose a date in the future." };
    }
    if (data.date === today && toMinutes(data.time) <= toMinutes(studioNowTime())) {
      return { ok: false as const, error: "That time has already passed today." };
    }

    const db = await admin();

    const { data: blocked } = await db
      .from("blocked_slots")
      .select("blocked_time")
      .eq("blocked_date", data.date);

    const isBlocked = (blocked ?? []).some(
      (b) => b.blocked_time === null || String(b.blocked_time).slice(0, 5) === data.time,
    );
    if (isBlocked) {
      return { ok: false as const, error: "That time is unavailable. Please choose another slot." };
    }

    const { data: booking, error } = await db
      .from("bookings")
      .insert({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || null,
        service: service.name,
        price: service.price,
        appointment_date: data.date,
        appointment_time: data.time,
        duration_minutes: duration,
        notes: data.notes || null,
      })
      .select("id, appointment_date, appointment_time, service, price, customer_name")
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false as const,
          error: "That slot has just been taken. Please choose another time.",
        };
      }
      console.error("[booking] insert failed", error);
      return { ok: false as const, error: "Something went wrong. Please try again." };
    }

    const { sendSms, normalisePhone } = await import("./sms.server");
    const message = [
      "New Makeup Booking ✨",
      `Client: ${data.customerName}`,
      `Service: ${service.name}`,
      `Price: R${service.price}`,
      `Date: ${data.date}`,
      `Time: ${data.time}`,
      `Phone: ${data.customerPhone}`,
      `Email: ${data.customerEmail || "—"}`,
      `Vision/Notes: ${data.notes || "—"}`,
    ].join("\n");

    await sendSms(normalisePhone("065 230 5824"), message);

    return {
      ok: true as const,
      booking: {
        id: booking.id,
        name: booking.customer_name,
        service: booking.service,
        price: booking.price,
        date: String(booking.appointment_date),
        time: String(booking.appointment_time).slice(0, 5),
      },
    };
  });
