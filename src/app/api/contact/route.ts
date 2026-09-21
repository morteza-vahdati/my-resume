import { NextRequest, NextResponse } from "next/server";
import { msg } from "@/lib/localized";
import { checkRate, getIp, isAllowedOrigin, isTooFast } from "../guards";
import { sendContactMail, smtpConfigured } from "./mailer";
import { validate } from "./validate";

const INVALID = msg("We couldn't understand that request.", "درخواست قابل پردازش نیست.");

function fail(error: ReturnType<typeof msg>, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return fail(msg("This request is not allowed.", "این درخواست مجاز نیست."), 403);
    }

    const body = await req.json();

    // Cheapest checks first: a bot never gets as far as the mail server.
    if (body.honeypot) return fail(INVALID, 400);
    if (isTooFast(body.elapsedMs)) return fail(INVALID, 400);

    if (!checkRate(getIp(req))) {
      return fail(
        msg(
          "There have been too many attempts. Please try again in a little while.",
          "تلاش‌های زیادی انجام شده است. لطفاً کمی بعد دوباره امتحان کنید.",
        ),
        429,
      );
    }

    const { errors, value } = validate(body);
    if (Object.keys(errors).length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (!smtpConfigured()) {
      // No mail server wired up yet: accept the message rather than showing a
      // failure the visitor can do nothing about.
      return NextResponse.json({ success: true, emailSent: false });
    }

    // Reporting success when a configured mail server rejected the message
    // means the sender waits for a reply that will never come.
    if (!(await sendContactMail(value))) {
      return fail(
        msg(
          "We couldn't deliver your message. Please email me directly instead.",
          "ارسال پیام ممکن نشد. لطفاً این بار مستقیم ایمیل بزنید.",
        ),
        502,
      );
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return fail(
      msg(
        "Something went wrong on our side. Please try again later.",
        "در سمت ما مشکلی پیش آمد. لطفاً کمی بعد دوباره تلاش کنید.",
      ),
      500,
    );
  }
}
