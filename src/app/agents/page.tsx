"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Plus, ArrowRight, Code2 } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  description: string;
  status: string;
  agentSkills?: { skill: { displayName: string } }[];
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => { setAgents(data); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '6px' }}>Agentes</h1>
          <p style={{ color: '#7A7470', fontSize: '14px' }}>Configure e gira agentes inteligentes para os seus fluxos de trabalho.</p>
        </div>
        <Link
          href="/agents/new"
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: '#D4460E', color: '#fff', border: 'none', borderRadius: '9px',
            padding: '9px 18px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', flexShrink: 0,
          }}
        >
          <Plus size={15} /> Novo Agente
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4460E" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {agents.map((agent) => {
            const skillName = agent.agentSkills?.[0]?.skill?.displayName;
            return (
              <div
                key={agent.id}
                style={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #E8E4DF',
                  padding: '22px', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.15s', cursor: 'default',
                  ...(hovered === agent.id ? { boxShadow: '0 6px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' } : {}),
                }}
                onMouseEnter={() => setHovered(agent.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top accent bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'linear-gradient(90deg, #D4460E, #F97040)',
                  transition: 'opacity 0.2s', opacity: hovered === agent.id ? 1 : 0,
                }} />
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(212,70,14,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#D4460E',
                  }}>
                    <Bot size={18} />
                  </div>
                  <span style={{
                    background: 'rgba(46,125,82,0.08)', color: '#2E7D52',
                    borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600,
                  }}>
                    ● Ativo
                  </span>
                </div>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1A1714', marginBottom: '8px' }}>{agent.name}</h3>
                <p style={{
                  fontSize: '12.5px', color: '#7A7470', lineHeight: 1.6,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
                  marginBottom: '12px',
                }}>
                  {agent.description || "Sem descrição definida."}
                </p>
                {skillName && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(30,77,183,0.07)', color: '#1E4DB7',
                    borderRadius: '6px', padding: '3px 9px', fontSize: '11px', fontWeight: 600,
                    marginBottom: '12px',
                  }}>
                    <Code2 size={11} /> {skillName}
                  </div>
                )}
                {/* Footer */}
                <div style={{ borderTop: '1px solid #F4F2EE', paddingTop: '12px', marginTop: '4px' }}>
                  <Link
                    href={`/agents/${agent.id}`}
                    style={{
                      background: 'none', border: 'none', color: '#D4460E', fontWeight: 600,
                      fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      gap: '4px', textDecoration: 'none',
                    }}
                  >
                    Gerir Agente{' '}
                    <span style={{
                      transition: 'transform 0.15s', display: 'inline-flex',
                      transform: hovered === agent.id ? 'translateX(3px)' : 'translateX(0)',
                    }}>
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}

          {agents.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', padding: '80px 0', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#9A9490',
              border: '2px dashed #E8E4DF', borderRadius: '14px',
            }}>
              <Bot size={40} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#4A4744' }}>Nenhum agente criado ainda.</p>
              <Link href="/agents/new" style={{ marginTop: '12px', color: '#D4460E', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Comece por criar o primeiro agente.
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
