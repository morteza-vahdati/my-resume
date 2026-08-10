import { msg, type LocalizedMessage } from "@/lib/localized"

export interface ContactPayload {
  name: string
  email: string
  message: string
  rating: number
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(body: Record<string, unknown>): {
  errors: Record<string, LocalizedMessage>
  value: ContactPayload
} {
  const errors: Record<string, LocalizedMessage> = {}
  const { name, email, message, rating } = body

  if (typeof name !== "string" || name.trim().length < 2)
    errors.name = msg("Name must be at least 2 characters.", "نام باید حداقل ۲ حرف باشد")

  if (typeof email !== "string" || !EMAIL_RE.test(email))
    errors.email = msg("Please enter a valid email address.", "لطفاً یک ایمیل معتبر وارد کنید")

  if (typeof message !== "string" || message.trim().length < 10)
    errors.message = msg("Message must be at least 10 characters.", "پیام باید حداقل ۱۰ حرف باشد")

  if (!rating) errors.rating = msg("Please select a rating.", "لطفاً یک امتیاز انتخاب کنید")

  return {
    errors,
    value: {
      name: typeof name === "string" ? name.trim() : "",
      email: typeof email === "string" ? email.trim() : "",
      message: typeof message === "string" ? message.trim() : "",
      rating: Number(rating) || 0,
    },
  }
}
