"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { getGeneralWhatsAppUrl, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useWhatsAppSettings } from "@/components/providers/WhatsAppSettingsProvider";
import { Button } from "@/components/ui/Button";

interface ContactContentProps {
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  businessHours?: string;
}

export function ContactContent({
  email,
  phone,
  address,
  whatsappNumber,
  businessHours,
}: ContactContentProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { defaultMessage } = useWhatsAppSettings();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = [
      "Hello Flex it!",
      "",
      `My name is ${name || "a customer"}.`,
      "",
      message || "I'd like to know more about your collection.",
    ].join("\n");
    window.open(
      buildWhatsAppUrl(text, whatsappNumber),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-6">
        <a
          href={getGeneralWhatsAppUrl(defaultMessage, whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md focus-ring"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold">WhatsApp</span>
            <span className="mt-1 block text-sm text-muted-foreground">{phone}</span>
            {businessHours && (
              <span className="mt-1 block text-xs text-muted-foreground">
                {businessHours}
              </span>
            )}
          </span>
        </a>

        <a
          href={`mailto:${email}`}
          className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md focus-ring"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <Mail className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold">Email</span>
            <span className="mt-1 block text-sm text-muted-foreground">{email}</span>
          </span>
        </a>

        <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Phone</p>
            <p className="mt-1 text-sm text-muted-foreground">{phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Location</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nationwide delivery · {address}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-border bg-muted/30 p-6 sm:p-8"
      >
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Send a WhatsApp message
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill this in and we&apos;ll open WhatsApp with your message ready.
        </p>

        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block font-medium">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-foreground focus-ring"
            placeholder="Your name"
          />
        </label>

        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block font-medium">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full resize-y rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-foreground focus-ring"
            placeholder="I'm looking for a Nike Dunk in size 42..."
          />
        </label>

        <Button type="submit" variant="whatsapp" size="lg" fullWidth className="mt-6">
          <MessageCircle className="h-5 w-5" aria-hidden />
          Open WhatsApp
        </Button>
      </form>
    </div>
  );
}
