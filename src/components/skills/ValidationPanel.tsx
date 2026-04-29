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

const SEVERITY_CONFIG = {
  error: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  info: {
    icon: CheckCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

function IssueList({ title, issues }: { title: string; issues: ValidationIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400/60">
        <CheckCircle className="w-4 h-4" />
        {title}: Sem problemas
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</h4>
      {issues.map((issue, i) => {
        const config = SEVERITY_CONFIG[issue.severity];
        const Icon = config.icon;
        return (
          <div
            key={`${issue.code}-${i}`}
            className={`flex items-start gap-3 p-3 rounded-xl border ${config.bg} ${config.border}`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.color}`} />
            <div className="min-w-0">
              <p className={`text-sm font-medium ${config.color}`}>{issue.message}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono text-zinc-500">{issue.code}</span>
                {issue.path && (
                  <span className="text-[10px] font-mono text-zinc-600">→ {issue.path}</span>
                )}
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
    <div className="space-y-6">
      {/* Header + Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            Validação da Skill
          </h3>
          <p className="text-xs text-zinc-600 mt-1">
            Verifica estrutura, runtime e compatibilidade ChatGPT.
          </p>
        </div>
        <button
          onClick={runValidation}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              A validar...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Executar Validação
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Summary Banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              result.valid
                ? "bg-emerald-950/20 border-emerald-500/30"
                : "bg-red-950/20 border-red-500/30"
            }`}
          >
            {result.valid ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <p className={`text-sm font-medium ${result.valid ? "text-emerald-300" : "text-red-300"}`}>
              {result.summary}
            </p>
          </div>

          {/* Issue Categories */}
          <IssueList title="Structural" issues={result.structural} />
          <IssueList title="Runtime" issues={result.runtime} />
          <IssueList title="Compatibility" issues={result.compatibility} />
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-12 text-zinc-600 text-sm">
          <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Execute a validação para verificar a integridade da skill.
        </div>
      )}
    </div>
  );
}
