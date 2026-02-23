"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        formRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          delay: 0.15,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Erreur envoi");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 bg-primary/5"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={leftRef}>
            <h2
              ref={titleRef}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
            >
              Travaillons{" "}
              <span className="gradient-text">ensemble</span>
            </h2>
            <p className="text-muted mt-6 text-lg">
              Un projet, une idée ou simplement un bonjour — envoyez-moi un message.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-mono text-sm">
                →
              </div>
              <p className="text-sm text-muted self-center">
                Réponse sous 24–48h
              </p>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-shadow"
                placeholder="Votre message..."
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-4 rounded-xl bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {status === "loading" ? "Envoi..." : "Envoyer"}
            </button>
            {status === "success" && (
              <p className="text-center text-green-600 dark:text-green-400 text-sm">
                Message envoyé avec succès.
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-red-600 dark:text-red-400 text-sm">
                Erreur lors de l&apos;envoi. Réessayez.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
