"use client";

import { useState } from "react";
import {
  CheckCircle, XCircle, FileDown,
  ChevronDown, ChevronUp, AlertTriangle
} from "lucide-react";

export type ExecutionResult = {
  id: string;
  status: string;
  summary: string | null;
  rawOutput: string | null;
};

export function ResultPanel({ result }: { result: ExecutionResult }) {
  const [expanded, setExpanded] = useState(false);
  let parsed: any = null;
  try {
    if (result.rawOutput) parsed = JSON.parse(result.rawOutput);
  } catch {}

  if (result.status === "failed") {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'rgba(220,38,38,0.08)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <XCircle size={20} color="#DC2626" />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#DC2626' }}>Execução falhada</div>
        <pre style={{
          background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: '8px', padding: '12px 16px', fontSize: '12px',
          fontFamily: 'monospace', color: '#B91C1C', maxWidth: '500px', whiteSpace: 'pre-wrap',
        }}>
          {result.summary}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'rgba(46,125,82,0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
        }}>
          <CheckCircle size={16} color="#2E7D52" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714' }}>Execução concluída</div>
          <div style={{ fontSize: '11px', color: '#9A9490', fontFamily: 'monospace', marginTop: '2px' }}>ID: {result.id}</div>
        </div>
      </div>

      {/* Summary */}
      {result.summary && (
        <p style={{
          fontSize: '13.5px', color: '#4A4744', lineHeight: 1.6, marginBottom: '20px',
          padding: '12px 16px', background: '#F9F8F5', borderRadius: '8px',
        }}>
          {result.summary}
        </p>
      )}

      {/* Structured output */}
      {parsed && result.status === "completed" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Stats grid */}
          {parsed.resumo && typeof parsed.resumo === "object" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: '#fff', border: '1px solid #E8E4DF', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em' }}>
                  {parsed.resumo.total_linhas ?? parsed.total_servicos ?? "—"}
                </div>
                <div style={{ fontSize: '11px', color: '#9A9490', marginTop: '2px' }}>Total</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E8E4DF', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2E7D52', letterSpacing: '-0.02em' }}>
                  {parsed.resumo.servicos_incluidos ?? parsed.incluidos ?? "—"}
                </div>
                <div style={{ fontSize: '11px', color: '#9A9490', marginTop: '2px' }}>Incluídos</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E8E4DF', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#DC2626', letterSpacing: '-0.02em' }}>
                  {parsed.resumo.servicos_excluidos ?? parsed.excluidos ?? 0}
                </div>
                <div style={{ fontSize: '11px', color: '#9A9490', marginTop: '2px' }}>Excluídos</div>
              </div>
            </div>
          )}

          {/* Generated files */}
          {parsed.ficheiros_gerados && parsed.ficheiros_gerados.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                Ficheiros gerados
              </div>
              {parsed.ficheiros_gerados.map((file: any, idx: number) => (
                <a
                  key={idx}
                  href={file.downloadUrl}
                  download={file.fileName}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 12px', background: '#F0F4FF', borderRadius: '8px',
                    marginBottom: '6px', color: '#1E4DB7', fontSize: '13px', textDecoration: 'none',
                  }}
                >
                  <FileDown size={15} />
                  <span style={{ flex: 1, fontWeight: 500 }}>{file.fileName}</span>
                  <span style={{
                    background: 'none', border: '1px solid #1E4DB7', color: '#1E4DB7',
                    borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600,
                  }}>
                    Descarregar
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Alerts */}
          {parsed.alertas && parsed.alertas.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                Alertas
              </div>
              {parsed.alertas.map((alerta: string, idx: number) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  padding: '10px 14px', background: 'rgba(180,83,9,0.07)', borderRadius: '8px',
                  fontSize: '12.5px', color: '#7C4A0D', lineHeight: 1.5, marginBottom: '6px',
                }}>
                  <AlertTriangle size={14} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{alerta}</span>
                </div>
              ))}
            </div>
          )}

          {/* Vehicle plan */}
          {parsed.plano_por_viatura && Object.keys(parsed.plano_por_viatura).length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                Plano por viatura
              </div>
              {Object.entries(parsed.plano_por_viatura).map(([viatura, servicos]: [string, any]) => (
                <div key={viatura} style={{
                  background: '#fff', borderRadius: '10px', padding: '14px',
                  border: '1px solid #E8E4DF', marginBottom: '8px',
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1714', marginBottom: '8px' }}>🚐 {viatura}</p>
                  <ul style={{ fontSize: '12px', color: '#7A7470', listStyle: 'none', padding: 0 }}>
                    {(Array.isArray(servicos) ? servicos : [servicos]).map((s: any, i: number) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ color: '#2E7D52', marginTop: '2px' }}>·</span>
                        <span>{typeof s === "string" ? s : JSON.stringify(s)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Raw JSON toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', color: '#9A9490',
              fontSize: '12px', cursor: 'pointer', padding: '4px 0', fontFamily: 'monospace',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "Ocultar JSON" : "Ver JSON completo"}
          </button>
          {expanded && (
            <pre style={{
              background: '#1A1714', color: '#A8D5B5', borderRadius: '8px',
              padding: '14px', fontSize: '11.5px', fontFamily: 'monospace',
              lineHeight: 1.6, overflowX: 'auto', marginTop: '8px',
            }}>
              {JSON.stringify(parsed, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
