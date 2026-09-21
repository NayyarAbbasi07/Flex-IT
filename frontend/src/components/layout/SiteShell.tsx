"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import {
  Footer,
  type FooterCollection,
  type FooterSettings,
} from "@/components/layout/Footer";
import { WhatsAppSettingsProvider } from "@/components/providers/WhatsAppSettingsProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface SiteShellProps {
  children: React.ReactNode;
  footerSettings: FooterSettings;
  footerCollections: FooterCollection[];
  whatsappNumber: string;
  whatsappDefaultMessage: string;
}

export function SiteShell({
  children,
  footerSettings,
  footerCollections,
  whatsappNumber,
  whatsappDefaultMessage,
}: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <WhatsAppSettingsProvider
      number={whatsappNumber}
      defaultMessage={whatsappDefaultMessage}
    >
      <CartProvider>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer settings={footerSettings} collections={footerCollections} />
        <CartDrawer />
      </CartProvider>
    </WhatsAppSettingsProvider>
  );
}
