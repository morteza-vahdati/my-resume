import { NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import i18config from "./i18/i18config";

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18config);
}

export const config = {
  matcher: "/((?!api|static|.*\\..|_next).*)",
};
