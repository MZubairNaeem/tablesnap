"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Video,
  FileText,
  Users,
  QrCode,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Business } from "@/lib/supabase/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "The pass", icon: LayoutDashboard },
  { href: "/dashboard/testimonials", label: "Video", icon: Video },
  { href: "/dashboard/written", label: "Written", icon: FileText },
  { href: "/dashboard/customers", label: "People", icon: Users },
  { href: "/dashboard/questions", label: "Questions", icon: ListChecks },
  { href: "/dashboard/qr", label: "QR code", icon: QrCode },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ business }: { business: Business }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col self-start overflow-y-auto border-r bg-sidebar">
      <div className="flex flex-col gap-3 px-5 py-5">
        <span className="font-display text-lg font-semibold tracking-tight">Vouch</span>
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-7 items-center justify-center rounded-sm text-xs font-semibold text-primary-foreground"
            style={{ backgroundColor: business.brand_color }}
          >
            {business.name.charAt(0).toUpperCase()}
          </div>
          <span className="ticket-meta truncate text-ink">{business.name}</span>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 border-t border-sidebar-border px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex flex-1 items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        <ThemeToggle />
      </div>
    </aside>
  );
}
