
// Agents.jsx — Agents list + New Agent form + Agent Workspace

// ── Shared micro-icons ──────────────────────────────────────────────────────
function IcPlus({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IcArrowLeft({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="m12 5-7 7 7 7"/></svg>; }
function IcArrowRight({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>; }
function IcBot({s=18}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>; }
function IcSend({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>; }
function IcPaperclip({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>; }
function IcSave({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }
function IcCheck({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function IcCode2({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>; }
function IcX({s=14}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IcChevronDown({s=14}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>; }
function IcFileDown({s=15}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>; }
function IcLoader({s=18}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>; }

// ── Agents List ──────────────────────────────────────────────────────────────
const MOCK_AGENTS = [
  { id: 1, name: 'DSC Planner', description: 'Agente especializado no planeamento de rotas DSC com análise de dados Excel e geração automática de documentos Word.', status: 'active', skill: 'Planeamento DSC' },
  { id: 2, name: 'Relatório Mensal', description: 'Gera relatórios mensais consolidados a partir de múltiplas fontes de dados e templates personalizados.', status: 'active', skill: 'Documental v2' },
  { id: 3, name: 'Analista de Dados', description: 'Processa e analisa datasets de grande volume, produzindo resumos executivos e insights automáticos.', status: 'active', skill: null },
];

function AgentsList({ setPage, setSelectedAgent }) {
  const [hovered, setHovered] = React.useState(null);
  return (
    <div style={ag.page}>
      <div style={ag.header}>
        <div>
          <h1 style={ag.h1}>Agentes</h1>
          <p style={ag.subtitle}>Configure e gira agentes inteligentes para os seus fluxos de trabalho.</p>
        </div>
        <button onClick={() => setPage('agents-new')} style={ag.btnNew}>
          <IcPlus s={15} /> Novo Agente
        </button>
      </div>

      <div style={ag.grid}>
        {MOCK_AGENTS.map(agent => (
          <div
            key={agent.id}
            style={{ ...ag.card, ...(hovered === agent.id ? ag.cardHover : {}) }}
            onMouseEnter={() => setHovered(agent.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ ...ag.cardTopBar, opacity: hovered === agent.id ? 1 : 0 }}></div>
            <div style={ag.cardHeader}>
              <div style={ag.agentIcon}><IcBot s={18} /></div>
              <span style={ag.statusBadge}>● Ativo</span>
            </div>
            <h3 style={ag.cardName}>{agent.name}</h3>
            <p style={ag.cardDesc}>{agent.description}</p>
            {agent.skill && (
              <div style={ag.skillPill}><IcCode2 s={11}/> {agent.skill}</div>
            )}
            <div style={ag.cardFooter}>
              <button
                onClick={() => { setSelectedAgent(agent); setPage('agent-workspace'); }}
                style={ag.manageLink}
              >
                Gerir Agente <span style={{ transition: 'transform 0.15s', display: 'inline-block', transform: hovered === agent.id ? 'translateX(3px)' : 'translateX(0)' }}><IcArrowRight s={13}/></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Create Agent ─────────────────────────────────────────────────────────────
function CreateAgent({ setPage }) {
  const [form, setForm] = React.useState({ name: '', desc: '', prompt: 'Você é um assistente especializado da Papiro. A sua função é processar dados fornecidos pelo utilizador e gerar documentos estruturados seguindo as instruções da skill associada.\n\nSempre responda em português europeu.\nSeja conciso, preciso e profissional.' });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => { setSaved(false); setPage('agents'); }, 1500); }, 1200);
  };

  return (
    <div style={ag.page}>
      <button onClick={() => setPage('agents')} style={ag.backLink}><IcArrowLeft s={15}/> Voltar a Agentes</button>
      <div style={ag.formCard}>
        <div style={ag.formHeader}>
          <div style={ag.agentIconLg}><IcBot s={24}/></div>
          <div>
            <h1 style={ag.h1}>Criar Novo Agente</h1>
            <p style={ag.subtitle}>Defina as instruções de sistema e associe skills ao seu agente.</p>
          </div>
        </div>

        <div style={ag.formBody}>
          <div style={ag.field}>
            <label style={ag.label}>Nome do Agente <span style={{color:'#D4460E'}}>*</span></label>
            <input style={ag.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="ex. DSC Planner" />
          </div>
          <div style={ag.field}>
            <label style={ag.label}>Descrição Curta <span style={{color:'#D4460E'}}>*</span></label>
            <input style={ag.input} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Breve descrição do propósito do agente" />
          </div>
          <div style={ag.field}>
            <label style={ag.label}>Instruções de Sistema Base <span style={{color:'#9A9490', fontWeight:400, fontSize:'12px'}}>(Prompt)</span></label>
            <textarea style={ag.textarea} rows={6} value={form.prompt} onChange={e => setForm({...form, prompt: e.target.value})} />
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'8px' }}>
            <button onClick={handleSave} disabled={saving || !form.name} style={ag.btnSave(saving || !form.name)}>
              {saving ? <><IcLoader s={15}/> A criar...</> : saved ? <><IcCheck s={15}/> Criado!</> : <><IcSave s={15}/> Criar Agente</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Agent Workspace ───────────────────────────────────────────────────────────
const MOCK_HISTORY = [
  { id: 1, ts: '14:32', status: 'completed', summary: 'Planeamento semanal gerado com 23 rotas DSC e 4 alertas de capacidade.' },
  { id: 2, ts: '11:15', status: 'completed', summary: 'Análise de dados concluída. Documento Word exportado com sucesso.' },
  { id: 3, ts: '09:48', status: 'failed', summary: 'Erro ao processar ficheiro Excel: coluna "Matrícula" não encontrada.' },
];

function AgentWorkspace({ agent, setPage }) {
  const ag_ = agent || MOCK_AGENTS[0];
  const [input, setInput] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [selectedExec, setSelectedExec] = React.useState(MOCK_HISTORY[0]);
  const [running, setRunning] = React.useState(false);
  const [showSkillPicker, setShowSkillPicker] = React.useState(false);
  const [activeSkill, setActiveSkill] = React.useState(ag_.skill || 'Planeamento DSC');
  const fileRef = React.useRef(null);

  const run = () => {
    if (!input.trim() && !file) return;
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setSelectedExec({ id: 99, ts: 'agora', status: 'completed', summary: 'Nova execução concluída com sucesso.', fresh: true });
      setInput('');
      setFile(null);
    }, 2200);
  };

  const skills = ['Planeamento DSC', 'Relatório Mensal', 'Análise de Dados', 'Documental v2'];

  return (
    <div style={ws.root}>
      {/* Header */}
      <div style={ws.header}>
        <div style={ws.headerLeft}>
          <button onClick={() => setPage('agents')} style={ws.backBtn}><IcArrowLeft s={16}/></button>
          <div style={ws.agentIcon}><IcBot s={16}/></div>
          <span style={ws.agentName}>{ag_.name}</span>
        </div>
        <div style={ws.headerRight}>
          {activeSkill && (
            <div style={ws.skillTag}>
              <IcCode2 s={12}/> {activeSkill}
              <button onClick={() => setActiveSkill(null)} style={ws.removeSkill}><IcX s={11}/></button>
            </div>
          )}
          <button onClick={() => setShowSkillPicker(!showSkillPicker)} style={ws.alterBtn}>
            {activeSkill ? 'alterar' : '+ skill'} <IcChevronDown s={12}/>
          </button>
          {showSkillPicker && (
            <div style={ws.skillDropdown}>
              <div style={ws.skillDropdownTitle}>Selecionar Skill</div>
              {skills.map(s => (
                <button key={s} onClick={() => { setActiveSkill(s); setShowSkillPicker(false); }} style={{ ...ws.skillOption, ...(activeSkill === s ? ws.skillOptionActive : {}) }}>
                  <IcCode2 s={13}/> {s}
                  {activeSkill === s && <IcCheck s={12}/>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={ws.body}>
        {/* History sidebar */}
        <div style={ws.historySidebar}>
          <div style={ws.historyTitle}>Histórico</div>
          {MOCK_HISTORY.map(ex => (
            <div
              key={ex.id}
              onClick={() => setSelectedExec(ex)}
              style={{ ...ws.historyItem, ...(selectedExec?.id === ex.id ? ws.historyItemActive : {}) }}
            >
              <div style={ws.historyItemTop}>
                <span style={ws.statusDot(ex.status)}></span>
                <span style={ws.historyBadge(ex.status)}>{ex.status === 'completed' ? 'Concluído' : 'Erro'}</span>
                <span style={ws.historyTs}>{ex.ts}</span>
              </div>
              <p style={ws.historySummary}>{ex.summary}</p>
            </div>
          ))}
        </div>

        {/* Results area */}
        <div style={ws.resultsArea}>
          {running ? (
            <div style={ws.loadingState}>
              <div style={{ color:'#D4460E', marginBottom:12 }}><IcLoader s={32}/></div>
              <div style={ws.loadingText}>A processar dados e consultar o modelo...</div>
            </div>
          ) : selectedExec ? (
            <ResultPanel exec={selectedExec} />
          ) : (
            <div style={ws.emptyState}>
              <div style={ws.emptyIcon}><IcBot s={28}/></div>
              <div style={ws.emptyTitle}>Pronto para executar</div>
              <div style={ws.emptyDesc}>Escreva a sua mensagem em baixo e carregue em Executar.</div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div style={ws.inputBar}>
        <div style={ws.inputWrap}>
          {file && (
            <div style={ws.filePill}>
              📎 {file.name}
              <button onClick={() => setFile(null)} style={ws.removeFile}><IcX s={10}/></button>
            </div>
          )}
          <div style={ws.inputRow}>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
            <button onClick={() => fileRef.current.click()} style={ws.clipBtn}><IcPaperclip s={16}/></button>
            <textarea
              style={ws.textarea}
              rows={2}
              placeholder="Escreva aqui a sua instrução ou pergunta..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') run(); }}
            />
            <button onClick={run} disabled={!input.trim() && !file} style={ws.runBtn(!input.trim() && !file)}>
              <IcSend s={15}/> Executar
            </button>
          </div>
          <div style={ws.shortcut}>⌘ + Enter para executar</div>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ exec }) {
  const [showRaw, setShowRaw] = React.useState(false);
  if (exec.status === 'failed') {
    return (
      <div style={rp.error}>
        <div style={rp.errorIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div style={rp.errorTitle}>Execução falhada</div>
        <pre style={rp.errorPre}>{exec.summary}</pre>
      </div>
    );
  }
  return (
    <div style={rp.root}>
      <div style={rp.topRow}>
        <div style={rp.successIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D52" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div style={rp.successTitle}>Execução concluída</div>
          <div style={rp.execId}>ID: exec_{exec.id}_papiro</div>
        </div>
        <div style={rp.time}>{exec.ts}</div>
      </div>

      <p style={rp.summary}>{exec.summary}</p>

      <div style={rp.statsGrid}>
        {[['Total', '27'], ['Incluídos', '23'], ['Excluídos', '4']].map(([l, v]) => (
          <div key={l} style={rp.statBox}>
            <div style={rp.statVal}>{v}</div>
            <div style={rp.statLbl}>{l}</div>
          </div>
        ))}
      </div>

      <div style={rp.section}>
        <div style={rp.sectionLabel}>Ficheiros gerados</div>
        {['Planeamento_DSC_2026-04.docx', 'Sumario_Executivo.xlsx'].map(f => (
          <div key={f} style={rp.fileRow}>
            <IcFileDown s={15}/> <span style={rp.fileName}>{f}</span>
            <button style={rp.downloadBtn}>Descarregar</button>
          </div>
        ))}
      </div>

      <div style={rp.section}>
        <div style={rp.sectionLabel}>Alertas</div>
        <div style={rp.alert}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>4 veículos com capacidade acima de 90% — rever distribuição de rotas.</span>
        </div>
      </div>

      <button onClick={() => setShowRaw(!showRaw)} style={rp.rawToggle}>{showRaw ? '▾' : '▸'} JSON raw</button>
      {showRaw && <pre style={rp.rawPre}>{JSON.stringify({ status:'completed', total:27, included:23, excluded:4, files:['Planeamento_DSC.docx'] }, null, 2)}</pre>}
    </div>
  );
}

const rp = {
  root: { padding:'24px', height:'100%', overflowY:'auto' },
  topRow: { display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'16px' },
  successIcon: { width:'32px', height:'32px', borderRadius:'50%', background:'rgba(46,125,82,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' },
  successTitle: { fontSize:'15px', fontWeight:'700', color:'#1A1714' },
  execId: { fontSize:'11px', color:'#9A9490', fontFamily:'monospace', marginTop:'2px' },
  time: { marginLeft:'auto', fontSize:'12px', color:'#9A9490' },
  summary: { fontSize:'13.5px', color:'#4A4744', lineHeight:1.6, marginBottom:'20px', padding:'12px 16px', background:'#F9F8F5', borderRadius:'8px' },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' },
  statBox: { background:'#fff', border:'1px solid #E8E4DF', borderRadius:'8px', padding:'14px', textAlign:'center' },
  statVal: { fontSize:'22px', fontWeight:'800', color:'#1A1714', letterSpacing:'-0.02em' },
  statLbl: { fontSize:'11px', color:'#9A9490', marginTop:'2px' },
  section: { marginBottom:'20px' },
  sectionLabel: { fontSize:'11px', fontWeight:'600', color:'#9A9490', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'10px' },
  fileRow: { display:'flex', alignItems:'center', gap:'8px', padding:'9px 12px', background:'#F0F4FF', borderRadius:'8px', marginBottom:'6px', color:'#1E4DB7', fontSize:'13px' },
  fileName: { flex:1, fontWeight:'500' },
  downloadBtn: { background:'none', border:'1px solid #1E4DB7', color:'#1E4DB7', borderRadius:'6px', padding:'3px 10px', fontSize:'11px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' },
  alert: { display:'flex', alignItems:'flex-start', gap:'8px', padding:'10px 14px', background:'rgba(180,83,9,0.07)', borderRadius:'8px', fontSize:'12.5px', color:'#7C4A0D', lineHeight:1.5 },
  rawToggle: { background:'none', border:'none', color:'#9A9490', fontSize:'12px', cursor:'pointer', padding:'4px 0', fontFamily:'monospace' },
  rawPre: { background:'#1A1714', color:'#A8D5B5', borderRadius:'8px', padding:'14px', fontSize:'11.5px', fontFamily:'monospace', lineHeight:1.6, overflowX:'auto', marginTop:'8px' },
  error: { padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' },
  errorIcon: { width:'48px', height:'48px', borderRadius:'50%', background:'rgba(220,38,38,0.08)', display:'flex', alignItems:'center', justifyContent:'center' },
  errorTitle: { fontSize:'15px', fontWeight:'700', color:'#DC2626' },
  errorPre: { background:'rgba(220,38,38,0.05)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'8px', padding:'12px 16px', fontSize:'12px', fontFamily:'monospace', color:'#B91C1C', maxWidth:'500px', whiteSpace:'pre-wrap' },
};

const ws = {
  root: { display:'flex', flexDirection:'column', height:'100vh', background:'#F4F2EE' },
  header: { height:'56px', background:'#fff', borderBottom:'1px solid #E8E4DF', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0, position:'relative' },
  headerLeft: { display:'flex', alignItems:'center', gap:'12px' },
  backBtn: { width:'32px', height:'32px', borderRadius:'8px', background:'#F4F2EE', border:'1px solid #E8E4DF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#4A4744' },
  agentIcon: { width:'30px', height:'30px', borderRadius:'8px', background:'rgba(212,70,14,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4460E' },
  agentName: { fontWeight:'700', fontSize:'14px', color:'#1A1714' },
  headerRight: { display:'flex', alignItems:'center', gap:'8px', position:'relative' },
  skillTag: { display:'flex', alignItems:'center', gap:'6px', background:'rgba(30,77,183,0.08)', color:'#1E4DB7', borderRadius:'20px', padding:'5px 10px', fontSize:'12px', fontWeight:'600' },
  removeSkill: { background:'none', border:'none', cursor:'pointer', color:'#1E4DB7', display:'flex', padding:0 },
  alterBtn: { display:'flex', alignItems:'center', gap:'4px', background:'#F4F2EE', border:'1px solid #E8E4DF', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', color:'#4A4744', cursor:'pointer', fontFamily:'inherit' },
  skillDropdown: { position:'absolute', top:'calc(100% + 8px)', right:0, width:'240px', background:'#fff', border:'1px solid #E8E4DF', borderRadius:'12px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:100, overflow:'hidden' },
  skillDropdownTitle: { padding:'10px 14px', fontSize:'11px', fontWeight:'600', color:'#9A9490', textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid #E8E4DF' },
  skillOption: { display:'flex', alignItems:'center', gap:'8px', width:'100%', padding:'10px 14px', background:'none', border:'none', cursor:'pointer', fontSize:'13px', color:'#1A1714', fontFamily:'inherit', textAlign:'left' },
  skillOptionActive: { background:'rgba(30,77,183,0.06)', color:'#1E4DB7' },
  body: { flex:1, display:'flex', overflow:'hidden' },
  historySidebar: { width:'260px', background:'#fff', borderRight:'1px solid #E8E4DF', overflowY:'auto', flexShrink:0 },
  historyTitle: { padding:'16px 16px 10px', fontSize:'11px', fontWeight:'600', color:'#9A9490', textTransform:'uppercase', letterSpacing:'0.07em', position:'sticky', top:0, background:'#fff', borderBottom:'1px solid #E8E4DF' },
  historyItem: { padding:'12px 16px', borderBottom:'1px solid #F4F2EE', cursor:'pointer', transition:'background 0.12s' },
  historyItemActive: { background:'rgba(212,70,14,0.04)', borderLeft:'3px solid #D4460E' },
  historyItemTop: { display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px' },
  statusDot: (s) => ({ width:'7px', height:'7px', borderRadius:'50%', background: s==='completed'?'#2E7D52':'#DC2626', flexShrink:0 }),
  historyBadge: (s) => ({ fontSize:'11px', fontWeight:'600', color: s==='completed'?'#2E7D52':'#DC2626' }),
  historyTs: { marginLeft:'auto', fontSize:'11px', color:'#9A9490' },
  historySummary: { fontSize:'12px', color:'#7A7470', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  resultsArea: { flex:1, overflowY:'auto', background:'#F9F8F5' },
  loadingState: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%' },
  loadingText: { color:'#7A7470', fontSize:'14px' },
  emptyState: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'12px' },
  emptyIcon: { width:'56px', height:'56px', borderRadius:'50%', background:'rgba(212,70,14,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4460E' },
  emptyTitle: { fontSize:'16px', fontWeight:'700', color:'#1A1714' },
  emptyDesc: { fontSize:'13px', color:'#9A9490' },
  inputBar: { background:'#fff', borderTop:'1px solid #E8E4DF', padding:'14px 20px', flexShrink:0 },
  inputWrap: { maxWidth:'700px', margin:'0 auto' },
  filePill: { display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(212,70,14,0.08)', color:'#D4460E', borderRadius:'20px', padding:'4px 10px', fontSize:'12px', fontWeight:'500', marginBottom:'8px' },
  removeFile: { background:'none', border:'none', cursor:'pointer', color:'#D4460E', display:'flex', padding:0 },
  inputRow: { display:'flex', alignItems:'flex-end', gap:'10px', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'12px', padding:'10px 12px' },
  clipBtn: { background:'none', border:'none', cursor:'pointer', color:'#9A9490', padding:'4px', display:'flex', flexShrink:0 },
  textarea: { flex:1, background:'none', border:'none', outline:'none', fontSize:'13.5px', color:'#1A1714', resize:'none', fontFamily:"'Figtree', sans-serif", lineHeight:1.55 },
  runBtn: (disabled) => ({ background: disabled ? '#E8E4DF' : '#D4460E', color: disabled ? '#9A9490' : '#fff', border:'none', borderRadius:'8px', padding:'8px 16px', fontSize:'13px', fontWeight:'600', cursor: disabled ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'6px', flexShrink:0, fontFamily:'inherit', transition:'background 0.15s' }),
  shortcut: { textAlign:'right', fontSize:'11px', color:'#B4B0AC', marginTop:'6px' },
};

const ag = {
  page: { padding:'40px 48px', maxWidth:'900px', margin:'0 auto' },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'32px' },
  h1: { fontSize:'26px', fontWeight:'800', color:'#1A1714', letterSpacing:'-0.02em', marginBottom:'6px' },
  subtitle: { color:'#7A7470', fontSize:'14px' },
  btnNew: { display:'flex', alignItems:'center', gap:'7px', background:'#D4460E', color:'#fff', border:'none', borderRadius:'9px', padding:'9px 18px', fontSize:'13px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit', flexShrink:0 },
  grid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' },
  card: { background:'#fff', borderRadius:'14px', border:'1px solid #E8E4DF', padding:'22px', position:'relative', overflow:'hidden', transition:'all 0.15s', cursor:'default' },
  cardHover: { boxShadow:'0 6px 24px rgba(0,0,0,0.08)', transform:'translateY(-2px)' },
  cardTopBar: { position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, #D4460E, #F97040)', transition:'opacity 0.2s' },
  cardHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' },
  agentIcon: { width:'38px', height:'38px', borderRadius:'10px', background:'rgba(212,70,14,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4460E' },
  agentIconLg: { width:'52px', height:'52px', borderRadius:'14px', background:'rgba(212,70,14,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4460E', flexShrink:0 },
  statusBadge: { background:'rgba(46,125,82,0.08)', color:'#2E7D52', borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:'600' },
  cardName: { fontSize:'14.5px', fontWeight:'700', color:'#1A1714', marginBottom:'8px' },
  cardDesc: { fontSize:'12.5px', color:'#7A7470', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:'12px' },
  skillPill: { display:'inline-flex', alignItems:'center', gap:'5px', background:'rgba(30,77,183,0.07)', color:'#1E4DB7', borderRadius:'6px', padding:'3px 9px', fontSize:'11px', fontWeight:'600', marginBottom:'12px' },
  cardFooter: { borderTop:'1px solid #F4F2EE', paddingTop:'12px', marginTop:'4px' },
  manageLink: { background:'none', border:'none', color:'#D4460E', fontWeight:'600', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontFamily:'inherit', padding:0 },
  backLink: { display:'flex', alignItems:'center', gap:'6px', color:'#7A7470', background:'none', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', fontFamily:'inherit', padding:'0 0 24px', marginLeft:'-2px' },
  formCard: { background:'#fff', borderRadius:'16px', border:'1px solid #E8E4DF', overflow:'hidden', maxWidth:'640px' },
  formHeader: { display:'flex', alignItems:'center', gap:'16px', padding:'28px', borderBottom:'1px solid #F4F2EE' },
  formBody: { padding:'28px' },
  field: { marginBottom:'20px' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'#4A4744', marginBottom:'7px' },
  input: { width:'100%', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'10px 14px', fontSize:'13.5px', color:'#1A1714', fontFamily:"'Figtree',sans-serif", outline:'none', boxSizing:'border-box' },
  textarea: { width:'100%', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'10px 14px', fontSize:'13px', color:'#1A1714', fontFamily:'monospace', outline:'none', resize:'vertical', lineHeight:1.6, boxSizing:'border-box' },
  btnSave: (disabled) => ({ display:'flex', alignItems:'center', gap:'7px', background: disabled ? '#E8E4DF' : '#D4460E', color: disabled ? '#9A9490' : '#fff', border:'none', borderRadius:'9px', padding:'10px 20px', fontSize:'13px', fontWeight:'600', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily:'inherit' }),
};

Object.assign(window, { AgentsList, CreateAgent, AgentWorkspace, ResultPanel });
