
// Skills.jsx — Skills library + Skill editor + Create wizard

function IcSearch({s=15}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function IcUpload({s=15}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function IcCode2({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>; }
function IcArrowRight({s=13}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>; }
function IcArrowLeft({s=16}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5"/><path d="m12 5-7 7 7 7"/></svg>; }
function IcPlus({s=15}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IcSave({s=15}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }
function IcTrash({s=14}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IcCheck({s=13}) { return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>; }

const MOCK_SKILLS = [
  { id: 1, name: 'Planeamento DSC', slug: 'planeamento-dsc', version: 'v2.1.0', status: 'published', desc: 'Processa dados de rotas e colaboradores, valida capacidades e gera documentos Word formatados para planeamento semanal DSC.', agents: 2, imported: false },
  { id: 2, name: 'Relatório Mensal', slug: 'relatorio-mensal', version: 'v1.3.0', status: 'published', desc: 'Consolida dados mensais de múltiplas fontes e produz relatório executivo estruturado com gráficos e tabelas resumo.', agents: 1, imported: true },
  { id: 3, name: 'Análise Documental', slug: 'analise-documental', version: 'v0.9.2', status: 'validated', desc: 'Classifica e extrai informação estruturada de documentos não estruturados usando técnicas de NLP avançadas.', agents: 0, imported: false },
  { id: 4, name: 'Workflow Aprovação', slug: 'workflow-aprovacao', version: 'v1.0.0', status: 'draft', desc: 'Automatiza fluxos de aprovação multi-step com notificações, escalação e registo de auditoria completo.', agents: 0, imported: true },
  { id: 5, name: 'Extrator Excel', slug: 'extrator-excel', version: 'v3.0.1', status: 'published', desc: 'Lê e transforma ficheiros Excel/CSV com validação de esquema, limpeza de dados e exportação formatada.', agents: 1, imported: false },
  { id: 6, name: 'Sumário Executivo', slug: 'sumario-executivo', version: 'v1.1.0', status: 'deprecated', desc: 'Gera sumários executivos automáticos a partir de transcrições de reuniões e relatórios longos.', agents: 0, imported: false },
];

const STATUS_COLORS = {
  published:  { bg:'rgba(46,125,82,0.08)',  text:'#2E7D52',  label:'Published'   },
  validated:  { bg:'rgba(30,77,183,0.08)',  text:'#1E4DB7',  label:'Validated'   },
  draft:      { bg:'rgba(0,0,0,0.05)',      text:'#4A4744',  label:'Draft'       },
  deprecated: { bg:'rgba(180,83,9,0.08)',   text:'#B45309',  label:'Deprecated'  },
};

function SkillsList({ setPage, setSelectedSkill }) {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('todos');
  const [hovered, setHovered] = React.useState(null);

  const FILTER_OPTS = ['todos','draft','validated','published','deprecated'];

  const filtered = MOCK_SKILLS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.slug.includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={sk.page}>
      <div style={sk.header}>
        <div>
          <h1 style={sk.h1}>Skills Studio</h1>
          <p style={sk.subtitle}>Crie, importe e gira skills reutilizáveis para os seus agentes.</p>
        </div>
        <div style={sk.headerActions}>
          <button style={sk.btnSecondary}><IcUpload s={14}/> Importar ZIP</button>
          <button onClick={() => setPage('skills-new')} style={sk.btnPrimary}><IcPlus s={14}/> Nova Skill</button>
        </div>
      </div>

      {/* Filters */}
      <div style={sk.filtersRow}>
        <div style={sk.searchWrap}>
          <span style={sk.searchIcon}><IcSearch s={14}/></span>
          <input style={sk.searchInput} placeholder="Pesquisar skills..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={sk.filterPills}>
          {FILTER_OPTS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...sk.filterPill, ...(filter === f ? sk.filterPillActive : {}) }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={sk.grid}>
        {filtered.map(skill => {
          const sc = STATUS_COLORS[skill.status];
          return (
            <div key={skill.id}
              style={{ ...sk.card, ...(hovered === skill.id ? sk.cardHover : {}) }}
              onMouseEnter={() => setHovered(skill.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ ...sk.cardTopBar, opacity: hovered === skill.id ? 1 : 0 }}></div>
              <div style={sk.cardHead}>
                <div style={sk.skillIcon}><IcCode2 s={17}/></div>
                <span style={sk.versionBadge}>{skill.version}</span>
              </div>
              <h3 style={sk.cardName}>{skill.name}</h3>
              <div style={sk.slugRow}>
                <code style={sk.slug}>{skill.slug}</code>
              </div>
              <p style={sk.cardDesc}>{skill.desc}</p>
              <div style={sk.cardFooter}>
                <span style={{ ...sk.statusBadge, background: sc.bg, color: sc.text }}>{sc.label}</span>
                {skill.imported && <span style={sk.importedBadge}>Importado</span>}
                {skill.agents > 0 && <span style={sk.agentCount}>{skill.agents} agente{skill.agents > 1 ? 's':''}</span>}
                <button onClick={() => { setSelectedSkill(skill); setPage('skill-editor'); }} style={sk.editLink}>
                  Editar <span style={{ transition:'transform 0.15s', display:'inline-block', transform: hovered === skill.id ? 'translateX(3px)':'translateX(0)' }}><IcArrowRight s={12}/></span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Skill Editor ──────────────────────────────────────────────────────────────
const SKILL_TABS = ['overview','instructions','references','assets','scripts','i/o','versions'];

function SkillEditor({ skill, setPage }) {
  const sk_ = skill || MOCK_SKILLS[0];
  const [activeTab, setActiveTab] = React.useState('overview');
  const [saved, setSaved] = React.useState(false);
  const [name, setName] = React.useState(sk_.name);
  const sc = STATUS_COLORS[sk_.status];

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={se.root}>
      {/* Header */}
      <div style={se.header}>
        <div style={se.headerLeft}>
          <button onClick={() => setPage('skills')} style={se.backBtn}><IcArrowLeft s={15}/></button>
          <div style={se.skillIconSm}><IcCode2 s={16}/></div>
          <div>
            <div style={se.headerName}>{sk_.name}</div>
            <div style={se.headerMeta}>
              <code style={se.slugSmall}>{sk_.slug}</code>
              <span style={se.vTag}>{sk_.version}</span>
              <span style={{ ...se.statusSmall, background: sc.bg, color: sc.text }}>{sc.label}</span>
              {sk_.imported && <span style={se.importedSm}>Importado</span>}
            </div>
          </div>
        </div>
        <div style={se.headerActions}>
          <button style={se.btnDelete}><IcTrash s={13}/> Eliminar</button>
          <button onClick={save} style={se.btnSave}>
            {saved ? <><IcCheck s={14}/> Guardado!</> : <><IcSave s={14}/> Guardar</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={se.tabBar}>
        {SKILL_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ ...se.tab, ...(activeTab === t ? se.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1).replace('/',' / ')}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={se.content}>
        {activeTab === 'overview' && (
          <div style={se.tabContent}>
            <div style={se.twoCol}>
              <div style={se.colMain}>
                <div style={se.field}>
                  <label style={se.label}>Nome da Skill</label>
                  <input style={se.input} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={se.field}>
                  <label style={se.label}>Descrição (trigger)</label>
                  <textarea style={se.textarea} rows={4} defaultValue={sk_.desc} />
                </div>
                <div style={se.field}>
                  <label style={se.label}>Agentes associados</label>
                  <div style={se.agentsList}>
                    {['DSC Planner', 'Relatório Mensal'].slice(0, sk_.agents || 1).map(a => (
                      <div key={a} style={se.agentRow}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4460E" strokeWidth="2" strokeLinecap="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                        <span style={{fontSize:'13px',color:'#4A4744'}}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={se.colSide}>
                <div style={se.validationPanel}>
                  <div style={se.vpTitle}>Validação</div>
                  <div style={se.vpStatus}>
                    <span style={se.vpDot(sk_.status === 'published')}></span>
                    <span style={{fontSize:'13px',color:'#4A4744'}}>
                      {sk_.status === 'published' ? 'Skill validada e publicada' : 'Aguarda validação'}
                    </span>
                  </div>
                  <button style={se.vpBtn}>Executar validação</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'instructions' && (
          <div style={se.tabContent}>
            <label style={se.label}>SKILL.md — Instruções</label>
            <textarea style={se.mdEditor} rows={18} defaultValue={`# ${sk_.name}\n\n## Objetivo\nDescreva o objetivo principal desta skill...\n\n## Inputs\n- **ficheiro**: Ficheiro Excel com dados de rotas\n- **periodo**: Período de análise (ex: 2026-04)\n\n## Processo\n1. Validar estrutura do ficheiro\n2. Extrair e normalizar dados\n3. Aplicar regras de negócio\n4. Gerar documento de saída\n\n## Outputs\n- Documento Word formatado\n- Sumário executivo\n`} />
          </div>
        )}
        {activeTab === 'references' && (
          <div style={se.tabContent}>
            <div style={se.fileManager}>
              <div style={se.fmHeader}>
                <span style={se.label}>Documentos de Referência</span>
                <button style={se.fmUploadBtn}><IcUpload s={13}/> Adicionar ficheiro</button>
              </div>
              {['manual_dsc_2026.pdf','template_base.docx'].map(f => (
                <div key={f} style={se.fmRow}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9490" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span style={{fontSize:'13px',color:'#4A4744',flex:1}}>{f}</span>
                  <button style={se.fmDeleteBtn}><IcTrash s={13}/></button>
                </div>
              ))}
            </div>
          </div>
        )}
        {(activeTab === 'assets' || activeTab === 'scripts') && (
          <div style={se.tabContent}>
            <div style={se.emptyTab}>
              <IcCode2 s={24}/>
              <div style={{fontSize:'14px',fontWeight:'600',color:'#4A4744',marginTop:'12px'}}>
                {activeTab === 'assets' ? 'Nenhum asset configurado' : 'Nenhum script disponível'}
              </div>
              <div style={{fontSize:'12.5px',color:'#9A9490',marginTop:'4px'}}>
                {activeTab === 'assets' ? 'Adicione templates DOCX ou outros assets.' : 'Os scripts são definidos na importação da skill.'}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'i/o' && (
          <div style={se.tabContent}>
            <div style={se.twoCol}>
              <div>
                <label style={se.label}>Input Schema (JSON)</label>
                <textarea style={se.jsonEditor} rows={10} defaultValue={JSON.stringify({type:'object',properties:{ficheiro:{type:'string',description:'Path to Excel file'},periodo:{type:'string',format:'date'}}},null,2)} />
              </div>
              <div>
                <label style={se.label}>Output Schema (JSON)</label>
                <textarea style={se.jsonEditor} rows={10} defaultValue={JSON.stringify({type:'object',properties:{status:{type:'string'},files:{type:'array',items:{type:'string'}},summary:{type:'string'}}},null,2)} />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'versions' && (
          <div style={se.tabContent}>
            <div style={se.timeline}>
              {['v2.1.0','v2.0.0','v1.3.0','v1.0.0'].map((v,i) => (
                <div key={v} style={se.timelineItem}>
                  <div style={se.timelineDot(i===0)}></div>
                  <div style={se.timelineContent}>
                    <div style={se.timelineVersion}>{v}</div>
                    <div style={se.timelineDate}>{['2026-04-15','2026-03-01','2026-01-20','2025-11-10'][i]}</div>
                    <div style={se.timelineExecs}>{[47,23,12,5][i]} execuções</div>
                    {i === 0 && <span style={se.currentBadge}>Atual</span>}
                  </div>
                  {i === 0 && <button style={se.publishBtn}>Publicar</button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Create Skill wizard ───────────────────────────────────────────────────────
const TEMPLATES = [
  { id:'vazia',      label:'Vazia',      desc:'Começa do zero' },
  { id:'documental', label:'Documental', desc:'Gera documentos Word/PDF' },
  { id:'analitica',  label:'Analítica',  desc:'Processa e analisa dados' },
  { id:'workflow',   label:'Workflow',   desc:'Automatiza fluxos multi-step' },
];

function CreateSkill({ setPage }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ name:'', desc:'' });
  const [template, setTemplate] = React.useState(null);
  const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g,'');

  return (
    <div style={sk.page}>
      <button onClick={() => step > 1 ? setStep(step-1) : setPage('skills')} style={sk.backLink}>
        <IcArrowLeft s={15}/> {step > 1 ? 'Anterior' : 'Voltar a Skills'}
      </button>

      {/* Progress */}
      <div style={sk.wizardCard}>
        <div style={sk.stepBar}>
          {[1,2].map(s => (
            <React.Fragment key={s}>
              <div style={sk.stepItem(step >= s)}>
                <div style={sk.stepCircle(step >= s)}>{step > s ? <IcCheck s={12}/> : s}</div>
                <span style={sk.stepLabel(step >= s)}>{s===1?'Identidade':'Template'}</span>
              </div>
              {s < 2 && <div style={sk.stepLine(step > s)}></div>}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div style={sk.wizardBody}>
            <h2 style={sk.wizardTitle}>Identidade da Skill</h2>
            <div style={sk.field}>
              <label style={sk.fieldLabel}>Nome da Skill <span style={{color:'#D4460E'}}>*</span></label>
              <input style={sk.input} value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="ex. Análise de Contratos" />
              {form.name && <div style={sk.slugPreview}>Slug: <code>{slug}</code></div>}
            </div>
            <div style={sk.field}>
              <label style={sk.fieldLabel}>Descrição (trigger)</label>
              <textarea style={sk.inputTA} rows={3} value={form.desc} onChange={e => setForm({...form, desc:e.target.value})} placeholder="Descreva quando e como esta skill deve ser usada..." />
            </div>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <button onClick={() => setStep(2)} disabled={!form.name} style={sk.btnNext(!form.name)}>
                Seguinte <IcArrowRight s={14}/>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={sk.wizardBody}>
            <h2 style={sk.wizardTitle}>Escolher Template</h2>
            <div style={sk.templateGrid}>
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => setTemplate(t.id)}
                  style={{ ...sk.templateCard, ...(template === t.id ? sk.templateCardActive : {}) }}>
                  <div style={sk.templateLabel}>{t.label}</div>
                  <div style={sk.templateDesc}>{t.desc}</div>
                  {template === t.id && <div style={sk.templateCheck}><IcCheck s={12}/></div>}
                </div>
              ))}
            </div>
            <div style={sk.summaryCard}>
              <div style={sk.summaryRow}><span style={sk.summaryKey}>Nome</span><span style={sk.summaryVal}>{form.name}</span></div>
              <div style={sk.summaryRow}><span style={sk.summaryKey}>Slug</span><code style={sk.summarySlug}>{slug}</code></div>
              {template && <div style={sk.summaryRow}><span style={sk.summaryKey}>Template</span><span style={sk.summaryVal}>{TEMPLATES.find(t=>t.id===template)?.label}</span></div>}
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'10px'}}>
              <button onClick={() => setStep(1)} style={sk.btnBack}>← Anterior</button>
              <button onClick={() => setPage('skills')} disabled={!template} style={sk.btnNext(!template)}>
                <IcSave s={14}/> Criar Skill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// shared skill styles
const sk = {
  page: { padding:'40px 48px', maxWidth:'960px', margin:'0 auto' },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px' },
  h1: { fontSize:'26px', fontWeight:'800', color:'#1A1714', letterSpacing:'-0.02em', marginBottom:'6px' },
  subtitle: { color:'#7A7470', fontSize:'14px' },
  headerActions: { display:'flex', gap:'10px' },
  btnSecondary: { display:'flex', alignItems:'center', gap:'6px', background:'#fff', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'9px 16px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
  btnPrimary: { display:'flex', alignItems:'center', gap:'6px', background:'#1E4DB7', color:'#fff', border:'none', borderRadius:'9px', padding:'9px 16px', fontSize:'13px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' },
  filtersRow: { display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' },
  searchWrap: { position:'relative', flex:'0 0 240px' },
  searchIcon: { position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'#9A9490', display:'flex' },
  searchInput: { width:'100%', paddingLeft:'34px', padding:'9px 14px 9px 34px', background:'#fff', border:'1px solid #E8E4DF', borderRadius:'9px', fontSize:'13px', color:'#1A1714', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  filterPills: { display:'flex', gap:'6px' },
  filterPill: { padding:'6px 14px', borderRadius:'20px', border:'1px solid #E8E4DF', background:'#fff', fontSize:'12px', fontWeight:'500', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
  filterPillActive: { background:'#1E4DB7', borderColor:'#1E4DB7', color:'#fff' },
  grid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' },
  card: { background:'#fff', borderRadius:'14px', border:'1px solid #E8E4DF', padding:'22px', position:'relative', overflow:'hidden', transition:'all 0.15s' },
  cardHover: { boxShadow:'0 6px 24px rgba(0,0,0,0.08)', transform:'translateY(-2px)' },
  cardTopBar: { position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, #1E4DB7, #3B82F6)', transition:'opacity 0.2s' },
  cardHead: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' },
  skillIcon: { width:'38px', height:'38px', borderRadius:'10px', background:'rgba(30,77,183,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#1E4DB7' },
  versionBadge: { background:'#F4F2EE', color:'#6B6764', borderRadius:'6px', padding:'3px 8px', fontSize:'11px', fontFamily:'monospace', fontWeight:'600' },
  cardName: { fontSize:'14.5px', fontWeight:'700', color:'#1A1714', marginBottom:'4px' },
  slugRow: { marginBottom:'10px' },
  slug: { fontSize:'11.5px', color:'#9A9490', fontFamily:'monospace', background:'#F9F8F5', padding:'2px 6px', borderRadius:'4px' },
  cardDesc: { fontSize:'12.5px', color:'#7A7470', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:'14px' },
  cardFooter: { borderTop:'1px solid #F4F2EE', paddingTop:'12px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' },
  statusBadge: { borderRadius:'20px', padding:'3px 9px', fontSize:'11px', fontWeight:'600' },
  importedBadge: { background:'rgba(180,83,9,0.08)', color:'#B45309', borderRadius:'6px', padding:'3px 8px', fontSize:'11px', fontWeight:'500' },
  agentCount: { fontSize:'12px', color:'#9A9490' },
  editLink: { marginLeft:'auto', background:'none', border:'none', color:'#1E4DB7', fontWeight:'600', fontSize:'12.5px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontFamily:'inherit', padding:0 },
  backLink: { display:'flex', alignItems:'center', gap:'6px', color:'#7A7470', background:'none', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'500', fontFamily:'inherit', padding:'0 0 24px', marginLeft:'-2px' },
  wizardCard: { background:'#fff', borderRadius:'16px', border:'1px solid #E8E4DF', maxWidth:'560px', overflow:'hidden' },
  stepBar: { display:'flex', alignItems:'center', padding:'24px 28px', borderBottom:'1px solid #F4F2EE' },
  stepItem: (active) => ({ display:'flex', alignItems:'center', gap:'8px', flex:1 }),
  stepCircle: (active) => ({ width:'26px', height:'26px', borderRadius:'50%', background: active ? '#1E4DB7':'#F4F2EE', color: active ? '#fff':'#9A9490', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', flexShrink:0 }),
  stepLabel: (active) => ({ fontSize:'13px', fontWeight: active ? '600':'400', color: active ? '#1A1714':'#9A9490' }),
  stepLine: (done) => ({ flex:1, height:'2px', background: done ? '#1E4DB7':'#E8E4DF', margin:'0 12px' }),
  wizardBody: { padding:'28px' },
  wizardTitle: { fontSize:'17px', fontWeight:'700', color:'#1A1714', marginBottom:'22px', letterSpacing:'-0.01em' },
  field: { marginBottom:'18px' },
  fieldLabel: { display:'block', fontSize:'13px', fontWeight:'600', color:'#4A4744', marginBottom:'7px' },
  input: { width:'100%', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'10px 14px', fontSize:'13.5px', color:'#1A1714', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  inputTA: { width:'100%', background:'#F9F8F5', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'10px 14px', fontSize:'13px', color:'#1A1714', fontFamily:'inherit', outline:'none', resize:'vertical', lineHeight:1.55, boxSizing:'border-box' },
  slugPreview: { fontSize:'12px', color:'#9A9490', marginTop:'6px', fontFamily:'monospace' },
  templateGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' },
  templateCard: { border:'2px solid #E8E4DF', borderRadius:'10px', padding:'16px', cursor:'pointer', position:'relative', transition:'all 0.15s' },
  templateCardActive: { borderColor:'#1E4DB7', background:'rgba(30,77,183,0.04)' },
  templateLabel: { fontSize:'14px', fontWeight:'700', color:'#1A1714', marginBottom:'4px' },
  templateDesc: { fontSize:'12px', color:'#7A7470' },
  templateCheck: { position:'absolute', top:'10px', right:'10px', width:'20px', height:'20px', borderRadius:'50%', background:'#1E4DB7', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' },
  summaryCard: { background:'#F9F8F5', borderRadius:'10px', padding:'14px 16px', marginBottom:'20px' },
  summaryRow: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' },
  summaryKey: { fontSize:'12px', color:'#9A9490', width:'60px', flexShrink:0 },
  summaryVal: { fontSize:'13px', color:'#1A1714', fontWeight:'500' },
  summarySlug: { fontSize:'12px', color:'#4A4744', fontFamily:'monospace', background:'#E8E4DF', padding:'2px 6px', borderRadius:'4px' },
  btnNext: (disabled) => ({ display:'flex', alignItems:'center', gap:'6px', background: disabled ? '#E8E4DF' : '#1E4DB7', color: disabled ? '#9A9490' : '#fff', border:'none', borderRadius:'9px', padding:'9px 18px', fontSize:'13px', fontWeight:'600', cursor: disabled ? 'not-allowed':'pointer', fontFamily:'inherit' }),
  btnBack: { background:'none', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'9px 16px', fontSize:'13px', fontWeight:'500', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
};

// ── Skill editor styles ───────────────────────────────────────────────────────
const se = {
  root: { display:'flex', flexDirection:'column', height:'100vh', background:'#F4F2EE' },
  header: { height:'56px', background:'#fff', borderBottom:'1px solid #E8E4DF', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0 },
  headerLeft: { display:'flex', alignItems:'center', gap:'12px' },
  backBtn: { width:'32px', height:'32px', borderRadius:'8px', background:'#F4F2EE', border:'1px solid #E8E4DF', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#4A4744' },
  skillIconSm: { width:'30px', height:'30px', borderRadius:'8px', background:'rgba(30,77,183,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#1E4DB7' },
  headerName: { fontWeight:'700', fontSize:'14px', color:'#1A1714' },
  headerMeta: { display:'flex', alignItems:'center', gap:'8px', marginTop:'2px' },
  slugSmall: { fontSize:'11px', color:'#9A9490', fontFamily:'monospace' },
  vTag: { background:'#F4F2EE', color:'#6B6764', borderRadius:'4px', padding:'1px 6px', fontSize:'10.5px', fontFamily:'monospace' },
  statusSmall: { borderRadius:'20px', padding:'2px 8px', fontSize:'10.5px', fontWeight:'600' },
  importedSm: { background:'rgba(180,83,9,0.08)', color:'#B45309', borderRadius:'4px', padding:'2px 7px', fontSize:'10.5px', fontWeight:'500' },
  headerActions: { display:'flex', gap:'10px' },
  btnDelete: { display:'flex', alignItems:'center', gap:'6px', background:'none', border:'1px solid rgba(220,38,38,0.25)', color:'#DC2626', borderRadius:'8px', padding:'7px 14px', fontSize:'12.5px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' },
  btnSave: { display:'flex', alignItems:'center', gap:'6px', background:'#1E4DB7', color:'#fff', border:'none', borderRadius:'8px', padding:'7px 16px', fontSize:'12.5px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' },
  tabBar: { background:'#fff', borderBottom:'1px solid #E8E4DF', display:'flex', gap:'2px', padding:'0 20px', flexShrink:0, overflowX:'auto' },
  tab: { padding:'12px 16px', background:'none', border:'none', fontSize:'13px', fontWeight:'500', color:'#7A7470', cursor:'pointer', fontFamily:'inherit', borderBottom:'2px solid transparent', whiteSpace:'nowrap' },
  tabActive: { color:'#1E4DB7', borderBottomColor:'#1E4DB7', fontWeight:'600' },
  content: { flex:1, overflowY:'auto', padding:'28px' },
  tabContent: { maxWidth:'760px', margin:'0 auto' },
  twoCol: { display:'grid', gridTemplateColumns:'1fr 280px', gap:'24px' },
  colMain: {},
  colSide: {},
  field: { marginBottom:'20px' },
  label: { display:'block', fontSize:'12.5px', fontWeight:'600', color:'#4A4744', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'8px' },
  input: { width:'100%', background:'#fff', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'10px 14px', fontSize:'13.5px', color:'#1A1714', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  textarea: { width:'100%', background:'#fff', border:'1px solid #E8E4DF', borderRadius:'9px', padding:'10px 14px', fontSize:'13px', color:'#1A1714', fontFamily:'inherit', outline:'none', resize:'vertical', lineHeight:1.6, boxSizing:'border-box' },
  mdEditor: { width:'100%', background:'#1A1714', border:'none', borderRadius:'12px', padding:'16px 20px', fontSize:'13px', color:'#C8D6C8', fontFamily:'monospace', outline:'none', resize:'vertical', lineHeight:1.7, boxSizing:'border-box' },
  jsonEditor: { width:'100%', background:'#1A1714', border:'none', borderRadius:'12px', padding:'16px 20px', fontSize:'12.5px', color:'#A8D5B5', fontFamily:'monospace', outline:'none', resize:'vertical', lineHeight:1.65, boxSizing:'border-box' },
  agentsList: { display:'flex', flexDirection:'column', gap:'8px' },
  agentRow: { display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', background:'#F9F8F5', borderRadius:'8px' },
  validationPanel: { background:'#fff', border:'1px solid #E8E4DF', borderRadius:'12px', padding:'18px' },
  vpTitle: { fontSize:'12px', fontWeight:'600', color:'#9A9490', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'12px' },
  vpStatus: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' },
  vpDot: (ok) => ({ width:'8px', height:'8px', borderRadius:'50%', background: ok ? '#2E7D52':'#B45309', flexShrink:0 }),
  vpBtn: { width:'100%', background:'#F4F2EE', border:'1px solid #E8E4DF', borderRadius:'8px', padding:'8px', fontSize:'12.5px', fontWeight:'600', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
  fileManager: {},
  fmHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' },
  fmUploadBtn: { display:'flex', alignItems:'center', gap:'6px', background:'#F4F2EE', border:'1px solid #E8E4DF', borderRadius:'7px', padding:'6px 12px', fontSize:'12px', fontWeight:'500', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
  fmRow: { display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', background:'#fff', border:'1px solid #E8E4DF', borderRadius:'8px', marginBottom:'8px' },
  fmDeleteBtn: { background:'none', border:'none', cursor:'pointer', color:'#DC2626', display:'flex', padding:0 },
  emptyTab: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'200px', color:'#9A9490', border:'2px dashed #E8E4DF', borderRadius:'12px' },
  timeline: { display:'flex', flexDirection:'column', gap:'0' },
  timelineItem: { display:'flex', alignItems:'flex-start', gap:'14px', paddingBottom:'24px', position:'relative', paddingLeft:'20px' },
  timelineDot: (current) => ({ width:'12px', height:'12px', borderRadius:'50%', background: current ? '#1E4DB7':'#E8E4DF', border: current ? '3px solid rgba(30,77,183,0.2)':'none', flexShrink:0, marginTop:'3px', position:'absolute', left:0 }),
  timelineContent: { flex:1 },
  timelineVersion: { fontSize:'14px', fontWeight:'700', color:'#1A1714', fontFamily:'monospace' },
  timelineDate: { fontSize:'12px', color:'#9A9490', marginTop:'2px' },
  timelineExecs: { fontSize:'12px', color:'#7A7470', marginTop:'2px' },
  currentBadge: { display:'inline-block', background:'rgba(30,77,183,0.08)', color:'#1E4DB7', borderRadius:'4px', padding:'2px 8px', fontSize:'10.5px', fontWeight:'600', marginTop:'4px' },
  publishBtn: { background:'none', border:'1px solid #E8E4DF', borderRadius:'7px', padding:'5px 12px', fontSize:'12px', fontWeight:'500', cursor:'pointer', fontFamily:'inherit', color:'#4A4744' },
};

Object.assign(window, { SkillsList, SkillEditor, CreateSkill });
