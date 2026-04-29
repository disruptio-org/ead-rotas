"use client";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Shield,
  ShieldCheck,
  ShieldAlert,
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

const STATUS_CONFIG = {
  fully_compatible: {
    icon: ShieldCheck,
    label: "Totalmente Compatível",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  partially_compatible: {
    icon: Shield,
    label: "Parcialmente Compatível",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  incompatible: {
    icon: ShieldAlert,
    label: "Incompatível",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-400",
  },
};

const SEVERITY_CONFIG = {
  error: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/5",
    border: "border-red-500/10",
    label: "Erro",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/5",
    border: "border-amber-500/10",
    label: "Aviso",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/10",
    label: "Info",
  },
};

export function CompatibilityReport({
  compatibility,
  issues,
  summary,
  canImport,
}: CompatibilityReportProps) {
  const config = STATUS_CONFIG[compatibility];
  const StatusIcon = config.icon;

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div
        className={`flex items-center gap-4 p-4 rounded-xl border ${config.bg}`}
      >
        <StatusIcon className={`w-8 h-8 ${config.iconColor} shrink-0`} />
        <div>
          <div className={`text-sm font-bold ${config.color}`}>
            {config.label}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">{summary}</p>
        </div>
        {canImport && (
          <div className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4" />
            Importação permitida
          </div>
        )}
      </div>

      {/* Issues grouped by severity */}
      {errors.length > 0 && (
        <IssueGroup label="Erros" issues={errors} severity="error" />
      )}
      {warnings.length > 0 && (
        <IssueGroup label="Avisos" issues={warnings} severity="warning" />
      )}
      {infos.length > 0 && (
        <IssueGroup label="Informações" issues={infos} severity="info" />
      )}

      {issues.length === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          Nenhum problema detectado. A skill passou todas as validações.
        </div>
      )}
    </div>
  );
}

function IssueGroup({
  label,
  issues,
  severity,
}: {
  label: string;
  issues: ValidationIssue[];
  severity: "error" | "warning" | "info";
}) {
  const cfg = SEVERITY_CONFIG[severity];
  const Icon = cfg.icon;

  return (
    <div className="space-y-2">
      <div className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
        {label} ({issues.length})
      </div>
      <div className="space-y-1.5">
        {issues.map((issue, idx) => (
          <div
            key={`${issue.code}-${idx}`}
            className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}
          >
            <Icon className={`w-4 h-4 ${cfg.color} shrink-0 mt-0.5`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200">{issue.message}</p>
              {issue.path && (
                <span className="text-xs font-mono text-zinc-600 mt-1 block truncate">
                  {issue.path}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-zinc-700 shrink-0">
              {issue.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
