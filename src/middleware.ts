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
    const cookieLocale = request.cookies.get("locale")?.value;
    const locale =
      (cookieLocale &&
      i18n.locales.includes(cookieLocale as (typeof i18n)["locales"][number])
        ? cookieLocale
        : getLocale(request)) || i18n.defaultLocale;
    const response = NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
    response.cookies.set("locale", locale, { path: "/" });
    return response;
  }

  const localeFromPath = pathname.split("/")[1];
  if (
    i18n.locales.includes(localeFromPath as (typeof i18n)["locales"][number])
  ) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", localeFromPath);
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    if (request.cookies.get("locale")?.value !== localeFromPath) {
      response.cookies.set("locale", localeFromPath, { path: "/" });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|images|pdf|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
};
