"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Business",
    items: [
      { href: "/admin/pricing", label: "Pricing" },
      { href: "/admin/clients", label: "Clients & brands" },
      { href: "/admin/team", label: "Team" },
    ],
  },
  {
    label: "Workflow",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/messages", label: "Messages" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/contact", label: "Contact info" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname() ?? "";

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="w-56 shrink-0 space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-parchment/35">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive(item.href)
                      ? "bg-gold-400/10 font-medium text-gold-200"
                      : "text-parchment/65 hover:bg-white/5 hover:text-parchment"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
