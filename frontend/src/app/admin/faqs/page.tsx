"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  enabled: boolean;
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const load = () =>
    adminJson<Faq[]>("/api/faqs/manage").then(({ json }) => setItems(json.data || []));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminJson("/api/faqs", {
      method: "POST",
      body: JSON.stringify({ question, answer }),
    });
    setQuestion("");
    setAnswer("");
    load();
  };

  const toggle = async (faq: Faq) => {
    await adminJson(`/api/faqs/${faq.id}`, {
      method: "PUT",
      body: JSON.stringify({ enabled: !faq.enabled }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete FAQ?")) return;
    await adminJson(`/api/faqs/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <PageHeader title="FAQs" description="Shown on the storefront homepage." />
      <form onSubmit={onSubmit} className="mb-8 space-y-3 rounded-2xl border border-border bg-card p-5">
        <Input placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
        <Textarea placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} required rows={3} />
        <Button type="submit">Add FAQ</Button>
      </form>
      <ul className="space-y-3">
        {items.map((faq) => (
          <li key={faq.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{faq.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => toggle(faq)}>
                  {faq.enabled ? "Disable" : "Enable"}
                </Button>
                <Button type="button" variant="outline" onClick={() => remove(faq.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
