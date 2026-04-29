"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, Plus, ArrowRight, Search, Filter, Upload } from "lucide-react";

type Skill = {
  id: string; slug: string; displayName: string; description: string | null;
  status: string; tags: string[]; latestVersion: { versionNumber: string } | null;
  agentCount: number; sourceType?: string;
};

const STATUS_FILTERS = [
  { value: "", label: "Todos" },
  { value: "draft", label: "Draft" },
  { value: "validated", label: "Validated" },
  { value: "published", label: "Published" },
  { value: "deprecated", label: "Deprecated" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  validated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  deprecated: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  archived: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);
    fetch(`/api/skills?${params}`)
      .then((res) => res.json())
      .then((data) => { setSkills(data); setLoading(false); });
  }, [statusFilter, search]);

  return (
    <div className="p-10 w-full h-full">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-200 to-indigo-500 bg-clip-text text-transparent">Skills Studio</h1>
            <p className="text-zinc-500 mt-2">Skills reutilizáveis em formato ChatGPT-compatível.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/skills/import" className="inline-flex items-center rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 border border-zinc-700">
              <Upload className="mr-2 h-4 w-4" /> Importar ZIP
            </Link>
            <Link href="/skills/new" className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
              <Plus className="mr-2 h-4 w-4" /> Nova Skill
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input type="text" placeholder="Pesquisar skills..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((f) => (
              <button key={f.value} onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === f.value ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-800/60 shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400"><Code2 className="w-6 h-6" /></div>
                    {skill.latestVersion && (
                      <span className="flex items-center px-2 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">v{skill.latestVersion.versionNumber}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-1">{skill.displayName}</h3>
                  <p className="text-xs font-mono text-zinc-600 mb-2">{skill.slug}</p>
                  <p className="text-sm text-zinc-400 line-clamp-3">{skill.description || "Sem descrição."}</p>
                </div>
                <div className="mt-6 border-t border-zinc-800/80 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[skill.status] || STATUS_COLORS.draft}`}>{skill.status}</span>
                    {skill.sourceType === "imported_chatgpt" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Imported</span>
                    )}
                    {skill.agentCount > 0 && (
                      <span className="text-[10px] text-zinc-600">{skill.agentCount} agente{skill.agentCount > 1 ? "s" : ""}</span>
                    )}
                  </div>
                  <Link href={`/skills/${skill.id}`} className="text-sm font-medium text-indigo-500 hover:text-indigo-400 flex items-center transition-colors">
                    Editar <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 border border-zinc-800/50 border-dashed rounded-3xl">
                <Code2 className="w-12 h-12 mb-4 opacity-50" />
                <p>Nenhuma skill na sua biblioteca.</p>
                <Link href="/skills/new" className="mt-4 text-indigo-400 hover:underline">Crie a primeira skill.</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
