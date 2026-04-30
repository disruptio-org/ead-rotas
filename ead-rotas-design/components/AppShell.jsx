
// AppShell.jsx — Sidebar + layout wrapper

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { id: 'agents',    label: 'Agentes',   icon: 'Bot' },
  { id: 'skills',    label: 'Skills Studio', icon: 'Code2' },
  { id: 'history',   label: 'Execuções', icon: 'History' },
];

function IconHome({ size=18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function IconBot({ size=18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
}
function IconCode2({ size=18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
}
function IconHistory({ size=18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
}
function IconSettings({ size=18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
}

const ICONS = { Home: IconHome, Bot: IconBot, Code2: IconCode2, History: IconHistory, Settings: IconSettings };

function Sidebar({ page, setPage }) {
  const Icon = (name) => {
    const C = ICONS[name];
    return C ? <C size={17} /> : null;
  };

  return (
    <aside style={sidebarStyles.sidebar}>
      {/* Logo */}
      <div style={sidebarStyles.logoArea}>
        <div style={sidebarStyles.logoMark}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#D4460E"/>
            <rect x="7" y="8" width="18" height="3" rx="1.5" fill="white"/>
            <rect x="7" y="14" width="13" height="3" rx="1.5" fill="white" opacity="0.7"/>
            <rect x="7" y="20" width="9" height="3" rx="1.5" fill="white" opacity="0.4"/>
          </svg>
        </div>
        <div>
          <div style={sidebarStyles.logoText}>Rotas</div>
          <div style={sidebarStyles.logoPowered}>by Papiro</div>
        </div>
      </div>

      {/* Main nav */}
      <nav style={sidebarStyles.nav}>
        <div style={sidebarStyles.navLabel}>Menu</div>
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                ...sidebarStyles.navItem,
                ...(active ? sidebarStyles.navItemActive : {}),
              }}
            >
              <span style={{ opacity: active ? 1 : 0.55 }}>{Icon(item.icon)}</span>
              <span>{item.label}</span>
              {active && <span style={sidebarStyles.activeDot}></span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={sidebarStyles.bottom}>
        <div style={sidebarStyles.bottomDivider}></div>
        <button
          onClick={() => setPage('settings')}
          style={{
            ...sidebarStyles.navItem,
            ...(page === 'settings' ? sidebarStyles.navItemActive : {}),
          }}
        >
          <span style={{ opacity: 0.55 }}>{Icon('Settings')}</span>
          <span>Definições</span>
        </button>
        <div style={sidebarStyles.versionBadge}>v1.0.0</div>
      </div>
    </aside>
  );
}

const sidebarStyles = {
  sidebar: {
    width: '220px',
    minWidth: '220px',
    height: '100vh',
    background: '#16161E',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
  },
  logoArea: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 18px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logoMark: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px',
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
  },
  logoPowered: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '10px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  nav: {
    flex: 1,
    padding: '20px 10px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0 10px',
    marginBottom: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.65)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13.5px',
    fontWeight: '500',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s',
    position: 'relative',
  },
  navItemActive: {
    background: 'rgba(212, 70, 14, 0.15)',
    color: '#F97040',
  },
  activeDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#D4460E',
    marginLeft: 'auto',
  },
  bottom: {
    padding: '10px',
  },
  bottomDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    margin: '0 8px 12px',
  },
  versionBadge: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: '10px',
    textAlign: 'center',
    padding: '8px 0 4px',
    fontFamily: 'monospace',
  },
};

function AppShell({ page, setPage, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Figtree', sans-serif", background: '#F4F2EE' }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {children}
      </main>
    </div>
  );
}

Object.assign(window, { AppShell, ICONS });
