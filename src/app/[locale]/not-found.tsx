import Link from "next/link"
import { headers } from "next/headers"

export default function NotFound() {
  const acceptLang = headers().get("accept-language") || "en"
  const locale = acceptLang.startsWith("fa") ? "fa" : "en"
  const isRtl = locale === "fa"

  return (
    <>
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[100px] bg-[rgba(37,99,235,0.06)] dark:bg-[rgba(59,130,246,0.08)] -top-[20%] -left-[15%] animate-[blobDrift_25s_ease-in-out_infinite]" />
        <div className="absolute w-[550px] h-[550px] rounded-full blur-[100px] bg-[rgba(99,102,241,0.05)] dark:bg-[rgba(99,102,241,0.06)] -bottom-[15%] -right-[10%] animate-[blobDrift_25s_ease-in-out_infinite_-10s]" />
        <div className="absolute w-[450px] h-[450px] rounded-full blur-[100px] bg-[rgba(167,139,250,0.04)] dark:bg-[rgba(167,139,250,0.05)] top-[45%] left-[55%] animate-[blobDrift_25s_ease-in-out_infinite_-18s]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-lg">
          <div className="text-[clamp(5rem,15vw,10rem)] font-black tracking-[-4px] leading-none font-display text-accent/20 dark:text-accent/15 select-none">
            404
          </div>

          <div
            className="relative -mt-6 mb-8 p-8 rounded-2xl backdrop-blur-xl border"
            style={{
              backgroundColor: "var(--color-glass-bg)",
              borderColor: "var(--color-glass-bdr)",
              boxShadow: "var(--shadow-glass)",
            }}
          >
            <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center text-accent mx-auto mb-5">
              <i className="fa-solid fa-compass text-xl" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-3 font-display">
              {isRtl ? "صفحه‌ای که به دنبال آن هستید یافت نشد" : "Page not found"}
            </h1>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {isRtl
                ? "به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد یا به مکان دیگری منتقل شده است."
                : "The page you're looking for doesn't exist or has been moved to another location."}
            </p>

            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 hover:-translate-y-0.5 transition-all duration-300"
            >
              <i className="fa-solid fa-arrow-left rtl:rotate-180 text-xs" />
              {isRtl ? "بازگشت به خانه" : "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
