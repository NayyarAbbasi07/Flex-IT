"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeader, Input } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

type Media = {
  id: string;
  filename: string;
  url: string;
  size: number;
};

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [q, setQ] = useState("");

  const load = () => {
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    fetch(`/api/admin/media${params}`)
      .then((r) => r.json())
      .then((j) => setMedia(j.data || []));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      await fetch("/api/admin/media", { method: "POST", body });
    }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete media?")) return;
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload and reuse product images."
        action={
          <label className="cursor-pointer">
            <span className="inline-flex h-11 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
              Upload
            </span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>
        }
      />
      <div className="mb-6 flex gap-2">
        <Input placeholder="Search media..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Button variant="outline" onClick={load}>
          Search
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {media.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-white p-2">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              <Image src={item.url} alt={item.filename} fill className="object-cover" sizes="200px" />
            </div>
            <p className="mt-2 truncate text-xs">{item.filename}</p>
            <div className="mt-2 flex justify-between gap-2">
              <button
                type="button"
                className="text-xs font-medium"
                onClick={() => navigator.clipboard.writeText(item.url)}
              >
                Copy URL
              </button>
              <button type="button" className="text-xs text-danger" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
