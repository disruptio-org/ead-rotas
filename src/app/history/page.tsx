"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, XCircle, Loader2, Clock, Bot, Code2,
  RotateCcw
} from "lucide-react";
import { ResultPanel } from "@/components/ResultPanel";
import type { ExecutionResult } from "@/components/ResultPanel";

type Execution = {
  id: string;
  status: string;
  summary: string;
  rawOutput: string | null;
  createdAt: string;
  completedAt: string | null;
  agentId: string;
  agentName: string;
  skillVersionId: string | null;
  skillName: string | null;
  skillSlug: string | null;
  skillVersion: string | null;
};

function StatusIcon({ status, size = 14 }: { status: string; size?: number }) {
  if (status === "completed") return <span style={{ color: '#2E7D52' }}><CheckCircle size={size} /></span>;
  if (status === "failed") return <span style={{ color: '#DC2626' }}><XCircle size={size} /></span>;
  return <span style={{ color: '#1E4DB7' }}><Loader2 size={size} style={{ animation: 'spin 1s linear infinite' }} /></span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    completed: { bg: 'rgba(46,125,82,0.08)', color: '#2E7D52', label: 'Concluído' },
    failed:    { bg: 'rgba(220,38,38,0.08)', color: '#DC2626', label: 'Erro' },
    running:   { bg: 'rgba(30,77,183,0.08)', color: '#1E4DB7', label: 'A correr' },
  };
  const s = map[status] || map.running;
  return <span style={{ background: s.bg, color: s.color, borderRadius: '20px', padding: '3px 9px', fontSize: '11px', fontWeight: 600 }}>{s.label}</span>;
}

export default function HistoryPage() {
  const router = useRouter();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Execution | null>(null);

  useEffect(() => {
    fetch("/api/executions")
      .then((r) => r.json())
      .then((data) => { setExecutions(data); setLoading(false); });
  }, []);

  const getDuration = (exec: Execution) => {
    if (!exec.completedAt) return "—";
    const ms = new Date(exec.completedAt).getTime() - new Date(exec.createdAt).getTime();
    return `${Math.round(ms / 1000)}s`;
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#7A7470' }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} /> A carregar...
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F2EE', overflow: 'hidden' }}>
      {/* Left panel - List */}
      <div style={{
        width: '320px', minWidth: '320px', background: '#fff',
        borderRight: '1px solid #E8E4DF', display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid #F4F2EE', flexShrink: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.01em' }}>Execution Log</div>
          <div style={{ fontSize: '12px', color: '#9A9490', marginTop: '2px' }}>{executions.length} execuções</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {executions.map((exec) => (
            <div
              key={exec.id}
              onClick={() => setSelected(exec)}
              style={{
                padding: '14px 18px', borderBottom: '1px solid #F9F8F5',
                cursor: 'pointer', transition: 'background 0.1s',
                ...(selected?.id === exec.id ? { background: 'rgba(212,70,14,0.04)', borderLeft: '3px solid #D4460E' } : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                <StatusIcon status={exec.status} size={14} />
                <StatusBadge status={exec.status} />
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#9A9490' }}>
                  {new Date(exec.createdAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#D4460E', fontWeight: 500 }}>
                  <Bot size={11} /> {exec.agentName}
                </span>
                {exec.skillName && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#1E4DB7', fontWeight: 500 }}>
                    <Code2 size={11} /> {exec.skillName}
                  </span>
                )}
              </div>
              <p style={{
                fontSize: '12px', color: '#7A7470', lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
              }}>
                {exec.summary}
              </p>
            </div>
          ))}
          {executions.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9A9490', fontSize: '13px' }}>
              Nenhuma execução registada.
            </div>
          )}
        </div>
      </div>

      {/* Right panel - Detail */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: '#9A9490' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', background: '#F4F2EE',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
            }}>
              <Clock size={28} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#4A4744' }}>Selecione uma execução</div>
            <div style={{ fontSize: '13px', color: '#9A9490' }}>Clique numa execução à esquerda para ver os detalhes.</div>
          </div>
        ) : (
          <div style={{ padding: '28px', maxWidth: '680px', margin: '0 auto' }}>
            {/* Detail header card */}
            <div style={{
              background: '#fff', borderRadius: '14px', border: '1px solid #E8E4DF',
              padding: '20px 22px', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <StatusIcon status={selected.status} size={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714' }}>
                    {selected.status === 'completed' ? 'Execução concluída' : selected.status === 'failed' ? 'Execução falhada' : 'A executar...'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9A9490', fontFamily: 'monospace', marginTop: '2px' }}>
                    ID #{selected.id.slice(0, 8)}
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/agents/${selected.agentId}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#F4F2EE', border: '1px solid #E8E4DF', borderRadius: '8px',
                    padding: '7px 14px', fontSize: '12.5px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', color: '#4A4744',
                  }}
                >
                  <RotateCcw size={13} /> Repetir
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: '#F9F8F5', border: '1px solid #E8E4DF', borderRadius: '6px',
                  padding: '4px 10px', fontSize: '12px', color: '#4A4744', fontWeight: 500,
                }}>
                  <Bot size={12} /> {selected.agentName}
                </div>
                {selected.skillName && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: '#F9F8F5', border: '1px solid #E8E4DF', borderRadius: '6px',
                    padding: '4px 10px', fontSize: '12px', color: '#4A4744', fontWeight: 500,
                  }}>
                    <Code2 size={12} /> {selected.skillName}
                  </div>
                )}
                <div style={{
                  background: '#F9F8F5', border: '1px solid #E8E4DF', borderRadius: '6px',
                  padding: '4px 10px', fontSize: '12px', color: '#9A9490',
                }}>
                  {new Date(selected.createdAt).toLocaleString("pt-PT")}
                </div>
                <div style={{
                  background: '#F9F8F5', border: '1px solid #E8E4DF', borderRadius: '6px',
                  padding: '4px 10px', fontSize: '12px', color: '#9A9490',
                }}>
                  Duração: {getDuration(selected)}
                </div>
              </div>
            </div>

            {/* Result content */}
            <ResultPanel result={{
              id: selected.id,
              status: selected.status,
              summary: selected.summary,
              rawOutput: selected.rawOutput,
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
