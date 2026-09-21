"use client";

import { MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { useWhatsAppSettings } from "@/components/providers/WhatsAppSettingsProvider";
import { Button } from "@/components/ui/Button";

interface WhatsAppChatButtonProps {
  label?: string;
  variant?: "outline" | "whatsapp" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

/** General WhatsApp chat CTA — uses CMS number + default message. */
export function WhatsAppChatButton({
  label = "Chat with us",
  variant = "outline",
  size = "lg",
  fullWidth,
  className,
}: WhatsAppChatButtonProps) {
  const { number, defaultMessage } = useWhatsAppSettings();
  const href = getGeneralWhatsAppUrl(defaultMessage, number);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || "w-full sm:w-auto focus-ring rounded-xl"}
    >
      <Button variant={variant} size={size} fullWidth={fullWidth} className="sm:w-auto">
        <MessageCircle className="h-4 w-4" aria-hidden />
        {label}
      </Button>
    </a>
  );
}
