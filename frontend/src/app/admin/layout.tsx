"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-muted/40 text-foreground lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 pt-16 lg:px-8 lg:py-8 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
