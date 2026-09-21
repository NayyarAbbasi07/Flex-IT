"use client";

import { FormEvent, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiSend } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-foreground focus-ring";

export function ReviewSubmitForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [productName, setProductName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const res = await apiSend<{ id: string }>("/api/testimonials/submit", "POST", {
      name: name.trim(),
      rating,
      comment: comment.trim(),
      productName: productName.trim() || null,
      location: location.trim() || null,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Could not submit your review. Please try again.");
      return;
    }
    setMessage(
      "Thanks! Your review was sent. We’ll publish it on the homepage after a quick check."
    );
    setName("");
    setRating(5);
    setComment("");
    setProductName("");
    setLocation("");
  };

  return (
    <form
      id="leave-review"
      onSubmit={onSubmit}
      className="mt-12 rounded-3xl border border-border bg-muted/30 p-6 sm:p-8"
    >
      <h3 className="font-display text-2xl font-bold tracking-tight">Share your experience</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Bought from Flex it!? Leave a review here — no admin login needed.
      </p>

      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium">Rating</span>
        <div className="flex gap-1" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              className="rounded-lg p-1 transition hover:bg-muted focus-ring"
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  n <= rating ? "fill-foreground text-foreground" : "text-border-strong"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium">Your name</span>
          <input
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="e.g. Ali"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Product (optional)</span>
          <input
            type="text"
            maxLength={200}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className={fieldClass}
            placeholder="Nike Dunk Low"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">City (optional)</span>
          <input
            type="text"
            maxLength={120}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={fieldClass}
            placeholder="Lahore"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium">Your review</span>
          <textarea
            required
            minLength={3}
            maxLength={2000}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={cn(fieldClass, "h-auto resize-y py-3")}
            placeholder="What did you like about the shoes and service?"
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {message && (
        <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{message}</p>
      )}

      <Button type="submit" size="lg" fullWidth className="mt-6" disabled={loading}>
        {loading ? "Sending…" : "Submit review"}
      </Button>
    </form>
  );
}
