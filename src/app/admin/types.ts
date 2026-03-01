export type SkillItem = {
  id: string;
  name: string;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  stack: string;
  description: string;
  link: string;
  featured: boolean;
};
