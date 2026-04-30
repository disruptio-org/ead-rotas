
// History.jsx — Execution Log master-detail

function IcBot({s=14}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>; }
function IcCode2({s=13}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>; }
function IcClock({s=28}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IcCheckCircle({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function IcXCircle({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }
function IcLoader({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>; }
function IcRepeat({s=14}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>; }

const ALL_EXECS = [
  { id:1, status:'completed', ts:'2026-04-29 14:32', agent:'DSC Planner', skill:'Planeamento DSC', summary:'Planeamento semanal gerado com 23 rotas e 4 alertas de capacidade. Documentos exportados com sucesso.', duration:'12s' },
  { id:2, status:'completed', ts:'2026-04-29 11:15', agent:'DSC Planner', skill:'Planeamento DSC', summary:'Análise de dados concluída. Ficheiro Excel processado. Documento Word criado.', duration:'9s' },
  { id:3, status:'failed',    ts:'2026-04-29 09:48', agent:'Analista de Dados', skill:'Extrator Excel', summary:'Erro ao processar ficheiro: coluna "Matrícula" não encontrada no intervalo A1:Z50.', duration:'3s' },
  { id:4, status:'completed', ts:'2026-04-28 17:05', agent:'Relatório Mensal', skill:'Relatório Mensal', summary:'Relatório de Março 2026 gerado. 14 páginas, 6 tabelas, 3 gráficos exportados.', duration:'21s' },
  { id:5, status:'completed', ts:'2026-04-28 14:30', agent:'DSC Planner', skill:'Planeamento DSC', summary:'Planeamento de quinta-feira processado. 19 rotas confirmadas, 2 excluídas por capacidade.', duration:'11s' },
  { id:6, status:'running',   ts:'2026-04-28 10:00', agent:'Analista de Dados', skill:'Análise Documental', summary:'A processar 47 documentos de contrato para extração de cláusulas...', duration:'—' },
  { id:7, status:'completed', ts:'2026-04-27 16:45', agent:'Relatório Mensal', skill:'Relatório Mensal', summary:'Relatório semanal de KPIs concluído. Distribuído por email automaticamente.', duration:'18s' },
];

function StatusIcon({ status, size=15 }) {
  if (status === 'completed') return <span style={{color:'#2E7D52'}}><IcCheckCircle s={size}/></span>;
  if (status === 'failed')    return <span style={{color:'#DC2626'}}><IcXCircle s={size}/></span>;
  return <span style={{color:'#1E4DB7'}}><IcLoader s={size}/></span>;
}

function StatusBadge({ status }) {
  const map = {
    completed: { bg:'rgba(46,125,82,0.08)', color:'#2E7D52', label:'Concluído' },
    failed:    { bg:'rgba(220,38,38,0.08)', color:'#DC2626', label:'Erro' },
    running:   { bg:'rgba(30,77,183,0.08)', color:'#1E4DB7', label:'A correr' },
  };
  const s = map[status];
  return <span style={{ background:s.bg, color:s.color, borderRadius:'20px', padding:'3px 9px', fontSize:'11px', fontWeight:'600' }}>{s.label}</span>;
}

function HistoryPage({ setPage }) {
  const [selected, setSelected] = React.useState(ALL_EXECS[0]);

  return (
    <div style={hs.root}>
      {/* Left panel */}
      <div style={hs.listPanel}>
        <div style={hs.listHeader}>
          <div style={hs.listTitle}>Execution Log</div>
          <div style={hs.listCount}>{ALL_EXECS.length} execuções</div>
        </div>
        <div style={hs.listScroll}>
          {ALL_EXECS.map(ex => (
            <div
              key={ex.id}
              onClick={() => setSelected(ex)}
              style={{ ...hs.execItem, ...(selected?.id === ex.id ? hs.execItemActive : {}) }}
            >
              <div style={hs.execItemTop}>
                <StatusIcon status={ex.status} size={14} />
                <StatusBadge status={ex.status} />
                <span style={hs.execTs}>{ex.ts.split(' ')[1]}</span>
              </div>
              <div style={hs.execMeta}>
                <span style={hs.execAgent}><IcBot s={11}/> {ex.agent}</span>
                <span style={hs.execSkill}><IcCode2 s={11}/> {ex.skill}</span>
              </div>
              <p style={hs.execSummary}>{ex.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={hs.detailPanel}>
        {!selected ? (
          <div style={hs.emptyDetail}>
            <div style={hs.emptyIcon}><IcClock s={28}/></div>
            <div style={hs.emptyTitle}>Selecione uma execução</div>
            <div style={hs.emptyDesc}>Clique numa execução à esquerda para ver os detalhes.</div>
          </div>
        ) : (
          <div style={hs.detailContent}>
            {/* Detail header */}
            <div style={hs.detailHeader}>
              <div style={hs.detailTop}>
                <StatusIcon status={selected.status} size={18} />
                <div style={hs.detailTitleBlock}>
                  <div style={hs.detailTitle}>
                    {selected.status === 'completed' ? 'Execução concluída' : selected.status === 'failed' ? 'Execução falhada' : 'A executar...'}
                  </div>
                  <div style={hs.detailId}>ID #{selected.id.toString().padStart(4,'0')}</div>
                </div>
                <button onClick={() => setPage('agent-workspace')} style={hs.repeatBtn}>
                  <IcRepeat s={13}/> Repetir
                </button>
              </div>

              <div style={hs.detailMeta}>
                <div style={hs.metaChip}>
                  <IcBot s={12}/> <span>{selected.agent}</span>
                </div>
                <div style={hs.metaChip}>
                  <IcCode2 s={12}/> <span>{selected.skill}</span>
                </div>
                <div style={hs.metaChipMuted}>{selected.ts}</div>
                <div style={hs.metaChipMuted}>Duração: {selected.duration}</div>
              </div>
            </div>

            {/* Result detail */}
            <div style={hs.detailBody}>
              {selected.status === 'failed' ? (
                <div style={hs.errorBlock}>
                  <div style={hs.errorTitle}>Detalhe do erro</div>
                  <pre style={hs.errorPre}>{selected.summary}</pre>
                </div>
              ) : selected.status === 'running' ? (
                <div style={hs.runningBlock}>
                  <div style={{color:'#1E4DB7', marginBottom:'10px'}}><IcLoader s={24}/></div>
                  <div style={{fontSize:'14px', color:'#4A4744'}}>{selected.summary}</div>
                </div>
              ) : (
                <>
                  <div style={hs.summaryBlock}>
                    <div style={hs.blockLabel}>Sumário</div>
                    <p style={hs.summaryText}>{selected.summary}</p>
                  </div>

                  <div style={hs.statsRow}>
                    {[['Total','27'],['Incluídos','23'],['Excluídos','4']].map(([l,v]) => (
                      <div key={l} style={hs.statBox}>
                        <div style={hs.statVal}>{v}</div>
                        <div style={hs.statLbl}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div style={hs.filesSection}>
                    <div style={hs.blockLabel}>Ficheiros gerados</div>
                    {['Planeamento_DSC.docx','Sumario.xlsx'].map(f => (
                      <div key={f} style={hs.fileRow}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1E4DB7" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                        <span style={hs.fileName}>{f}</span>
                        <button style={hs.dlBtn}>Descarregar</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const hs = {
  root: { display:'flex', height:'100vh', background:'#F4F2EE', overflow:'hidden' },
  listPanel: { width:'320px', minWidth:'320px', background:'#fff', borderRight:'1px solid #E8E4DF', display:'flex', flexDirection:'column', flexShrink:0 },
  listHeader: { padding:'20px 18px 14px', borderBottom:'1px solid #F4F2EE', flexShrink:0 },
  listTitle: { fontSize:'15px', fontWeight:'800', color:'#1A1714', letterSpacing:'-0.01em' },
  listCount: { fontSize:'12px', color:'#9A9490', marginTop:'2px' },
  listScroll: { flex:1, overflowY:'auto' },
  execItem: { padding:'14px 18px', borderBottom:'1px solid #F9F8F5', cursor:'pointer', transition:'background 0.1s' },
  execItemActive: { background:'rgba(212,70,14,0.04)', borderLeft:'3px solid #D4460E' },
  execItemTop: { display:'flex', alignItems:'center', gap:'7px', marginBottom:'6px' },
  execTs: { marginLeft:'auto', fontSize:'11px', color:'#9A9490' },
  execMeta: { display:'flex', gap:'12px', marginBottom:'5px' },
  execAgent: { display:'flex', alignItems:'center', gap:'4px', fontSize:'11.5px', color:'#D4460E', fontWeight:'500' },
  execSkill: { display:'flex', alignItems:'center', gap:'4px', fontSize:'11.5px', color:'#1E4DB7', fontWeight:'500' },
  execSummary: { fontSize:'12px', color:'#7A7470', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  detailPanel: { flex:1, overflowY:'auto' },
  emptyDetail: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'10px', color:'#9A9490' },
  emptyIcon: { width:'56px', height:'56px', borderRadius:'50%', background:'#F4F2EE', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'4px' },
  emptyTitle: { fontSize:'15px', fontWeight:'700', color:'#4A4744' },
  emptyDesc: { fontSize:'13px', color:'#9A9490' },
  detailContent: { padding:'28px', maxWidth:'680px', margin:'0 auto' },
  detailHeader: { background:'#fff', borderRadius:'14px', border:'1px solid #E8E4DF', padding:'20px 22px', marginBottom:'20px' },
  detailTop: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' },
  detailTitleBlock: { flex:1 },
  detailTitle: { fontSize:'15px', fontWeight:'700', color:'#1A1714' },
  detailId: { fontSize:'11px', color:'#9A9490', fontFamily:'monospace', marginTop:'2px' },
  repeatBtn: { display:'flex', alignItems:'center', gap:'6px', background:'#F4F2EE', border:'1px solid #E8E4DF', borderRadius:'8px', padding:'7px 14px', fontSize:'12.5px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
  detailMeta: { display:'flex', flexWrap:'wrap', gap:'8px' },
  metaChip: { display:'flex', alignItems:'center', gap:'5px', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'6px', padding:'4px 10px', fontSize:'12px', color:'#4A4744', fontWeight:'500' },
  metaChipMuted: { display:'flex', alignItems:'center', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'6px', padding:'4px 10px', fontSize:'12px', color:'#9A9490' },
  detailBody: {},
  summaryBlock: { background:'#fff', borderRadius:'12px', border:'1px solid #E8E4DF', padding:'16px 18px', marginBottom:'16px' },
  blockLabel: { fontSize:'11px', fontWeight:'600', color:'#9A9490', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'8px' },
  summaryText: { fontSize:'13.5px', color:'#4A4744', lineHeight:1.6 },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'16px' },
  statBox: { background:'#fff', border:'1px solid #E8E4DF', borderRadius:'10px', padding:'14px', textAlign:'center' },
  statVal: { fontSize:'22px', fontWeight:'800', color:'#1A1714', letterSpacing:'-0.02em' },
  statLbl: { fontSize:'11px', color:'#9A9490', marginTop:'2px' },
  filesSection: { background:'#fff', borderRadius:'12px', border:'1px solid #E8E4DF', padding:'16px 18px', marginBottom:'16px' },
  fileRow: { display:'flex', alignItems:'center', gap:'8px', padding:'9px 12px', background:'#F0F4FF', borderRadius:'8px', marginBottom:'6px' },
  fileName: { flex:1, fontSize:'13px', color:'#1E4DB7', fontWeight:'500' },
  dlBtn: { background:'none', border:'1px solid #1E4DB7', color:'#1E4DB7', borderRadius:'6px', padding:'3px 10px', fontSize:'11px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' },
  errorBlock: { background:'#fff', borderRadius:'12px', border:'1px solid rgba(220,38,38,0.2)', padding:'16px 18px' },
  errorTitle: { fontSize:'11px', fontWeight:'600', color:'#DC2626', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'8px' },
  errorPre: { background:'rgba(220,38,38,0.04)', borderRadius:'8px', padding:'12px', fontSize:'12px', fontFamily:'monospace', color:'#B91C1C', whiteSpace:'pre-wrap' },
  runningBlock: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'200px', background:'#fff', borderRadius:'12px', border:'1px solid #E8E4DF', padding:'24px' },
};

Object.assign(window, { HistoryPage });
