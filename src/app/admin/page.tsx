"use client";

import Link from "next/link";
import { useAdminSession } from "@/app/admin/useAdminSession";
import { useAdminData } from "@/app/admin/useAdminData";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminSkillForm } from "@/components/admin/AdminSkillForm";
import { AdminExperienceForm } from "@/components/admin/AdminExperienceForm";
import { AdminProjectForm } from "@/components/admin/AdminProjectForm";

export default function AdminPage() {
  const {
    supabase,
    session,
    loading,
    email,
    password,
    authError,
    authLoading,
    setEmail,
    setPassword,
    handleLogin,
    handleLogout,
  } = useAdminSession();
  const { skillsList, experiencesList, projectsList, refresh } = useAdminData(session?.access_token);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-xl font-bold text-foreground mb-2">Admin</h1>
          <p className="text-muted text-sm">
            Configure <code className="bg-card px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
            <code className="bg-card px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans{" "}
            <code className="bg-card px-1 rounded">.env.local</code> pour activer la connexion.
          </p>
          <Link href="/" className="inline-block mt-4 text-heading hover:underline">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AdminLoginForm
        email={email}
        password={password}
        authError={authError}
        authLoading={authLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader email={session.user.email} onLogout={handleLogout} />
      <main className="container mx-auto max-w-4xl px-6 py-10">
        <p className="text-muted mb-10">
          Consulte, ajoute ou supprime des compétences, expériences et projets. Ils s&apos;affichent sur la page d&apos;accueil.
        </p>
        <div className="space-y-14">
          <AdminSkillForm
            token={session.access_token}
            items={skillsList}
            onRefresh={refresh}
          />
          <AdminExperienceForm
            token={session.access_token}
            items={experiencesList}
            onRefresh={refresh}
          />
          <AdminProjectForm
            token={session.access_token}
            items={projectsList}
            onRefresh={refresh}
          />
        </div>
      </main>
    </div>
  );
}
