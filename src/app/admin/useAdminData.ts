"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExperienceItem, ProjectItem, SkillItem } from "@/app/admin/types";

export function useAdminData(accessToken: string | undefined) {
  const [skillsList, setSkillsList] = useState<SkillItem[]>([]);
  const [experiencesList, setExperiencesList] = useState<ExperienceItem[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [s, e, p] = await Promise.all([
        fetch("/api/skills").then((r) => r.json()),
        fetch("/api/experiences").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
      ]);
      setSkillsList(Array.isArray(s) ? s : []);
      setExperiencesList(Array.isArray(e) ? e : []);
      setProjectsList(Array.isArray(p) ? p : []);
    } catch {
      setSkillsList([]);
      setExperiencesList([]);
      setProjectsList([]);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      refresh();
    }
  }, [accessToken, refresh]);

  return {
    skillsList,
    experiencesList,
    projectsList,
    refresh,
  };
}
