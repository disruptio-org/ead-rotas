"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, Plus, ArrowRight, Search, Upload } from "lucide-react";

type Skill = {
  id: string; slug: string; displayName: string; description: string | null;
  status: string; tags: string[]; latestVersion: { versionNumber: string } | null;
  agentCount: number; sourceType?: string;
};

const STATUS_FILTERS = [
  { value: "", label: "Todos" },
  { value: "draft", label: "Draft" },
  { value: "validated", label: "Validated" },
  { value: "published", label: "Published" },
  { value: "deprecated", label: "Deprecated" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  published:  { bg: 'rgba(46,125,82,0.08)',  text: '#2E7D52',  label: 'Published' },
  validated:  { bg: 'rgba(30,77,183,0.08)',  text: '#1E4DB7',  label: 'Validated' },
  draft:      { bg: 'rgba(0,0,0,0.05)',      text: '#4A4744',  label: 'Draft' },
  deprecated: { bg: 'rgba(180,83,9,0.08)',   text: '#B45309',  label: 'Deprecated' },
  archived:   { bg: 'rgba(220,38,38,0.08)',  text: '#DC2626',  label: 'Archived' },
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);
    fetch(`/api/skills?${params}`)
      .then((res) => res.json())
      .then((data) => { setSkills(data); setLoading(false); });
  }, [statusFilter, search]);

  return (
    <div style={{ padding: '40px 48px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '6px' }}>Skills Studio</h1>
          <p style={{ color: '#7A7470', fontSize: '14px' }}>Crie, importe e gira skills reutilizáveis para os seus agentes.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/skills/import" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#fff', border: '1px solid #E8E4DF', borderRadius: '9px',
            padding: '9px 16px', fontSize: '13px', fontWeight: 500, color: '#4A4744', textDecoration: 'none',
          }}>
            <Upload size={14} /> Importar ZIP
          </Link>
          <Link href="/skills/new" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#1E4DB7', color: '#fff', border: 'none', borderRadius: '9px',
            padding: '9px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>
            <Plus size={14} /> Nova Skill
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9A9490', display: 'flex' }}>
            <Search size={14} />
          </span>
          <input
            style={{
              width: '100%', paddingLeft: '34px', padding: '9px 14px 9px 34px',
              background: '#fff', border: '1px solid #E8E4DF', borderRadius: '9px',
              fontSize: '13px', color: '#1A1714', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            }}
            placeholder="Pesquisar skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                padding: '6px 14px', borderRadius: '20px',
                border: statusFilter === f.value ? '1px solid #1E4DB7' : '1px solid #E8E4DF',
                background: statusFilter === f.value ? '#1E4DB7' : '#fff',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                color: statusFilter === f.value ? '#fff' : '#4A4744',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E4DB7" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {skills.map((skill) => {
            const sc = STATUS_COLORS[skill.status] || STATUS_COLORS.draft;
            return (
              <div
                key={skill.id}
                style={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #E8E4DF',
                  padding: '22px', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.15s',
                  ...(hovered === skill.id ? { boxShadow: '0 6px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' } : {}),
                }}
                onMouseEnter={() => setHovered(skill.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'linear-gradient(90deg, #1E4DB7, #3B82F6)',
                  transition: 'opacity 0.2s', opacity: hovered === skill.id ? 1 : 0,
                }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(30,77,183,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#1E4DB7',
                  }}>
                    <Code2 size={17} />
                  </div>
                  {skill.latestVersion && (
                    <span style={{
                      background: '#F4F2EE', color: '#6B6764', borderRadius: '6px',
                      padding: '3px 8px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600,
                    }}>
                      v{skill.latestVersion.versionNumber}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1A1714', marginBottom: '4px' }}>{skill.displayName}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <code style={{ fontSize: '11.5px', color: '#9A9490', fontFamily: 'monospace', background: '#F9F8F5', padding: '2px 6px', borderRadius: '4px' }}>
                    {skill.slug}
                  </code>
                </div>
                <p style={{
                  fontSize: '12.5px', color: '#7A7470', lineHeight: 1.6,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
                  marginBottom: '14px',
                }}>
                  {skill.description || "Sem descrição."}
                </p>
                <div style={{
                  borderTop: '1px solid #F4F2EE', paddingTop: '12px',
                  display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
                }}>
                  <span style={{ background: sc.bg, color: sc.text, borderRadius: '20px', padding: '3px 9px', fontSize: '11px', fontWeight: 600 }}>
                    {sc.label}
                  </span>
                  {skill.sourceType === "imported_chatgpt" && (
                    <span style={{ background: 'rgba(180,83,9,0.08)', color: '#B45309', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 500 }}>
                      Importado
                    </span>
                  )}
                  {skill.agentCount > 0 && (
                    <span style={{ fontSize: '12px', color: '#9A9490' }}>
                      {skill.agentCount} agente{skill.agentCount > 1 ? "s" : ""}
                    </span>
                  )}
                  <Link
                    href={`/skills/${skill.id}`}
                    style={{
                      marginLeft: 'auto', background: 'none', border: 'none',
                      color: '#1E4DB7', fontWeight: 600, fontSize: '12.5px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
                    }}
                  >
                    Editar{' '}
                    <span style={{
                      transition: 'transform 0.15s', display: 'inline-flex',
                      transform: hovered === skill.id ? 'translateX(3px)' : 'translateX(0)',
                    }}>
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
          {skills.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', padding: '80px 0', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#9A9490',
              border: '2px dashed #E8E4DF', borderRadius: '14px',
            }}>
              <Code2 size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#4A4744' }}>Nenhuma skill na sua biblioteca.</p>
              <Link href="/skills/new" style={{ marginTop: '12px', color: '#1E4DB7', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Crie a primeira skill.
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
