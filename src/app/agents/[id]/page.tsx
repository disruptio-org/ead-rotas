"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bot, ArrowLeft, Paperclip, Send,
  Loader2, XCircle, Code2, X, Check, ChevronDown
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

  const activeSkill = agent?.agentSkills?.[0];

  if (!agent) return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#7A7470' }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} /> A carregar...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F4F2EE' }}>
      {/* Header */}
      <div style={{
        height: '56px', background: '#fff', borderBottom: '1px solid #E8E4DF',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0, position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/agents" style={{
            width: '32px', height: '32px', borderRadius: '8px', background: '#F4F2EE',
            border: '1px solid #E8E4DF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#4A4744', textDecoration: 'none',
          }}>
            <ArrowLeft size={16} />
          </Link>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'rgba(212,70,14,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#D4460E',
          }}>
            <Bot size={16} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#1A1714' }}>{agent.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {activeSkill && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(30,77,183,0.08)', color: '#1E4DB7',
              borderRadius: '20px', padding: '5px 10px', fontSize: '12px', fontWeight: 600,
            }}>
              <Code2 size={12} /> {activeSkill.skill.displayName}
              <button onClick={() => unbindSkill(activeSkill.skillId)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#1E4DB7', display: 'flex', padding: 0,
              }}>
                <X size={11} />
              </button>
            </div>
          )}
          <button onClick={openSkillPicker} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#F4F2EE', border: '1px solid #E8E4DF', borderRadius: '8px',
            padding: '5px 10px', fontSize: '12px', color: '#4A4744', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {activeSkill ? 'alterar' : '+ skill'} <ChevronDown size={12} />
          </button>

          {/* Skill Picker Dropdown */}
          {showSkillPicker && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: '240px', background: '#fff', border: '1px solid #E8E4DF',
              borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 14px', fontSize: '11px', fontWeight: 600,
                color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em',
                borderBottom: '1px solid #E8E4DF',
              }}>
                Selecionar Skill
              </div>
              {availableSkills.length === 0 && (
                <p style={{ padding: '16px', fontSize: '12px', color: '#9A9490', textAlign: 'center' }}>Nenhuma skill disponível.</p>
              )}
              {availableSkills.map((skill) => {
                const alreadyBound = agent.agentSkills?.some((as_) => as_.skillId === skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => !alreadyBound && bindSkill(skill.id)}
                    disabled={bindingSkill || alreadyBound}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '10px 14px', background: alreadyBound ? 'rgba(30,77,183,0.06)' : 'none',
                      border: 'none', cursor: alreadyBound ? 'default' : 'pointer',
                      fontSize: '13px', color: alreadyBound ? '#1E4DB7' : '#1A1714',
                      fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <Code2 size={13} /> {skill.displayName}
                    {alreadyBound && <Check size={12} style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* History sidebar */}
        <div style={{
          width: '260px', background: '#fff', borderRight: '1px solid #E8E4DF',
          overflowY: 'auto', flexShrink: 0,
        }}>
          <div style={{
            padding: '16px 16px 10px', fontSize: '11px', fontWeight: 600,
            color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em',
            position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #E8E4DF',
          }}>
            Histórico
          </div>
          {agent.executions?.length === 0 && (
            <p style={{ padding: '32px 16px', fontSize: '12px', color: '#9A9490', textAlign: 'center', fontStyle: 'italic' }}>
              Nenhuma execução registada.
            </p>
          )}
          {agent.executions?.map((exec) => (
            <div
              key={exec.id}
              onClick={() => {
                try {
                  setLastResult({
                    id: exec.id,
                    status: exec.status,
                    summary: exec.summary,
                    rawOutput: exec.rawOutput,
                  });
                  setErrorMsg(null);
                } catch {}
              }}
              style={{
                padding: '12px 16px', borderBottom: '1px solid #F4F2EE',
                cursor: 'pointer', transition: 'background 0.12s',
                ...(lastResult?.id === exec.id ? { background: 'rgba(212,70,14,0.04)', borderLeft: '3px solid #D4460E' } : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                  background: exec.status === 'completed' ? '#2E7D52' : exec.status === 'running' ? '#1E4DB7' : '#DC2626',
                }} />
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: exec.status === 'completed' ? '#2E7D52' : exec.status === 'running' ? '#1E4DB7' : '#DC2626',
                }}>
                  {exec.status === 'completed' ? 'Concluído' : exec.status === 'running' ? 'A correr' : 'Erro'}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#9A9490' }}>
                  {new Date(exec.createdAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p style={{
                fontSize: '12px', color: '#7A7470', lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
              }}>
                {exec.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Results area */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#F9F8F5' }}>
          {!lastResult && !errorMsg && !executing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(212,70,14,0.07)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#D4460E',
              }}>
                <Bot size={28} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1714' }}>Pronto para executar</div>
              <div style={{ fontSize: '13px', color: '#9A9490' }}>Escreva a sua mensagem em baixo e carregue em Executar.</div>
            </div>
          )}

          {executing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ color: '#D4460E', marginBottom: 12 }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <div style={{ color: '#7A7470', fontSize: '14px' }}>A processar dados e consultar o modelo...</div>
            </div>
          )}

          {errorMsg && !executing && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '60px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(220,38,38,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <XCircle size={20} color="#DC2626" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#DC2626' }}>Execução falhada</div>
              <pre style={{
                background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '8px', padding: '12px 16px', fontSize: '12px',
                fontFamily: 'monospace', color: '#B91C1C', maxWidth: '500px', whiteSpace: 'pre-wrap',
              }}>
                {errorMsg}
              </pre>
            </div>
          )}

          {lastResult && !executing && (
            <div style={{ padding: '24px', maxWidth: '680px', margin: '0 auto' }}>
              <ResultPanel result={lastResult} />
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div style={{ background: '#fff', borderTop: '1px solid #E8E4DF', padding: '14px 20px', flexShrink: 0 }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {fileName && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(212,70,14,0.08)', color: '#D4460E',
              borderRadius: '20px', padding: '4px 10px', fontSize: '12px',
              fontWeight: 500, marginBottom: '8px',
            }}>
              📎 {fileName}
              <button onClick={() => { setFileName(""); setFileUrl(""); }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#D4460E', display: 'flex', padding: 0,
              }}>
                <X size={10} />
              </button>
            </div>
          )}
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '10px',
            background: '#F9F8F5', border: '1px solid #E8E4DF', borderRadius: '12px', padding: '10px 12px',
          }}>
            <label style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A9490', padding: '4px', display: 'flex', flexShrink: 0 }}>
              <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileUpload} />
              <Paperclip size={16} />
            </label>
            <textarea
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: '13.5px', color: '#1A1714', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.55,
              }}
              rows={2}
              placeholder="Escreva aqui a sua instrução ou pergunta..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') executeSkill(); }}
            />
            <button
              onClick={executeSkill}
              disabled={executing || !instruction.trim()}
              style={{
                background: (executing || !instruction.trim()) ? '#E8E4DF' : '#D4460E',
                color: (executing || !instruction.trim()) ? '#9A9490' : '#fff',
                border: 'none', borderRadius: '8px', padding: '8px 16px',
                fontSize: '13px', fontWeight: 600,
                cursor: (executing || !instruction.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                flexShrink: 0, fontFamily: 'inherit', transition: 'background 0.15s',
              }}
            >
              <Send size={15} /> Executar
            </button>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#B4B0AC', marginTop: '6px' }}>⌘ + Enter para executar</div>
        </div>
      </div>
    </div>
  );
}
