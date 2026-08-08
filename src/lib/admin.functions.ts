import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: { rpc: Function }; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

/**
 * Grants admin to the signed-in user only while the studio has no admin yet.
 * This is how the makeup artist claims her own dashboard on first sign-in.
 */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if ((count ?? 0) > 0) return { claimed: false as const };

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw error;
    return { claimed: true as const };
  });

export const getMyAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    return { isAdmin: Boolean(data), adminExists: (count ?? 0) > 0 };
  });

export const listBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((b) => ({
      ...b,
      appointment_date: String(b.appointment_date),
      appointment_time: String(b.appointment_time).slice(0, 5),
    }));
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["confirmed", "completed", "cancelled"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("bookings")
      .update({ booking_status: data.status })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

export const rescheduleBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.string().regex(/^\d{2}:\d{2}$/),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("bookings")
      .update({ appointment_date: data.date, appointment_time: data.time })
      .eq("id", data.id);
    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, error: "There is already a booking in that slot." };
      }
      throw error;
    }
    return { ok: true as const };
  });

export const listBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("blocked_slots")
      .select("*")
      .order("blocked_date", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((b) => ({
      id: b.id as string,
      date: String(b.blocked_date),
      time: b.blocked_time ? String(b.blocked_time).slice(0, 5) : null,
      reason: (b.reason as string | null) ?? null,
    }));
  });

export const addBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z
          .string()
          .regex(/^\d{2}:\d{2}$/)
          .nullable(),
        reason: z.string().trim().max(120).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blocked_slots").insert({
      blocked_date: data.date,
      blocked_time: data.time,
      reason: data.reason || null,
    });
    if (error) {
      if (error.code === "23505") return { ok: false as const, error: "Already blocked." };
      throw error;
    }
    return { ok: true as const };
  });

export const removeBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blocked_slots").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

export const getSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("studio_settings")
      .select("appointment_duration_minutes, opening_time, closing_time")
      .eq("id", true)
      .maybeSingle();
    if (error) throw error;
    return {
      duration: data?.appointment_duration_minutes ?? 60,
      opening: (data?.opening_time ?? "09:00").slice(0, 5),
      closing: (data?.closing_time ?? "16:00").slice(0, 5),
    };
  });

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        duration: z.number().int().min(15).max(240),
        opening: z.string().regex(/^\d{2}:\d{2}$/),
        closing: z.string().regex(/^\d{2}:\d{2}$/),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("studio_settings")
      .update({
        appointment_duration_minutes: data.duration,
        opening_time: data.opening,
        closing_time: data.closing,
      })
      .eq("id", true);
    if (error) throw error;
    return { ok: true as const };
  });
