/**
 * Server-only SMS delivery through the Lovable connector gateway (Twilio).
 * Credentials never leave the server. If Twilio isn't connected yet the
 * booking still succeeds and the notification is logged instead.
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

export type SmsResult = { sent: boolean; reason?: string };

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const lovableApiKey = process.env["LOVABLE_API_KEY"];
  const twilioKey = process.env["TWILIO_API_KEY"];
  const from = process.env["TWILIO_PHONE_NUMBER"];

  if (!lovableApiKey || !twilioKey || !from) {
    console.warn("[sms] Twilio is not configured yet — notification not sent.", { to, body });
    return { sent: false, reason: "twilio_not_configured" };
  }

  try {
    const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": twilioKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[sms] Twilio request failed [${response.status}]: ${errorBody}`);
      return { sent: false, reason: `provider_error_${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    console.error("[sms] Unexpected failure sending SMS", error);
    return { sent: false, reason: "network_error" };
  }
}

export function normalisePhone(input: string) {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+27${digits.slice(1)}`;
  if (digits.startsWith("27")) return `+${digits}`;
  return digits;
}
