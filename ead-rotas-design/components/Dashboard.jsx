
// Dashboard.jsx

function Dashboard({ setPage }) {
  const [hoveredCard, setHoveredCard] = React.useState(null);

  return (
    <div style={dashStyles.page}>
      {/* Header */}
      <div style={dashStyles.header}>
        <div>
          <h1 style={dashStyles.h1}>
            Bem-vindo ao <span style={dashStyles.accent}>Rotas</span>
          </h1>
          <p style={dashStyles.subtitle}>Gerencie agentes, skills e execuções da sua plataforma de automação inteligente.</p>
        </div>
        <div style={dashStyles.headerBadge}>
          <span style={dashStyles.badgeDot}></span>
          Sistema operacional
        </div>
      </div>

      {/* Action cards */}
      <div style={dashStyles.cardGrid}>
        {/* Agents card */}
        <div
          style={{ ...dashStyles.card, ...(hoveredCard === 'agents' ? dashStyles.cardHover : {}) }}
          onMouseEnter={() => setHoveredCard('agents')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{ ...dashStyles.cardAccentBar, background: 'linear-gradient(90deg, #D4460E, #F97040)', opacity: hoveredCard === 'agents' ? 1 : 0 }}></div>
          <div style={dashStyles.cardIcon('rgba(212,70,14,0.1)', '#D4460E')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4460E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
          </div>
          <h2 style={dashStyles.cardTitle}>Agentes Customizados</h2>
          <p style={dashStyles.cardDesc}>Configure agentes inteligentes com instruções de sistema personalizadas e associe skills específicas a cada fluxo de trabalho.</p>
          <div style={dashStyles.cardActions}>
            <button onClick={() => setPage('agents-new')} style={dashStyles.btnPrimary('#D4460E')}>Criar Agente</button>
            <button onClick={() => setPage('agents')} style={dashStyles.btnSecondary}>Ver Todos</button>
          </div>
        </div>

        {/* Skills card */}
        <div
          style={{ ...dashStyles.card, ...(hoveredCard === 'skills' ? dashStyles.cardHover : {}) }}
          onMouseEnter={() => setHoveredCard('skills')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{ ...dashStyles.cardAccentBar, background: 'linear-gradient(90deg, #1E4DB7, #3B82F6)', opacity: hoveredCard === 'skills' ? 1 : 0 }}></div>
          <div style={dashStyles.cardIcon('rgba(30,77,183,0.08)', '#1E4DB7')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E4DB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
          </div>
          <h2 style={dashStyles.cardTitle}>Skills Studio</h2>
          <p style={dashStyles.cardDesc}>Crie e gerencie skills reutilizáveis para automatizar documentos, análises e fluxos complexos com configurações avançadas de I/O.</p>
          <div style={dashStyles.cardActions}>
            <button onClick={() => setPage('skills-new')} style={dashStyles.btnPrimary('#1E4DB7')}>Nova Skill</button>
            <button onClick={() => setPage('skills')} style={dashStyles.btnSecondary}>Ver Biblioteca</button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={dashStyles.section}>
        <h2 style={dashStyles.sectionTitle}>Casos de Uso Rápidos</h2>
        <div
          style={{ ...dashStyles.quickCard, ...(hoveredCard === 'quick' ? dashStyles.quickCardHover : {}) }}
          onMouseEnter={() => setHoveredCard('quick')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => setPage('agent-workspace')}
        >
          <div style={dashStyles.quickIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4460E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={dashStyles.quickTitle}>Planeamento DSC</div>
            <div style={dashStyles.quickDesc}>Executar o fluxo completo de planeamento e geração de documentos DSC</div>
          </div>
          <div style={dashStyles.mvpBadge}>MVP</div>
          <div style={dashStyles.quickArrow}>
            Executar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={dashStyles.statsRow}>
        {[
          { label: 'Agentes ativos', value: '3', color: '#D4460E' },
          { label: 'Skills publicadas', value: '7', color: '#1E4DB7' },
          { label: 'Execuções hoje', value: '12', color: '#2E7D52' },
          { label: 'Taxa de sucesso', value: '94%', color: '#B45309' },
        ].map(stat => (
          <div key={stat.label} style={dashStyles.statCard}>
            <div style={{ ...dashStyles.statValue, color: stat.color }}>{stat.value}</div>
            <div style={dashStyles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const dashStyles = {
  page: { padding: '40px 48px', maxWidth: '960px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' },
  h1: { fontSize: '28px', fontWeight: '800', color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '6px' },
  accent: { color: '#D4460E' },
  subtitle: { color: '#7A7470', fontSize: '14.5px', lineHeight: 1.6, maxWidth: '480px' },
  headerBadge: { display: 'flex', alignItems: 'center', gap: '7px', background: '#fff', border: '1px solid #E8E4DF', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#4A4744', fontWeight: '500', whiteSpace: 'nowrap', marginTop: '4px' },
  badgeDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#2E7D52', display: 'inline-block' },
  cardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #E8E4DF', padding: '28px', position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' },
  cardHover: { boxShadow: '0 8px 32px rgba(0,0,0,0.09)', transform: 'translateY(-2px)' },
  cardAccentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: '3px', transition: 'opacity 0.2s' },
  cardIcon: (bg, color) => ({ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }),
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1A1714', marginBottom: '8px', letterSpacing: '-0.01em' },
  cardDesc: { fontSize: '13.5px', color: '#7A7470', lineHeight: 1.65, marginBottom: '20px' },
  cardActions: { display: 'flex', gap: '10px' },
  btnPrimary: (color) => ({ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }),
  btnSecondary: { background: '#F4F2EE', color: '#4A4744', border: '1px solid #E8E4DF', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '13px', fontWeight: '600', color: '#7A7470', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' },
  quickCard: { background: '#fff', border: '1px solid #E8E4DF', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.15s' },
  quickCardHover: { boxShadow: '0 4px 20px rgba(0,0,0,0.07)', borderColor: '#D4460E' },
  quickIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(212,70,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  quickTitle: { fontSize: '14px', fontWeight: '600', color: '#1A1714', marginBottom: '3px' },
  quickDesc: { fontSize: '12.5px', color: '#7A7470' },
  mvpBadge: { background: 'rgba(212,70,14,0.1)', color: '#D4460E', borderRadius: '6px', padding: '3px 8px', fontSize: '10.5px', fontWeight: '700', letterSpacing: '0.05em' },
  quickArrow: { display: 'flex', alignItems: 'center', color: '#D4460E', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  statCard: { background: '#fff', border: '1px solid #E8E4DF', borderRadius: '12px', padding: '18px 20px' },
  statValue: { fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#7A7470', fontWeight: '500' },
};

Object.assign(window, { Dashboard });
