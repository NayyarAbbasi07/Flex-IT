"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import {
  Footer,
  type FooterCollection,
  type FooterSettings,
} from "@/components/layout/Footer";

interface SiteShellProps {
  children: React.ReactNode;
  footerSettings: FooterSettings;
  footerCollections: FooterCollection[];
}

export function SiteShell({
  children,
  footerSettings,
  footerCollections,
}: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer settings={footerSettings} collections={footerCollections} />
    </>
  );
}
