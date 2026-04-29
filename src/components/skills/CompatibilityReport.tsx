"use client";

import {
  CheckCircle, AlertTriangle, XCircle, Info,
  Shield, ShieldCheck, ShieldAlert,
} from "lucide-react";

interface ValidationIssue {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
  path?: string;
}

interface CompatibilityReportProps {
  compatibility: "fully_compatible" | "partially_compatible" | "incompatible";
  issues: ValidationIssue[];
  summary: string;
  canImport: boolean;
}

const STATUS_MAP = {
  fully_compatible: { icon: ShieldCheck, label: "Totalmente Compatível", color: '#2E7D52', bg: 'rgba(46,125,82,0.06)', border: 'rgba(46,125,82,0.2)' },
  partially_compatible: { icon: Shield, label: "Parcialmente Compatível", color: '#B45309', bg: 'rgba(180,83,9,0.06)', border: 'rgba(180,83,9,0.2)' },
  incompatible: { icon: ShieldAlert, label: "Incompatível", color: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)' },
};

const SEV_MAP = {
  error: { icon: XCircle, color: '#DC2626', bg: 'rgba(220,38,38,0.05)', border: 'rgba(220,38,38,0.15)' },
  warning: { icon: AlertTriangle, color: '#B45309', bg: 'rgba(180,83,9,0.05)', border: 'rgba(180,83,9,0.15)' },
  info: { icon: Info, color: '#1E4DB7', bg: 'rgba(30,77,183,0.05)', border: 'rgba(30,77,183,0.15)' },
};

export function CompatibilityReport({ compatibility, issues, summary, canImport }: CompatibilityReportProps) {
  const config = STATUS_MAP[compatibility];
  const StatusIcon = config.icon;
  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");
  const infos = issues.filter(i => i.severity === "info");

  return (
    <div>
      {/* Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
        borderRadius: '12px', background: config.bg, border: `1px solid ${config.border}`,
        marginBottom: '16px',
      }}>
        <StatusIcon size={28} color={config.color} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: config.color }}>{config.label}</div>
          <div style={{ fontSize: '12px', color: '#7A7470', marginTop: '2px' }}>{summary}</div>
        </div>
        {canImport && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2E7D52', fontSize: '12px', fontWeight: 600 }}>
            <CheckCircle size={14} /> Importação permitida
          </div>
        )}
      </div>

      {errors.length > 0 && <IssueGroup label="Erros" issues={errors} severity="error" />}
      {warnings.length > 0 && <IssueGroup label="Avisos" issues={warnings} severity="warning" />}
      {infos.length > 0 && <IssueGroup label="Informações" issues={infos} severity="info" />}

      {issues.length === 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '14px',
          borderRadius: '10px', background: 'rgba(46,125,82,0.05)', border: '1px solid rgba(46,125,82,0.15)',
          fontSize: '13px', color: '#2E7D52',
        }}>
          <CheckCircle size={16} /> Nenhum problema detectado. A skill passou todas as validações.
        </div>
      )}
    </div>
  );
}

function IssueGroup({ label, issues, severity }: { label: string; issues: ValidationIssue[]; severity: "error" | "warning" | "info" }) {
  const cfg = SEV_MAP[severity];
  const Icon = cfg.icon;

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: cfg.color, marginBottom: '8px' }}>
        {label} ({issues.length})
      </div>
      {issues.map((issue, idx) => (
        <div key={`${issue.code}-${idx}`} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px',
          borderRadius: '8px', background: cfg.bg, border: `1px solid ${cfg.border}`, marginBottom: '6px',
        }}>
          <Icon size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', color: '#4A4744' }}>{issue.message}</div>
            {issue.path && <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9A9490', marginTop: '3px' }}>{issue.path}</div>}
          </div>
          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9A9490', flexShrink: 0 }}>{issue.code}</span>
        </div>
      ))}
    </div>
  );
}
