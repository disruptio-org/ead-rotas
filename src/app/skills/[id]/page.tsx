"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2, Save, ArrowLeft, Trash2, Loader2, Check,
  Bot, Package, Upload
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

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  draft:      { bg: 'rgba(0,0,0,0.05)',      text: '#4A4744',  label: 'Draft' },
  validated:  { bg: 'rgba(30,77,183,0.08)',  text: '#1E4DB7',  label: 'Validated' },
  published:  { bg: 'rgba(46,125,82,0.08)',  text: '#2E7D52',  label: 'Published' },
  deprecated: { bg: 'rgba(180,83,9,0.08)',   text: '#B45309',  label: 'Deprecated' },
  archived:   { bg: 'rgba(220,38,38,0.08)',  text: '#DC2626',  label: 'Archived' },
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
        body: JSON.stringify({ displayName, description, skillMdContent }),
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#7A7470' }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} /> A carregar skill...
    </div>
  );

  if (error && !skill) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: '#9A9490' }}>
      <p style={{ color: '#DC2626' }}>{error}</p>
      <Link href="/skills" style={{ color: '#1E4DB7', fontSize: '13px', textDecoration: 'none' }}>← Voltar às Skills</Link>
    </div>
  );

  const currentVersion = skill?.versions?.[0];
  const sc = STATUS_COLORS[skill?.status || "draft"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F4F2EE' }}>
      {/* Header */}
      <div style={{
        height: '56px', background: '#fff', borderBottom: '1px solid #E8E4DF',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/skills" style={{
            width: '32px', height: '32px', borderRadius: '8px', background: '#F4F2EE',
            border: '1px solid #E8E4DF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#4A4744', textDecoration: 'none',
          }}>
            <ArrowLeft size={15} />
          </Link>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'rgba(30,77,183,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#1E4DB7',
          }}>
            <Code2 size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1714' }}>{skill?.displayName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <code style={{ fontSize: '11px', color: '#9A9490', fontFamily: 'monospace' }}>{skill?.slug}</code>
              {currentVersion && (
                <span style={{ background: '#F4F2EE', color: '#6B6764', borderRadius: '4px', padding: '1px 6px', fontSize: '10.5px', fontFamily: 'monospace' }}>
                  v{currentVersion.versionNumber}
                </span>
              )}
              <span style={{ background: sc.bg, color: sc.text, borderRadius: '20px', padding: '2px 8px', fontSize: '10.5px', fontWeight: 600 }}>
                {sc.label}
              </span>
              {skill?.sourceType === "imported_chatgpt" && (
                <span style={{ background: 'rgba(180,83,9,0.08)', color: '#B45309', borderRadius: '4px', padding: '2px 7px', fontSize: '10.5px', fontWeight: 500 }}>
                  Importado
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDelete} disabled={deleting} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: '1px solid rgba(220,38,38,0.25)',
            color: '#DC2626', borderRadius: '8px', padding: '7px 14px',
            fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Trash2 size={13} /> Eliminar
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#1E4DB7', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '7px 16px',
            fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {saved ? <><Check size={14} /> Guardado!</> : <><Save size={14} /> Guardar</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <SkillTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Overview */}
          {activeTab === "overview" && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Nome da Skill
                  </label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '100%', background: '#fff', border: '1px solid #E8E4DF',
                      borderRadius: '9px', padding: '10px 14px', fontSize: '13.5px',
                      color: '#1A1714', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Descrição (trigger)
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: '100%', background: '#fff', border: '1px solid #E8E4DF',
                      borderRadius: '9px', padding: '10px 14px', fontSize: '13px',
                      color: '#1A1714', fontFamily: 'inherit', outline: 'none',
                      resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Agentes associados
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {skill?.agentSkills?.length === 0 && (
                      <p style={{ fontSize: '12.5px', color: '#9A9490', fontStyle: 'italic' }}>Nenhum agente associado.</p>
                    )}
                    {skill?.agentSkills?.map((as_) => (
                      <div key={as_.agent.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 12px', background: '#F9F8F5', borderRadius: '8px',
                      }}>
                        <Bot size={13} color="#D4460E" />
                        <span style={{ fontSize: '13px', color: '#4A4744' }}>{as_.agent.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <ValidationPanel skillId={id} />
              </div>
            </div>
          )}

          {/* Instructions */}
          {activeTab === "instructions" && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                SKILL.md — Instruções
              </label>
              <SkillMdEditor value={skillMdContent} onChange={setSkillMdContent} />
            </div>
          )}

          {/* References */}
          {activeTab === "references" && currentVersion && (
            <FileManager
              skillId={id}
              versionId={currentVersion.id}
              fileType="reference"
              files={currentVersion.files.filter(f => f.fileType === "reference")}
              onRefresh={fetchSkill}
            />
          )}

          {/* Assets */}
          {activeTab === "assets" && currentVersion && (
            <FileManager
              skillId={id}
              versionId={currentVersion.id}
              fileType="asset"
              files={currentVersion.files.filter(f => f.fileType === "asset")}
              onRefresh={fetchSkill}
            />
          )}

          {/* Scripts */}
          {activeTab === "scripts" && (
            <div>
              {BUILTIN_SCRIPTS.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '200px', color: '#9A9490', border: '2px dashed #E8E4DF', borderRadius: '12px',
                }}>
                  <Code2 size={24} />
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#4A4744', marginTop: '12px' }}>Nenhum script disponível</div>
                  <div style={{ fontSize: '12.5px', color: '#9A9490', marginTop: '4px' }}>Os scripts são definidos na importação da skill.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {BUILTIN_SCRIPTS.map((script) => (
                    <div key={script.id} style={{
                      background: '#fff', border: '1px solid #E8E4DF', borderRadius: '10px', padding: '14px 16px',
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '4px' }}>{script.name}</div>
                      <div style={{ fontSize: '12px', color: '#7A7470' }}>{script.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* I/O Config */}
          {activeTab === "io" && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Input Schema (JSON)
                </label>
                <textarea
                  rows={10}
                  value={inputSchema}
                  onChange={(e) => setInputSchema(e.target.value)}
                  style={{
                    width: '100%', background: '#1A1714', border: 'none', borderRadius: '12px',
                    padding: '16px 20px', fontSize: '12.5px', color: '#A8D5B5',
                    fontFamily: 'monospace', outline: 'none', resize: 'vertical',
                    lineHeight: 1.65, boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Output Schema (JSON)
                </label>
                <textarea
                  rows={10}
                  value={outputSchema}
                  onChange={(e) => setOutputSchema(e.target.value)}
                  style={{
                    width: '100%', background: '#1A1714', border: 'none', borderRadius: '12px',
                    padding: '16px 20px', fontSize: '12.5px', color: '#A8D5B5',
                    fontFamily: 'monospace', outline: 'none', resize: 'vertical',
                    lineHeight: 1.65, boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          {/* Versions */}
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
