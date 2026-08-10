import { cookies, headers } from "next/headers"
import NetworkBackground from "@/components/ui/NetworkBackground"
import AmbientBlobs from "@/components/ui/AmbientBlobs"
import NotFoundContent from "@/components/layout/NotFoundContent"

export default function NotFound() {
  const rawLocale =
    headers().get("x-locale") || cookies().get("locale")?.value || ""
  const locale = rawLocale === "fa" ? "fa" : "en"

  return (
    <>
      <NetworkBackground />
      <AmbientBlobs />

      <NotFoundContent locale={locale} />
    </>
  )
}
