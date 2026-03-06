import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getSupabasePublic } from "@/lib/supabase-server";

type SkillItem = { id: string; name: string; sort_order: number };
type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
};
type ProjectItem = {
  id: string;
  title: string;
  stack: string;
  description: string;
  link: string;
  featured: boolean;
  sort_order: number;
};

async function fetchPageData() {
  try {
    const db = getSupabasePublic();
    const [skillsRes, experiencesRes, projectsRes] = await Promise.all([
      db.from("skills").select("id, name, sort_order").order("sort_order", { ascending: true }),
      db.from("experiences").select("id, role, company, period, description, sort_order").order("sort_order", { ascending: true }),
      db.from("projects").select("id, title, stack, description, link, featured, sort_order").order("sort_order", { ascending: true }),
    ]);
    return {
      skills: (skillsRes.data ?? []) as SkillItem[],
      experiences: (experiencesRes.data ?? []) as ExperienceItem[],
      projects: (projectsRes.data ?? []) as ProjectItem[],
    };
  } catch {
    return { skills: [], experiences: [], projects: [] };
  }
}

export default async function Home() {
  const { skills, experiences, projects } = await fetchPageData();

  return (
    <main className="w-full min-w-0">
      <Hero />
      <About />
      <Skills initialData={skills} />
      <Experience initialData={experiences} />
      <Projects initialData={projects} />
      <Contact />
      <Footer />
    </main>
  );
}
