const rawSiteUrl = process.env.SITE_URL;

function normalizeSiteUrl(value: string | undefined): string {
  if (!value) return "https://mvahdati.ir";
  return value.startsWith("http") ? value : `https://${value}`;
}

export const siteConfig = {
  url: normalizeSiteUrl(rawSiteUrl),
} as const;

export type SiteConfig = typeof siteConfig;
