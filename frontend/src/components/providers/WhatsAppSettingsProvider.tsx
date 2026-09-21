"use client";

import { createContext, useContext } from "react";
import { siteConfig } from "@/lib/config";

export type WhatsAppSettings = {
  number: string;
  defaultMessage: string;
};

const WhatsAppSettingsContext = createContext<WhatsAppSettings>({
  number: siteConfig.whatsapp.number,
  defaultMessage: siteConfig.whatsapp.defaultMessage,
});

export function WhatsAppSettingsProvider({
  number,
  defaultMessage,
  children,
}: WhatsAppSettings & { children: React.ReactNode }) {
  return (
    <WhatsAppSettingsContext.Provider
      value={{
        number: number || siteConfig.whatsapp.number,
        defaultMessage: defaultMessage || siteConfig.whatsapp.defaultMessage,
      }}
    >
      {children}
    </WhatsAppSettingsContext.Provider>
  );
}

export function useWhatsAppSettings() {
  return useContext(WhatsAppSettingsContext);
}
