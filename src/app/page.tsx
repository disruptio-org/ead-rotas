"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Code2, ArrowRight, Briefcase } from "lucide-react";

type Stats = {
  activeAgents: number;
  publishedSkills: number;
  executionsToday: number;
  successRate: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const handleQuickLaunch = async () => {
    try {
      const res = await fetch("/api/agents");
      const agents = await res.json();
      if (agents.length > 0) {
        router.push(`/agents/${agents[0].id}`);
      } else {
        router.push("/agents/new");
      }
    } catch {
      router.push("/agents");
    }
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Bem-vindo ao <span style={{ color: '#D4460E' }}>Rotas</span>
          </h1>
          <p style={{ color: '#7A7470', fontSize: '14.5px', lineHeight: 1.6, maxWidth: '480px' }}>
            Gerencie agentes, skills e execuções da sua plataforma de automação inteligente.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: '#fff', border: '1px solid #E8E4DF', borderRadius: '20px',
          padding: '6px 14px', fontSize: '12px', color: '#4A4744', fontWeight: 500,
          whiteSpace: 'nowrap', marginTop: '4px',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2E7D52', display: 'inline-block' }} />
          Sistema operacional
        </div>
      </div>

      {/* Action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Agents card */}
        <div
          style={{
            background: '#fff', borderRadius: '16px', border: '1px solid #E8E4DF',
            padding: '28px', position: 'relative', overflow: 'hidden',
            transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default',
            ...(hoveredCard === 'agents' ? { boxShadow: '0 8px 32px rgba(0,0,0,0.09)', transform: 'translateY(-2px)' } : {}),
          }}
          onMouseEnter={() => setHoveredCard('agents')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #D4460E, #F97040)',
            transition: 'opacity 0.2s', opacity: hoveredCard === 'agents' ? 1 : 0,
          }} />
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(212,70,14,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
          }}>
            <Bot size={22} color="#D4460E" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1714', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Agentes Customizados
          </h2>
          <p style={{ fontSize: '13.5px', color: '#7A7470', lineHeight: 1.65, marginBottom: '20px' }}>
            Configure agentes inteligentes com instruções de sistema personalizadas e associe skills específicas a cada fluxo de trabalho.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => router.push("/agents/new")}
              style={{
                background: '#D4460E', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Criar Agente
            </button>
            <button
              onClick={() => router.push("/agents")}
              style={{
                background: '#F4F2EE', color: '#4A4744', border: '1px solid #E8E4DF', borderRadius: '8px',
                padding: '8px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Ver Todos
            </button>
          </div>
        </div>

        {/* Skills card */}
        <div
          style={{
            background: '#fff', borderRadius: '16px', border: '1px solid #E8E4DF',
            padding: '28px', position: 'relative', overflow: 'hidden',
            transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default',
            ...(hoveredCard === 'skills' ? { boxShadow: '0 8px 32px rgba(0,0,0,0.09)', transform: 'translateY(-2px)' } : {}),
          }}
          onMouseEnter={() => setHoveredCard('skills')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #1E4DB7, #3B82F6)',
            transition: 'opacity 0.2s', opacity: hoveredCard === 'skills' ? 1 : 0,
          }} />
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(30,77,183,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
          }}>
            <Code2 size={22} color="#1E4DB7" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1714', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Skills Studio
          </h2>
          <p style={{ fontSize: '13.5px', color: '#7A7470', lineHeight: 1.65, marginBottom: '20px' }}>
            Crie e gerencie skills reutilizáveis para automatizar documentos, análises e fluxos complexos com configurações avançadas de I/O.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => router.push("/skills/new")}
              style={{
                background: '#1E4DB7', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Nova Skill
            </button>
            <button
              onClick={() => router.push("/skills")}
              style={{
                background: '#F4F2EE', color: '#4A4744', border: '1px solid #E8E4DF', borderRadius: '8px',
                padding: '8px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Ver Biblioteca
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#7A7470', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>
          Casos de Uso Rápidos
        </h2>
        <div
          style={{
            background: '#fff', border: '1px solid #E8E4DF', borderRadius: '12px',
            padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px',
            cursor: 'pointer', transition: 'all 0.15s',
            ...(hoveredCard === 'quick' ? { boxShadow: '0 4px 20px rgba(0,0,0,0.07)', borderColor: '#D4460E' } : {}),
          }}
          onMouseEnter={() => setHoveredCard('quick')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={handleQuickLaunch}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(212,70,14,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Briefcase size={20} color="#D4460E" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1714', marginBottom: '3px' }}>Planeamento DSC</div>
            <div style={{ fontSize: '12.5px', color: '#7A7470' }}>Executar o fluxo completo de planeamento e geração de documentos DSC</div>
          </div>
          <div style={{
            background: 'rgba(212,70,14,0.1)', color: '#D4460E', borderRadius: '6px',
            padding: '3px 8px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.05em',
          }}>
            MVP
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#D4460E', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', gap: '4px' }}>
            Executar <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Agentes ativos', value: stats?.activeAgents ?? '—', color: '#D4460E' },
          { label: 'Skills publicadas', value: stats?.publishedSkills ?? '—', color: '#1E4DB7' },
          { label: 'Execuções hoje', value: stats?.executionsToday ?? '—', color: '#2E7D52' },
          { label: 'Taxa de sucesso', value: stats ? `${stats.successRate}%` : '—', color: '#B45309' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', border: '1px solid #E8E4DF', borderRadius: '12px', padding: '18px 20px',
          }}>
            <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px', color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: '#7A7470', fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
