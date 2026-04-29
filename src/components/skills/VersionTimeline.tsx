"use client";

import { GitBranch, CheckCircle, Clock, Rocket } from "lucide-react";

interface Version {
  id: string;
  versionNumber: string;
  createdAt: string;
  createdBy: string | null;
  _count: { executions: number; files: number };
}

interface VersionTimelineProps {
  versions: Version[];
  currentVersionId: string | null;
  onPublish: () => void;
  publishing: boolean;
}

export function VersionTimeline({
  versions,
  currentVersionId,
  onPublish,
  publishing,
}: VersionTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Publish Action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            Gestão de Versões
          </h3>
          <p className="text-xs text-zinc-600 mt-1">
            Publicar cria um snapshot imutável. Execuções anteriores mantêm referência à versão usada.
          </p>
        </div>
        <button
          onClick={onPublish}
          disabled={publishing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
        >
          {publishing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              A publicar...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Publicar Versão
            </>
          )}
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {versions.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm">
            <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Nenhuma versão publicada ainda.
          </div>
        ) : (
          versions.map((v, i) => {
            const isCurrent = v.id === currentVersionId;
            return (
              <div
                key={v.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "border-indigo-500/40 bg-indigo-950/20"
                    : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {isCurrent ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold font-mono text-zinc-200">
                      v{v.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Atual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>
                      {new Date(v.createdAt).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>{v._count.executions} execuções</span>
                    <span>{v._count.files} ficheiros</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
