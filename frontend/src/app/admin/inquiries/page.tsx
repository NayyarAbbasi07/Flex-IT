"use client";

import { useEffect, useState } from "react";
import { PageHeader, Select } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: string;
  source: string;
  size?: string | null;
  product?: { name: string; slug: string } | null;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [status, setStatus] = useState("");

  const load = () => {
    const q = status ? `?status=${status}` : "";
    return adminJson<Inquiry[]>(`/api/inquiries${q}`).then(({ json }) =>
      setItems(json.data || [])
    );
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: string, next: string) => {
    await adminJson(`/api/inquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: next }),
    });
    load();
  };

  return (
    <>
      <PageHeader title="Inquiries" description="WhatsApp / web lead requests." />
      <div className="mb-4 flex gap-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </Select>
        <Button type="button" variant="outline" onClick={load}>Filter</Button>
      </div>
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{row.name} · {row.phone}</p>
                <p className="text-xs text-muted-foreground">
                  {row.status} · {row.source}
                  {row.product ? ` · ${row.product.name}` : ""}
                  {row.size ? ` · size ${row.size}` : ""}
                </p>
                {row.message ? (
                  <p className="mt-2 text-sm text-muted-foreground">{row.message}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => updateStatus(row.id, "CONTACTED")}>
                  Contacted
                </Button>
                <Button type="button" variant="outline" onClick={() => updateStatus(row.id, "CLOSED")}>
                  Close
                </Button>
              </div>
            </div>
          </li>
        ))}
        {!items.length ? (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        ) : null}
      </ul>
    </>
  );
}
