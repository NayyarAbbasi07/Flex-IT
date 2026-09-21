"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Hero = {
  heading: string;
  subheading: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  imageUrls: string[];
};

export default function AdminHomepagePage() {
  const [hero, setHero] = useState<Hero>({
    heading: "",
    subheading: "",
    description: "",
    primaryCtaText: "Shop Collection",
    primaryCtaHref: "/shop",
    secondaryCtaText: "Contact on WhatsApp",
    imageUrls: [],
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminJson<Hero>("/api/hero").then(({ json }) => {
      if (json.data) setHero(json.data);
    });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminJson("/api/hero", {
      method: "PUT",
      body: JSON.stringify(hero),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader title="Homepage" description="Edit hero content without code." />
      <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Headline (under brand name)</span>
          <Input
            value={hero.heading}
            onChange={(e) => setHero({ ...hero, heading: e.target.value })}
            placeholder="Curated Fashion."
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Do not repeat the brand name — it already shows above this line on the homepage.
          </span>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Subheading (optional)</span>
          <Input
            value={hero.subheading}
            onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Description</span>
          <Textarea rows={3} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Primary CTA text</span>
          <Input value={hero.primaryCtaText} onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Primary CTA link</span>
          <Input value={hero.primaryCtaHref} onChange={(e) => setHero({ ...hero, primaryCtaHref: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Hero image URLs (comma separated)</span>
          <Textarea
            rows={3}
            value={hero.imageUrls.join(", ")}
            onChange={(e) =>
              setHero({
                ...hero,
                imageUrls: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <Button type="submit">{saved ? "Saved" : "Save homepage"}</Button>
      </form>
    </>
  );
}
