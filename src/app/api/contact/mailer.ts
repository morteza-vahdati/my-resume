import nodemailer from "nodemailer"
import type { ContactPayload } from "./validate"

/** Values land inside an HTML email, so escape before interpolating. */
function escapeHtml(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  )
}

function template({ name, email, message, rating }: ContactPayload): string {
  const stars = rating
    ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Rating</td><td style="padding:8px 0;color:#1f2937;">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</td></tr>`
    : ""

  return `
    <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
    <h2 style="color:#1f2937;margin-bottom:20px;">📬 New message from your portfolio</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:80px;">Sender</td><td style="padding:8px 0;color:#1f2937;font-weight:600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Reply to</td><td style="padding:8px 0;color:#2563eb;">${escapeHtml(email)}</td></tr>
        ${stars}
      </table>
      <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
        <p style="margin:0;color:#374151;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  `
}

/** Resolves false when a configured server rejects the message. */
export async function sendContactMail(payload: ContactPayload): Promise<boolean> {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transport.sendMail({
      from: `"Portfolio contact" <${process.env.FROM_EMAIL}>`,
      to: process.env.CONTACT_TO,
      replyTo: payload.email,
      subject: `New message from ${payload.name}`,
      html: template(payload),
    })
    return true
  } catch (err) {
    console.error("Email send failed:", err)
    return false
  }
}
