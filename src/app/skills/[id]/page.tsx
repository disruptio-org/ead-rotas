"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2, Save, ArrowLeft, Trash2, Loader2, CheckCircle,
  Bot, Tag, Hash, Info, Package
} from "lucide-react";
import { SkillTabs, type TabId } from "@/components/skills/SkillTabs";
import { SkillMdEditor } from "@/components/skills/SkillMdEditor";
import { FileManager } from "@/components/skills/FileManager";
import { VersionTimeline } from "@/components/skills/VersionTimeline";
import { ValidationPanel } from "@/components/skills/ValidationPanel";
import { BUILTIN_SCRIPTS } from "@/lib/skills/types";

type SkillData = {
  id: string;
  slug: string;
  displayName: string;
  description: string | null;
  status: string;
  sourceType?: string;
  tags: string[];
  currentVersionId: string | null;
  versions: {
    id: string;
    versionNumber: string;
    skillMdContent: string;
    openaiYaml: string | null;
    inputSchema: string | null;
    outputSchema: string | null;
    createdAt: string;
    createdBy: string | null;
    files: {
      id: string;
      path: string;
      fileType: string;
      mimeType: string | null;
      storagePath: string;
    }[];
    _count: { executions: number; files: number };
  }[];
  agentSkills: { agent: { id: string; name: string } }[];
};

const STATUS_BADGES: Record<string, { color: string; label: string }> = {
  draft: { color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20", label: "Draft" },
  validated: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Validated" },
  published: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Published" },
  deprecated: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Deprecated" },
  archived: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Archived" },
};

export default function SkillEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [skill, setSkill] = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [skillMdContent, setSkillMdContent] = useState("");
  const [inputSchema, setInputSchema] = useState("{}");
  const [outputSchema, setOutputSchema] = useState("{}");

  const fetchSkill = useCallback(async () => {
    try {
      const res = await fetch(`/api/skills/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSkill(data);
      setDisplayName(data.displayName);
      setDescription(data.description || "");
      const currentVersion = data.versions?.[0];
      if (currentVersion) {
        setSkillMdContent(currentVersion.skillMdContent);
        setInputSchema(currentVersion.inputSchema || "{}");
        setOutputSchema(currentVersion.outputSchema || "{}");
      }
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "Skill não encontrada.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchSkill(); }, [fetchSkill]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          description,
          skillMdContent,
        }),
      });
      if (!res.ok) throw new Error("Falha ao guardar.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await fetchSkill();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tens a certeza que queres eliminar esta skill? Esta ação é irreversível.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Falha ao eliminar.");
        setDeleting(false);
        return;
      }
      router.push("/skills");
    } catch {
      setError("Falha ao eliminar.");
      setDeleting(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/skills/${id}/versions`, { method: "POST" });
      if (!res.ok) throw new Error("Falha ao publicar versão.");
      await fetchSkill();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-zinc-500">
      <Loader2 className="animate-spin w-6 h-6 mr-3" /> A carregar skill...
    </div>
  );

  if (error && !skill) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
      <p className="text-red-400">{error}</p>
      <Link href="/skills" className="text-sm text-indigo-400 hover:underline">← Voltar às Skills</Link>
    </div>
  );

  const currentVersion = skill?.versions?.[0];
  const statusBadge = STATUS_BADGES[skill?.status || "draft"];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Bar */}
      <div className="shrink-0 border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link href="/skills" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{skill?.displayName}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs font-mono text-zinc-500">{skill?.slug}</span>
              {currentVersion && (
                <span className="text-xs font-mono text-zinc-600">v{currentVersion.versionNumber}</span>
              )}
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
              {skill?.sourceType === "imported_chatgpt" && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                  <Package className="w-3 h-3" /> Imported
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "..." : "Eliminar"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> A guardar...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Guardado!</>
            ) : (
              <><Save className="w-4 h-4" /> Guardar</>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="shrink-0 mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-400 font-mono">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="shrink-0 px-6 pt-4">
        <SkillTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Nome da Skill</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Descrição (trigger principal)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="Descreva quando e como esta skill deve ser usada..."
                />
                <p className="text-xs text-zinc-600">Esta descrição serve como trigger — o runtime usa-a para decidir quando ativar a skill.</p>
              </div>

              {/* Agents using this skill */}
              {skill?.agentSkills && skill.agentSkills.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    Agentes associados
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skill.agentSkills.map((as) => (
                      <Link
                        key={as.agent.id}
                        href={`/agents/${as.agent.id}`}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        {as.agent.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation */}
              <ValidationPanel skillId={id} />
            </div>
          )}

          {/* ===== INSTRUCTIONS ===== */}
          {activeTab === "instructions" && (
            <SkillMdEditor
              content={skillMdContent}
              onChange={setSkillMdContent}
            />
          )}

          {/* ===== REFERENCES ===== */}
          {activeTab === "references" && (
            <FileManager
              skillId={id}
              files={currentVersion?.files || []}
              fileType="reference"
              onFilesChange={fetchSkill}
            />
          )}

          {/* ===== ASSETS ===== */}
          {activeTab === "assets" && (
            <FileManager
              skillId={id}
              files={currentVersion?.files || []}
              fileType="asset"
              onFilesChange={fetchSkill}
            />
          )}

          {/* ===== SCRIPTS ===== */}
          {activeTab === "scripts" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Scripts Integrados
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Scripts built-in disponíveis para uso. Referenciados por nome no SKILL.md.
                </p>
              </div>
              {BUILTIN_SCRIPTS.map((script) => (
                <div
                  key={script.key}
                  className="flex items-start gap-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl"
                >
                  <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400 shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-zinc-200">{script.displayName}</span>
                      <span className="text-xs font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">{script.key}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{script.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                      <span>Input: {script.inputTypes.join(", ")}</span>
                      <span>Output: {script.outputTypes.join(", ")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== I/O CONFIG ===== */}
          {activeTab === "io" && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Input Schema (JSON)</label>
                <p className="text-xs text-zinc-600 mb-2">Define os tipos de input que esta skill aceita.</p>
                <textarea
                  rows={8}
                  value={inputSchema}
                  onChange={(e) => setInputSchema(e.target.value)}
                  spellCheck={false}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-300 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Output Schema (JSON)</label>
                <p className="text-xs text-zinc-600 mb-2">Define a estrutura esperada dos outputs gerados.</p>
                <textarea
                  rows={8}
                  value={outputSchema}
                  onChange={(e) => setOutputSchema(e.target.value)}
                  spellCheck={false}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-300 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          )}

          {/* ===== VERSIONS ===== */}
          {activeTab === "versions" && skill && (
            <VersionTimeline
              versions={skill.versions}
              currentVersionId={skill.currentVersionId}
              onPublish={handlePublish}
              publishing={publishing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
