"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Code2, History, Settings, ChevronsLeft, ChevronsRight } from "lucide-react";

const navItems = [
  { href: "/",        icon: Home,    label: "Dashboard" },
  { href: "/agents",  icon: Bot,     label: "Agentes" },
  { href: "/skills",  icon: Code2,   label: "Skills Studio" },
  { href: "/history", icon: History,  label: "Execuções" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const w = collapsed ? '64px' : '220px';

  return (
    <aside style={{
      width: w,
      minWidth: w,
      height: '100vh',
      background: '#16161E',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      transition: 'width 0.2s ease, min-width 0.2s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: collapsed ? '0 18px' : '0 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
          <rect width="32" height="32" rx="6" fill="#D4460E"/>
          <rect x="7" y="8" width="18" height="3" rx="1.5" fill="white"/>
          <rect x="7" y="14" width="13" height="3" rx="1.5" fill="white" opacity="0.7"/>
          <rect x="7" y="20" width="9" height="3" rx="1.5" fill="white" opacity="0.4"/>
        </svg>
        {!collapsed && (
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              Rotas
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: 500 }}>
              by Papiro
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? '20px 8px 0' : '20px 10px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {!collapsed && (
          <div style={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0 10px',
            marginBottom: '8px',
            whiteSpace: 'nowrap',
          }}>
            Menu
          </div>
        )}
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px' : '9px 12px',
                borderRadius: '8px',
                color: active ? '#F97040' : 'rgba(255,255,255,0.65)',
                background: active ? 'rgba(212, 70, 14, 0.15)' : 'transparent',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 500,
                transition: 'all 0.15s',
                position: 'relative',
                justifyContent: collapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ opacity: active ? 1 : 0.55, display: 'flex', flexShrink: 0 }}>
                <Icon size={17} />
              </span>
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && (
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#D4460E',
                  marginLeft: 'auto',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: collapsed ? '10px 8px' : '10px' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 8px 12px' }} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '10px',
            width: '100%',
            padding: collapsed ? '9px' : '9px 12px',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.45)',
            background: 'transparent',
            border: 'none',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ display: 'flex', flexShrink: 0 }}>
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </span>
          {!collapsed && <span>Recolher menu</span>}
        </button>

        <Link
          href="/settings"
          title={collapsed ? 'Definições' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: collapsed ? '9px' : '9px 12px',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.65)',
            background: 'transparent',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'all 0.15s',
            justifyContent: collapsed ? 'center' : 'flex-start',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ opacity: 0.55, display: 'flex', flexShrink: 0 }}><Settings size={17} /></span>
          {!collapsed && <span>Definições</span>}
        </Link>
        {!collapsed && (
          <div style={{
            color: 'rgba(255,255,255,0.18)',
            fontSize: '10px',
            textAlign: 'center',
            padding: '8px 0 4px',
            fontFamily: 'monospace',
          }}>
            v1.0.0
          </div>
        )}
      </div>
    </aside>
  );
}
