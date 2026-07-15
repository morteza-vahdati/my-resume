import resumeData from "@data/resume.json";
import type { Locale } from "@/i18config";

export type ResumeData = typeof resumeData;
export type PersonalInfo = ResumeData["personal"];
export type Experience = ResumeData["experience"][number];
export type Education = ResumeData["education"][number];
export type Course = ResumeData["courses"][number];
export type SkillCategory = ResumeData["skills"]["categories"][number];
export type Project = ResumeData["projects"][number];
export type Social = ResumeData["social"];

export function getResumeData(): ResumeData {
  return resumeData as ResumeData;
}

export function getLocalizedText(
  obj: Record<Locale, string> | undefined,
  locale: Locale
): string {
  if (!obj) return "";
  return obj[locale] || obj["en"] || "";
}

export function getPersonal(locale: Locale) {
  const data = getResumeData().personal;
  return {
    ...data,
    name: getLocalizedText(data.name, locale),
    role: getLocalizedText(data.role, locale),
    location: getLocalizedText(data.location, locale),
    address: getLocalizedText(data.address, locale),
    gender: getLocalizedText(data.gender, locale),
    maritalStatus: getLocalizedText(data.maritalStatus, locale),
    militaryService: getLocalizedText(data.militaryService, locale),
    about: getLocalizedText(data.about, locale),
    typewriter: data.typewriter[locale] || data.typewriter.en,
    resumePdf: getLocalizedText(data.resumePdf, locale),
    languages: data.languages.map((l) => ({
      name: getLocalizedText(l.name, locale),
      level: getLocalizedText(l.level, locale),
    })),
    stats: {
      years: {
        number: data.stats.years.number,
        label: getLocalizedText(data.stats.years.label, locale),
      },
      projects: {
        number: data.stats.projects.number,
        label: getLocalizedText(data.stats.projects.label, locale),
      },
      clients: {
        number: data.stats.clients.number,
        label: getLocalizedText(data.stats.clients.label, locale),
      },
    },
  };
}

export function getExperience(locale: Locale) {
  return getResumeData().experience.map((exp) => ({
    ...exp,
    title: getLocalizedText(exp.title, locale),
    company: getLocalizedText(exp.company, locale),
    location: getLocalizedText(exp.location, locale),
    type: getLocalizedText(exp.type, locale),
    period: getLocalizedText(exp.period, locale),
    duration: getLocalizedText(exp.duration, locale),
    descriptions: exp.descriptions[locale] || exp.descriptions.en,
  }));
}

export function getEducation(locale: Locale) {
  return getResumeData().education.map((edu) => ({
    ...edu,
    degree: getLocalizedText(edu.degree, locale),
    school: getLocalizedText(edu.school, locale),
    period: getLocalizedText(edu.period, locale),
    status: getLocalizedText(edu.status, locale),
  }));
}

export function getCourses(locale: Locale) {
  return getResumeData().courses.map((c) => ({
    ...c,
    title: getLocalizedText(c.title, locale),
    institution: getLocalizedText(c.institution, locale),
    duration: getLocalizedText(c.duration, locale),
  }));
}

export function getSkills(locale: Locale) {
  const data = getResumeData().skills;
  return {
    categories: data.categories.map((cat) => ({
      name: getLocalizedText(cat.name, locale),
      items: cat.items.map((item) => ({
        ...item,
        level: getLocalizedText(item.level, locale),
      })),
    })),
    other: data.other,
  };
}

function toShamsiYear(gregorian: string): string {
  const g = Number.parseInt(gregorian, 10)
  return String(g - 621)
}

export function getProjects(locale: Locale) {
  return getResumeData().projects.map((p) => ({
    ...p,
    name: getLocalizedText(p.name, locale),
    description: getLocalizedText(p.description, locale),
    year: locale === "fa" ? toShamsiYear(p.year) : p.year,
  }));
}

export function getSeo(locale: Locale) {
  const data = getResumeData().seo;
  return {
    title: getLocalizedText(data.title, locale),
    description: getLocalizedText(data.description, locale),
    keywords: getLocalizedText(data.keywords, locale),
  };
}
