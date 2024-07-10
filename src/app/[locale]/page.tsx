import Theme from "@/components/theme";
import { Locale } from "@/i18config";
import { getDictionary } from "@/lib/dictionary";


export default async function Page({ params: { locale } }: { params: { locale: Locale } }) {

  const t = await getDictionary(locale, "home")

  return (
    <>
      <Theme />
      <div className={`text-2xl sm:text-4xl md:text-6xl text-center text-primary`}>{t.header} MODE</div>
      <div className={`text-2xl text-center text-secondary`}>MODE</div>
      <div className={`text-center`}>MODE</div>
      <div className="bg-card-foreground size-10">
      </div>
    </>
  );
}


