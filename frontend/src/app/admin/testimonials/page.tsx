"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type Row = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productName?: string | null;
  location?: string | null;
  enabled: boolean;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Row[]>([]);

  const load = () =>
    adminJson<Row[]>("/api/testimonials/manage").then(({ json }) =>
      setItems(json.data || [])
    );

  useEffect(() => {
    load();
  }, []);

  const setEnabled = async (id: string, enabled: boolean) => {
    await adminJson(`/api/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify({ enabled }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    await adminJson(`/api/testimonials/${id}`, { method: "DELETE" });
    load();
  };

  const pending = items.filter((r) => !r.enabled);
  const live = items.filter((r) => r.enabled);

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Customers submit reviews on the homepage. Approve, hide, or delete them here — do not add fake reviews from admin."
      />

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Pending approval ({pending.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {pending.map((row) => (
              <ReviewRow
                key={row.id}
                row={row}
                onApprove={() => setEnabled(row.id, true)}
                onDelete={() => remove(row.id)}
              />
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Published ({live.length})
        </h2>
        {live.length === 0 && pending.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            No reviews yet. They appear here after customers submit on the homepage.
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {live.map((row) => (
            <ReviewRow
              key={row.id}
              row={row}
              onApprove={() => setEnabled(row.id, false)}
              approveLabel="Unpublish"
              onDelete={() => remove(row.id)}
            />
          ))}
        </ul>
      </section>
    </>
  );
}

function ReviewRow({
  row,
  onApprove,
  approveLabel = "Approve",
  onDelete,
}: {
  row: Row;
  onApprove: () => void;
  approveLabel?: string;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold">
            {row.name} · {row.rating}/5
            {!row.enabled && (
              <span className="ml-2 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">
                Pending
              </span>
            )}
          </p>
          {(row.productName || row.location) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {[row.location, row.productName].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{row.comment}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onApprove}>
            {approveLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}
