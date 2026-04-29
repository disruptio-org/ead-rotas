"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bot, ArrowLeft, Paperclip, Send,
  Loader2, XCircle,
  Code2, X
} from "lucide-react";
import { runSkill } from "@/app/actions/executionEngine";
import { ResultPanel } from "@/components/ResultPanel";
import type { ExecutionResult } from "@/components/ResultPanel";

type Agent = {
  id: string;
  name: string;
  description: string;
  systemInstructions: string;
  agentSkills: { skillId: string; skill: { id: string; displayName: string; sourceType?: string } }[];
  executions: {
    id: string;
    status: string;
    summary: string;
    rawOutput: string | null;
    createdAt: string;
  }[];
};

type SkillOption = {
  id: string;
  displayName: string;
  slug: string;
  sourceType?: string;
  status: string;
};

// ExecutionResult type and ResultPanel are now imported from @/components/ResultPanel

export default function AgentExecutionWorkspace() {
  const params = useParams();
  const id = params.id as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [instruction, setInstruction] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [executing, setExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  const [bindingSkill, setBindingSkill] = useState(false);

  const fetchAgent = () =>
    fetch(`/api/agents/${id}`)
      .then((res) => res.json())
      .then((data) => setAgent(data));

  useEffect(() => { fetchAgent(); }, [id]);

  const openSkillPicker = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setAvailableSkills(data);
      setShowSkillPicker(true);
    } catch {
      setErrorMsg("Falha ao carregar skills.");
    }
  };

  const bindSkill = async (skillId: string) => {
    setBindingSkill(true);
    try {
      const res = await fetch(`/api/agents/${id}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      });
      if (!res.ok) throw new Error("Failed to bind skill");
      await fetchAgent();
      setShowSkillPicker(false);
    } catch {
      setErrorMsg("Falha ao associar skill.");
    } finally {
      setBindingSkill(false);
    }
  };

  const unbindSkill = async (skillId: string) => {
    try {
      await fetch(`/api/agents/${id}/skills?skillId=${skillId}`, { method: "DELETE" });
      await fetchAgent();
    } catch {
      setErrorMsg("Falha ao remover skill.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => setFileUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const executeSkill = async () => {
    if (!agent) return;
    const activeSkillId = agent.agentSkills?.[0]?.skillId;
    if (!activeSkillId) {
      setErrorMsg("Nenhuma skill associada a este agente.");
      return;
    }
    if (!instruction.trim()) {
      setErrorMsg("Por favor escreva instruções antes de executar.");
      return;
    }

    setExecuting(true);
    setLastResult(null);
    setErrorMsg(null);

    try {
      const result = await runSkill(agent.id, activeSkillId, instruction, fileUrl || undefined);
      setLastResult(result as ExecutionResult);
      await fetchAgent();
    } catch (e: any) {
      setErrorMsg(e.message || "Erro desconhecido na execução.");
    } finally {
      setExecuting(false);
      setInstruction("");
    }
  };

  if (!agent) return (
    <div className="p-10 flex justify-center items-center h-full text-zinc-500">
      <Loader2 className="w-6 h-6 animate-spin mr-3" /> A carregar...
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="shrink-0 border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <Link href="/agents" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{agent.name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-zinc-500">
                Skill activa:{" "}
                {agent.agentSkills?.[0] ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-indigo-400 font-medium">
                      {agent.agentSkills[0].skill?.displayName}
                    </span>
                    <button
                      onClick={() => unbindSkill(agent.agentSkills[0].skillId)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                      title="Remover skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={openSkillPicker}
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Nenhuma skill associada — clique para associar
                  </button>
                )}
              </p>
              {agent.agentSkills?.[0] && (
                <button
                  onClick={openSkillPicker}
                  className="text-[10px] text-zinc-600 hover:text-indigo-400 transition-colors"
                >
                  (alterar)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skill Picker Dropdown */}
        {showSkillPicker && (
          <div className="relative">
            <div className="absolute right-0 top-0 z-50 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <span className="text-sm font-semibold text-zinc-200">Associar Skill</span>
                <button onClick={() => setShowSkillPicker(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {availableSkills.length === 0 && (
                  <p className="text-xs text-zinc-600 p-4 text-center">Nenhuma skill disponível.</p>
                )}
                {availableSkills.map((skill) => {
                  const alreadyBound = agent.agentSkills?.some((as) => as.skillId === skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => !alreadyBound && bindSkill(skill.id)}
                      disabled={bindingSkill || alreadyBound}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-zinc-800/40 last:border-0 ${
                        alreadyBound
                          ? "opacity-40 cursor-not-allowed bg-zinc-800/30"
                          : "hover:bg-zinc-800/60 cursor-pointer"
                      }`}
                    >
                      <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400 shrink-0">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-200 truncate">{skill.displayName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-zinc-600">{skill.slug}</span>
                          {skill.sourceType === "imported_chatgpt" && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              Imported
                            </span>
                          )}
                        </div>
                      </div>
                      {alreadyBound && (
                        <span className="text-[10px] text-emerald-400 font-medium">Activa</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Board */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: History */}
        <div className="w-72 shrink-0 border-r border-zinc-800 bg-zinc-950/40 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800/60">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Histórico</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {agent.executions?.length === 0 && (
              <p className="text-zinc-600 text-xs italic text-center mt-8">Nenhuma execução registada.</p>
            )}
            {agent.executions?.map((exec) => (
              <div
                key={exec.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 cursor-pointer hover:border-emerald-500/30 transition-all"
                onClick={() => {
                  try {
                    setLastResult({
                      id: exec.id,
                      status: exec.status,
                      summary: exec.summary,
                      rawOutput: exec.rawOutput,
                    });
                  } catch {}
                }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    exec.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : exec.status === "running"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {exec.status}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {new Date(exec.createdAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{exec.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat + Results */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Result area */}
          <div className="flex-1 overflow-y-auto p-6">
            {!lastResult && !errorMsg && !executing && (
              <div className="max-w-xl mx-auto text-center space-y-4 mt-12">
                <div className="inline-flex bg-zinc-800/60 p-5 rounded-full border border-zinc-700/40 shadow-xl">
                  <Bot className="w-10 h-10 text-zinc-500" />
                </div>
                <h2 className="text-xl font-bold text-zinc-400">Pronto para executar</h2>
                <p className="text-zinc-600 text-sm max-w-sm mx-auto">
                  Anexe o Excel diário, escreva as instruções do dia, e clique em Executar.
                </p>
              </div>
            )}

            {executing && (
              <div className="max-w-xl mx-auto text-center mt-12 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
                <p className="text-zinc-400 font-medium">A processar dados e consultar o modelo...</p>
                <p className="text-zinc-600 text-sm">Pode demorar alguns segundos.</p>
              </div>
            )}

            {errorMsg && !executing && (
              <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-sm font-semibold text-red-300">Erro na execução</p>
                  </div>
                  <p className="text-xs font-mono text-red-400 bg-red-950/30 rounded-lg p-3 border border-red-500/20">
                    {errorMsg}
                  </p>
                </div>
              </div>
            )}

            {lastResult && !executing && (
              <div className="max-w-2xl mx-auto">
                <ResultPanel result={lastResult} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="shrink-0 p-4 bg-zinc-950 border-t border-zinc-800/80">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col space-y-2 p-3 bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-xl focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
                <textarea
                  rows={2}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) executeSkill();
                  }}
                  placeholder="Com base no documento em anexo, dê-me o planeamento de rotas..."
                  className="w-full bg-transparent resize-none border-0 text-white placeholder-zinc-600 focus:outline-none px-2 py-1 text-sm"
                />
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer text-zinc-500 hover:text-white hover:bg-zinc-800 p-2 rounded-xl transition-colors">
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
                      <Paperclip className="w-4 h-4" />
                    </label>
                    {fileName && (
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 max-w-[200px] truncate">
                        📎 {fileName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={executeSkill}
                    disabled={executing || !instruction.trim()}
                    className="flex items-center bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-950 px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                  >
                    {executing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />A processar...</>
                    ) : (
                      <>Executar <Send className="w-4 h-4 ml-2" /></>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-700 mt-2 text-center">⌘+Enter para executar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
