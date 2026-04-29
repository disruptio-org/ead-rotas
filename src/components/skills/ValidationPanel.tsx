"use client";

import { useState } from "react";
import { Shield, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";

interface ValidationIssue {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
  path?: string;
}

interface ValidationResult {
  valid: boolean;
  structural: ValidationIssue[];
  runtime: ValidationIssue[];
  compatibility: ValidationIssue[];
  summary: string;
}

interface ValidationPanelProps {
  skillId: string;
}

const SEVERITY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  error:   { color: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)' },
  warning: { color: '#B45309', bg: 'rgba(180,83,9,0.06)',  border: 'rgba(180,83,9,0.2)' },
  info:    { color: '#1E4DB7', bg: 'rgba(30,77,183,0.06)', border: 'rgba(30,77,183,0.2)' },
};

function IssueList({ title, issues }: { title: string; issues: ValidationIssue[] }) {
  if (issues.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2E7D52' }}>
        <CheckCircle size={14} /> {title}: Sem problemas
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
        {title}
      </h4>
      {issues.map((issue, i) => {
        const s = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.info;
        const Icon = issue.severity === 'error' ? XCircle : issue.severity === 'warning' ? AlertTriangle : CheckCircle;
        return (
          <div key={`${issue.code}-${i}`} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px',
            borderRadius: '8px', background: s.bg, border: `1px solid ${s.border}`, marginBottom: '6px',
          }}>
            <Icon size={14} color={s.color} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: s.color }}>{issue.message}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9A9490' }}>{issue.code}</span>
                {issue.path && <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9A9490' }}>→ {issue.path}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ValidationPanel({ skillId }: ValidationPanelProps) {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runValidation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/skills/${skillId}/validate`, { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error("Validation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E8E4DF', borderRadius: '12px', padding: '18px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
        Validação
      </div>

      {!result && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B45309', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#4A4744' }}>Aguarda validação</span>
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: result.valid ? '#2E7D52' : '#DC2626', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#4A4744' }}>
            {result.valid ? 'Skill validada' : 'Problemas encontrados'}
          </span>
        </div>
      )}

      <button
        onClick={runValidation}
        disabled={loading}
        style={{
          width: '100%', background: '#F4F2EE', border: '1px solid #E8E4DF',
          borderRadius: '8px', padding: '8px', fontSize: '12.5px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: '#4A4744',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}
      >
        {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> A validar...</> : 'Executar validação'}
      </button>

      {result && (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            padding: '10px 12px', borderRadius: '8px',
            background: result.valid ? 'rgba(46,125,82,0.06)' : 'rgba(220,38,38,0.06)',
            border: `1px solid ${result.valid ? 'rgba(46,125,82,0.2)' : 'rgba(220,38,38,0.2)'}`,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {result.valid ? <CheckCircle size={14} color="#2E7D52" /> : <XCircle size={14} color="#DC2626" />}
            <span style={{ fontSize: '12.5px', fontWeight: 500, color: result.valid ? '#2E7D52' : '#DC2626' }}>
              {result.summary}
            </span>
          </div>
          <IssueList title="Structural" issues={result.structural} />
          <IssueList title="Runtime" issues={result.runtime} />
          <IssueList title="Compatibility" issues={result.compatibility} />
        </div>
      )}
    </div>
  );
}
