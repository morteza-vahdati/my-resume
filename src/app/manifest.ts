import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Morteza Vahdati | Web Developer",
    short_name: "Morteza Vahdati",
    description: "A bilingual resume for a web developer building practical interfaces and web systems with React, Next.js, TypeScript, and NestJS.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#2563EB",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  }
}
