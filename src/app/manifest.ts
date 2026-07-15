import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Morteza Vahdati | Frontend Developer",
    short_name: "Morteza Vahdati",
    description: "Frontend developer specializing in React, Next.js, and TypeScript",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#2563EB",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  }
}
