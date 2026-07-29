import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RATE_MAX = 3;
const RATE_WINDOW = 60_000;
const MIN_FORM_TIME = 3000;
const ALLOWED_ORIGIN = process.env.SITE_URL;

const rateMap = new Map<string, { count: number; resetAt: number }>();

function sanitize(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

function msg(en: string, fa: string) {
  return { en, fa };
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if (
      origin &&
      origin !== ALLOWED_ORIGIN &&
      !origin.endsWith(".vercel.app")
    ) {
      return NextResponse.json(
        { error: msg("Forbidden", "دسترسی غیرمجاز") },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { name, email, message, rating, honeypot, formLoadedAt } = body;

    if (honeypot) {
      return NextResponse.json(
        { error: msg("Invalid request", "درخواست نامعتبر") },
        { status: 400 },
      );
    }

    if (!formLoadedAt || Date.now() - Number(formLoadedAt) < MIN_FORM_TIME) {
      return NextResponse.json(
        { error: msg("Invalid request", "درخواست نامعتبر") },
        { status: 400 },
      );
    }

    const ip = getIp(req);
    if (!checkRate(ip)) {
      return NextResponse.json(
        {
          error: msg(
            "Too many requests. Please try again later.",
            "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.",
          ),
        },
        { status: 429 },
      );
    }

    const fieldErrors: Record<string, { en: string; fa: string }> = {};
    if (!name || typeof name !== "string" || name.trim().length < 2)
      fieldErrors.name = msg(
        "Name must be at least 2 characters.",
        "نام باید حداقل ۲ حرف باشد",
      );
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      fieldErrors.email = msg(
        "Please enter a valid email address.",
        "لطفاً یک ایمیل معتبر وارد کنید",
      );
    if (!message || typeof message !== "string" || message.trim().length < 10)
      fieldErrors.message = msg(
        "Message must be at least 10 characters.",
        "پیام باید حداقل ۱۰ حرف باشد",
      );
    if (!rating)
      fieldErrors.rating = msg(
        "Please select a rating.",
        "لطفاً یک امتیاز انتخاب کنید",
      );
    if (Object.keys(fieldErrors).length) {
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }

    const safeName = sanitize(name.trim());
    const safeEmail = sanitize(email.trim());
    const safeMessage = sanitize(message.trim());

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO;
    const fromEmail = process.env.FROM_EMAIL;

    if (host && user && pass) {
      const transport = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user, pass },
      });

      await transport.sendMail({
        from: `"Contact Form" <${fromEmail}>`,
        to,
        replyTo: safeEmail,
        subject: `New message from ${safeName}`,
        html: `
          <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
            <h2 style="color:#1f2937;margin-bottom:20px;">📬 New Contact Message</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:80px;">Name</td><td style="padding:8px 0;color:#1f2937;font-weight:600;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:8px 0;color:#2563eb;">${safeEmail}</td></tr>
              ${rating ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Rating</td><td style="padding:8px 0;color:#1f2937;">${"★".repeat(Number(rating))}${"☆".repeat(5 - Number(rating))}</td></tr>` : ""}
            </table>
            <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0;color:#374151;line-height:1.6;white-space:pre-wrap;">${safeMessage}</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      {
        error: msg(
          "Something went wrong. Please try again later.",
          "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        ),
      },
      { status: 500 },
    );
  }
}
