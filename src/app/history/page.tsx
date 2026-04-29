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

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (s === "failed") return <XCircle className="w-4 h-4 text-red-400" />;
    return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
  };

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "failed") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  const handleRepeat = (ex: Execution) => {
    // Navigate to the agent workspace to start a new execution
    router.push(`/agents/${ex.agentId}`);
  };

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-1/3 min-w-[300px] border-r border-zinc-800 bg-zinc-950/40 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white">Execution Log</h1>
          <p className="text-zinc-500 text-sm mt-1">{executions.length} execuções registadas</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading && (
            <div className="flex justify-center mt-10">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          )}
          {!loading && executions.length === 0 && (
            <p className="text-zinc-600 text-sm text-center mt-10 italic">Nenhuma execução registada.</p>
          )}
          {executions.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setSelected(ex)}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                selected?.id === ex.id
                  ? "border-emerald-500/50 bg-emerald-950/10"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {statusIcon(ex.status)}
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${statusColor(ex.status)}`}>{ex.status}</span>
                </div>
                <span className="text-xs text-zinc-600">
                  {new Date(ex.createdAt).toLocaleString("pt-PT", {
                    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              {/* Agent & Skill context */}
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Bot className="w-3 h-3 text-emerald-500/60" /> {ex.agentName}
                </span>
                {ex.skillName && (
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-indigo-500/60" /> {ex.skillName}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-300 line-clamp-2">{ex.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto p-8">
        {!selected && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4">
            <Clock className="w-12 h-12 opacity-30" />
            <p className="text-sm">Selecione uma execução para ver os detalhes</p>
          </div>
        )}
        {selected && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Execution metadata header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" /> {selected.agentName}
                  </span>
                  {selected.skillName && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" /> {selected.skillName}
                      {selected.skillVersion && (
                        <span className="font-mono text-zinc-600">v{selected.skillVersion}</span>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600">
                  {new Date(selected.createdAt).toLocaleString("pt-PT")}
                  {selected.completedAt && (
                    <> · Duração: {Math.round((new Date(selected.completedAt).getTime() - new Date(selected.createdAt).getTime()) / 1000)}s</>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleRepeat(selected)}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white border border-zinc-700"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir Execução
              </button>
            </div>

            {/* Shared structured result panel */}
            <ResultPanel result={{
              id: selected.id,
              status: selected.status,
              summary: selected.summary,
              rawOutput: selected.rawOutput,
            } as ExecutionResult} />
          </div>
        )}
      </div>
    </div>
  );
}
