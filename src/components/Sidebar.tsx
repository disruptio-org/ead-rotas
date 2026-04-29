"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Code2, History, Settings } from "lucide-react";

const navItems = [
  { href: "/",        icon: Home,    label: "Dashboard" },
  { href: "/agents",  icon: Bot,     label: "Agents" },
  { href: "/skills",  icon: Code2,   label: "Skills Studio" },
  { href: "/history", icon: History, label: "Execution Log" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex h-screen w-60 shrink-0 flex-col bg-zinc-950 border-r border-zinc-800/60 z-20">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-zinc-800/60 gap-3">
        <div className="bg-emerald-500/10 p-2 rounded-lg shadow-inner shadow-emerald-500/10">
          <Bot className="h-5 w-5 text-emerald-400" />
        </div>
        <span className="text-base font-bold tracking-tight bg-gradient-to-r from-emerald-300 to-zinc-400 bg-clip-text text-transparent">
          AGENTS OS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-800/60 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300 transition-all"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
