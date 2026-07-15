import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Skills from "@/components/sections/Skills"
import Experience from "@/components/sections/Experience"
import Education from "@/components/sections/Education"
import Projects from "@/components/sections/Projects"
import Contact from "@/components/sections/Contact"
import NetworkBackground from "@/components/ui/NetworkBackground"
import { Locale } from "@/i18config"
import JsonLd from "@/components/JsonLd"

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
  return (
    <>
      <JsonLd locale={locale} />
      <NetworkBackground />
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[100px] bg-[rgba(37,99,235,0.06)] dark:bg-[rgba(59,130,246,0.08)] -top-[20%] -left-[15%] animate-[blobDrift_25s_ease-in-out_infinite]" />
        <div className="absolute w-[550px] h-[550px] rounded-full blur-[100px] bg-[rgba(99,102,241,0.05)] dark:bg-[rgba(99,102,241,0.06)] -bottom-[15%] -right-[10%] animate-[blobDrift_25s_ease-in-out_infinite_-10s]" />
        <div className="absolute w-[450px] h-[450px] rounded-full blur-[100px] bg-[rgba(167,139,250,0.04)] dark:bg-[rgba(167,139,250,0.05)] top-[45%] left-[55%] animate-[blobDrift_25s_ease-in-out_infinite_-18s]" />
      </div>

      <div className="relative z-10 overflow-x-hidden">
        <Navbar locale={locale} />
        <main className="pt-8 sm:pt-12">
          <Hero locale={locale} />
          <About locale={locale} />
          <Skills locale={locale} />
          <Experience locale={locale} />
          <Education locale={locale} />
          <Projects locale={locale} />
          <Contact locale={locale} />
        </main>
        <Footer locale={locale} />
      </div>
    </>
  )
}
