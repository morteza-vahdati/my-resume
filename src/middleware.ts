import { i18n, Locales } from "@/i18config";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: Locales = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const validLanguages = languages.filter((l: string) => {
    try {
      Intl.getCanonicalLocales(l);
      return true;
    } catch {
      return false;
    }
  });

  const locale = matchLocale(validLanguages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|images|pdf|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
};
