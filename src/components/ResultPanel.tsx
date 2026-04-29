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

  return (
    <div className={`rounded-2xl border p-5 shadow-lg transition-all ${
      result.status === "completed"
        ? "border-emerald-500/40 bg-emerald-950/20"
        : "border-red-500/40 bg-red-950/20"
    }`}>
      <div className="flex items-start gap-3 mb-4">
        {result.status === "completed"
          ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        }
        <div>
          <p className="text-sm font-semibold text-zinc-200">{result.summary}</p>
          <p className="text-xs text-zinc-500 mt-1">ID: {result.id}</p>
        </div>
      </div>

      {/* Structured output */}
      {parsed && result.status === "completed" && (
        <div className="space-y-3">
          {parsed.resumo && typeof parsed.resumo === "object" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900/60 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{parsed.resumo.total_linhas ?? parsed.total_servicos ?? "—"}</p>
                <p className="text-xs text-zinc-500 mt-1">Total</p>
              </div>
              <div className="bg-emerald-950/40 rounded-xl p-3 text-center border border-emerald-800/30">
                <p className="text-2xl font-bold text-emerald-400">{parsed.resumo.servicos_incluidos ?? parsed.incluidos ?? "—"}</p>
                <p className="text-xs text-zinc-500 mt-1">Incluídos</p>
              </div>
              <div className="bg-red-950/30 rounded-xl p-3 text-center border border-red-800/30">
                <p className="text-2xl font-bold text-red-400">{parsed.resumo.servicos_excluidos ?? parsed.excluidos ?? 0}</p>
                <p className="text-xs text-zinc-500 mt-1">Excluídos</p>
              </div>
            </div>
          )}

          {/* Generated DOCX files */}
          {parsed.ficheiros_gerados && parsed.ficheiros_gerados.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ficheiros Gerados</p>
              <div className="grid grid-cols-1 gap-2">
                {parsed.ficheiros_gerados.map((file: any, idx: number) => (
                  <a
                    key={idx}
                    href={file.downloadUrl}
                    download={file.fileName}
                    className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all group"
                  >
                    <FileDown className="w-5 h-5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-indigo-300 truncate">{file.fileName}</p>
                    </div>
                    <span className="text-[10px] text-indigo-500 font-medium uppercase">Download</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {parsed.alertas && parsed.alertas.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Alertas</p>
              {parsed.alertas.map((alerta: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">{alerta}</p>
                </div>
              ))}
            </div>
          )}

          {parsed.plano_por_viatura && Object.keys(parsed.plano_por_viatura).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plano por viatura</p>
              {Object.entries(parsed.plano_por_viatura).map(([viatura, servicos]: [string, any]) => (
                <div key={viatura} className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800/60">
                  <p className="text-sm font-bold text-zinc-200 mb-2">🚐 {viatura}</p>
                  <ul className="text-xs text-zinc-400 space-y-1">
                    {(Array.isArray(servicos) ? servicos : [servicos]).map((s: any, i: number) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-500 mt-0.5">·</span>
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
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-2"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Ocultar JSON" : "Ver JSON completo"}
          </button>
          {expanded && (
            <pre className="text-xs bg-zinc-950 rounded-xl p-4 overflow-x-auto text-zinc-300 border border-zinc-800/60 max-h-64 overflow-y-auto">
              {JSON.stringify(parsed, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Error detail */}
      {result.status === "failed" && (
        <div className="mt-2 text-xs text-red-400 font-mono bg-red-950/20 rounded-lg p-3 border border-red-500/20">
          {result.summary}
        </div>
      )}
    </div>
  );
}
