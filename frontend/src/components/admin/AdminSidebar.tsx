"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ImageIcon,
  Settings,
  MessageCircle,
  PanelLeft,
  LogOut,
  Home,
  HelpCircle,
  Star,
  Inbox,
  ShoppingBag,
  AlertTriangle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { apiSend } from "@/lib/api-client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/low-stock", label: "Low stock", icon: AlertTriangle },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Reviews", icon: Star },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await apiSend("/api/auth/logout", "POST");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          /* No transform on desktop — translateX blurs text in Chrome */
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card text-foreground antialiased lg:static",
          "max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
          open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        )}
      >
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href="/admin"
                className="font-display text-xl font-bold tracking-tight text-foreground"
              >
                Flex it! Admin
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">Inventory CMS</p>
            </div>
            <ThemeToggle className="shrink-0" />
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "admin-nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "admin-nav-link--active bg-muted font-semibold text-foreground"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <link.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-foreground" : "text-current"
                  )}
                  strokeWidth={1.75}
                />
                <span className="truncate text-inherit">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            View storefront
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
