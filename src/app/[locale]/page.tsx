import { Locale } from "@/i18config";
import { getDictionary } from "@/lib/dictionary";


export default async function Page({ params: { locale } }: { params: { locale: Locale } }) {

  const t = await getDictionary(locale, "home")

  return (
    <>
      <div className={`text-4xl sm:text-6xl md:text-8xl text-center text-primary`}>{t.header} MODE</div>
      <div className={`text-4xl text-center text-secondary`}>MODE</div>
      <div className={`text-center`}>MODE</div>
      <div className="bg-card-foreground size-10">
      </div>
    </>
  );
}


