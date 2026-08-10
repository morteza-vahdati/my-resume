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
import AmbientBlobs from "@/components/ui/AmbientBlobs"
import ScrollToHash from "@/components/ui/ScrollToHash"
import { Locale } from "@/i18config"
import JsonLd from "@/components/JsonLd"

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
  return (
    <>
      <JsonLd locale={locale} />
      <ScrollToHash />
      <NetworkBackground />
      <AmbientBlobs />

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
