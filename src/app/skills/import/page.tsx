"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload, ArrowLeft, ArrowRight, Loader2, CheckCircle,
  Package, FileText, Code2, FolderOpen, Sparkles,
  FileArchive, AlertTriangle, X,
} from "lucide-react";
import { FileTreePreview } from "@/components/skills/FileTreePreview";
import { CompatibilityReport } from "@/components/skills/CompatibilityReport";

type ParsedResult = {
  skillName: string;
  description: string;
  skillMdContent: string;
  openaiYaml: string | null;
  files: { path: string; category: string; sizeBytes: number; mimeType: string }[];
  fileTree: string[];
  scriptsCount: number;
  referencesCount: number;
  assetsCount: number;
  tags: string[];
};

type ValidationResult = {
  compatibility: "fully_compatible" | "partially_compatible" | "incompatible";
  issues: { severity: "error" | "warning" | "info"; code: string; message: string; path?: string }[];
  canImport: boolean;
  summary: string;
};

type ImportResponse = {
  jobId: string;
  status: string;
  parsed: ParsedResult | null;
  validation: ValidationResult | null;
  error: string | null;
};

const STEPS = [
  { id: 1, label: "Upload" },
  { id: 2, label: "Inspecionar" },
  { id: 3, label: "Validar" },
  { id: 4, label: "Confirmar" },
  { id: 5, label: "Resultado" },
];

export default function ImportSkillPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [commitResult, setCommitResult] = useState<{ skillId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishOnImport, setPublishOnImport] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".zip")) { setError("Apenas ficheiros .zip são aceites."); return; }
    if (file.size > 50 * 1024 * 1024) { setError("O ficheiro excede o tamanho máximo de 50MB."); return; }
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/skills/import", { method: "POST", body: formData });
      const data: ImportResponse = await res.json();
      if (data.error && !data.parsed) { setError(data.error); setUploading(false); return; }
      setImportResult(data); setStep(2);
    } catch { setError("Falha ao comunicar com o servidor."); }
    finally { setUploading(false); }
  };

  const handleCommit = async () => {
    if (!importResult?.jobId) return;
    setCommitting(true); setError(null);
    try {
      const res = await fetch(`/api/skills/import/${importResult.jobId}/commit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: publishOnImport }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Falha ao confirmar importação."); setCommitting(false); return; }
      setCommitResult(data); setStep(5);
    } catch { setError("Falha ao comunicar com o servidor."); }
    finally { setCommitting(false); }
  };

  const parsed = importResult?.parsed;
  const validation = importResult?.validation;
  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes}B` : bytes < 1024*1024 ? `${Math.round(bytes/1024)}KB` : `${(bytes/1024/1024).toFixed(1)}MB`;

  const btnPrimary = { display: 'flex', alignItems: 'center', gap: '6px', background: '#1E4DB7', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } as const;
  const btnSecondary = { display: 'flex', alignItems: 'center', gap: '6px', background: '#F4F2EE', border: '1px solid #E8E4DF', borderRadius: '9px', padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#4A4744' } as const;

  return (
    <div style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/skills" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7A7470', textDecoration: 'none', fontSize: '13px', fontWeight: 500, paddingBottom: '24px' }}>
        <ArrowLeft size={15} /> Voltar a Skills
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(30,77,183,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E4DB7', flexShrink: 0 }}>
          <Package size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '4px' }}>Importar Skill</h1>
          <p style={{ color: '#7A7470', fontSize: '13px' }}>Importar skill empacotada em formato ChatGPT (.zip)</p>
        </div>
      </div>

      {/* Step bar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
        {STEPS.map(s => (
          <div key={s.id} style={{ flex: 1 }}>
            <div style={{ height: '4px', borderRadius: '99px', background: step >= s.id ? '#1E4DB7' : '#E8E4DF', marginBottom: '6px', transition: 'background 0.2s' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: step >= s.id ? '#1E4DB7' : '#9A9490' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.05)', padding: '12px 14px', fontSize: '13px', color: '#DC2626', marginBottom: '20px' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex', padding: 0 }}><X size={14} /></button>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => document.getElementById("zip-input")?.click()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '48px', borderRadius: '14px', border: `2px dashed ${dragActive ? '#1E4DB7' : selectedFile ? '#2E7D52' : '#E8E4DF'}`,
              background: dragActive ? 'rgba(30,77,183,0.04)' : selectedFile ? 'rgba(46,125,82,0.04)' : '#fff',
              cursor: 'pointer', transition: 'all 0.2s', marginBottom: '20px',
            }}
          >
            <input id="zip-input" type="file" accept=".zip" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }} />
            {selectedFile ? (
              <>
                <FileArchive size={40} color="#2E7D52" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1714' }}>{selectedFile.name}</div>
                <div style={{ fontSize: '13px', color: '#7A7470', marginTop: '4px' }}>{formatSize(selectedFile.size)}</div>
                <div style={{ fontSize: '12px', color: '#9A9490', marginTop: '8px' }}>Clique para selecionar outro</div>
              </>
            ) : (
              <>
                <Upload size={40} color="#9A9490" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#4A4744' }}>Arraste o ficheiro <code style={{ color: '#1E4DB7' }}>skill.zip</code> aqui</div>
                <div style={{ fontSize: '13px', color: '#9A9490', marginTop: '4px' }}>ou clique para selecionar · máximo 50MB</div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleUpload} disabled={!selectedFile || uploading} style={{ ...btnPrimary, opacity: !selectedFile || uploading ? 0.5 : 1, cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> A processar...</> : <><ArrowRight size={14} /> Importar e Analisar</>}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && parsed && (
        <div>
          <div style={{ background: '#fff', border: '1px solid #E8E4DF', borderRadius: '14px', padding: '22px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <Sparkles size={20} color="#1E4DB7" />
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#1A1714' }}>{parsed.skillName}</div>
                <code style={{ fontSize: '11px', color: '#9A9490' }}>ChatGPT Skill Package</code>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#7A7470', lineHeight: 1.6, marginBottom: '10px' }}>{parsed.description || "Sem descrição."}</p>
            {parsed.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parsed.tags.map(tag => <span key={tag} style={{ background: 'rgba(30,77,183,0.07)', color: '#1E4DB7', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 500 }}>{tag}</span>)}
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
            {[
              { icon: FileText, label: "Referências", count: parsed.referencesCount, color: '#7B61FF' },
              { icon: FolderOpen, label: "Assets", count: parsed.assetsCount, color: '#E8608C' },
              { icon: Code2, label: "Scripts", count: parsed.scriptsCount, color: '#B45309' },
              { icon: FileText, label: "Total", count: parsed.fileTree.length, color: '#4A4744' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#fff', border: '1px solid #E8E4DF', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <stat.icon size={16} color={stat.color} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color }}>{stat.count}</div>
                <div style={{ fontSize: '11px', color: '#9A9490', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <FileTreePreview files={parsed.fileTree} />
          <div style={{ marginTop: '18px', marginBottom: '18px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A4744', marginBottom: '8px' }}>Preview SKILL.md</div>
            <pre style={{ background: '#1A1714', borderRadius: '10px', padding: '16px', fontSize: '11.5px', color: '#A8D5B5', fontFamily: 'monospace', lineHeight: 1.6, overflowX: 'auto', maxHeight: '200px', whiteSpace: 'pre-wrap' }}>
              {parsed.skillMdContent.slice(0, 2000)}
              {parsed.skillMdContent.length > 2000 && <span style={{ color: '#555' }}>{"\n\n"}... ({parsed.skillMdContent.length - 2000} caracteres)</span>}
            </pre>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => { setStep(1); setImportResult(null); setSelectedFile(null); }} style={btnSecondary}><ArrowLeft size={14} /> Voltar</button>
            <button onClick={() => setStep(3)} style={btnPrimary}><ArrowRight size={14} /> Validar</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && validation && (
        <div>
          <CompatibilityReport compatibility={validation.compatibility} issues={validation.issues} summary={validation.summary} canImport={validation.canImport} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={() => setStep(2)} style={btnSecondary}><ArrowLeft size={14} /> Voltar</button>
            <button onClick={() => setStep(4)} disabled={!validation.canImport} style={{ ...btnPrimary, opacity: !validation.canImport ? 0.5 : 1 }}><ArrowRight size={14} /> Confirmar</button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && parsed && (
        <div>
          <div style={{ background: '#F9F8F5', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>Resumo da Importação</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div><span style={{ color: '#7A7470' }}>Nome:</span> <span style={{ fontWeight: 600, color: '#1A1714' }}>{parsed.skillName}</span></div>
              <div><span style={{ color: '#7A7470' }}>Ficheiros:</span> <span style={{ color: '#1A1714' }}>{parsed.fileTree.length}</span></div>
              <div><span style={{ color: '#7A7470' }}>Source:</span> <code style={{ color: '#1E4DB7', fontSize: '12px' }}>ChatGPT ZIP</code></div>
              <div>
                <span style={{ color: '#7A7470' }}>Compat:</span>{' '}
                <span style={{ color: validation?.compatibility === 'fully_compatible' ? '#2E7D52' : validation?.compatibility === 'partially_compatible' ? '#B45309' : '#DC2626' }}>
                  {validation?.compatibility === 'fully_compatible' ? 'Total' : validation?.compatibility === 'partially_compatible' ? 'Parcial' : 'Incompatível'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '10px' }}>Opção de Importação</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[{ val: false, title: 'Importar como Draft', desc: 'Reveja e configure antes de publicar.' }, { val: true, title: 'Importar e Publicar', desc: 'Disponível imediatamente.' }].map(opt => (
                <button key={String(opt.val)} onClick={() => setPublishOnImport(opt.val)} style={{
                  textAlign: 'left', padding: '14px', borderRadius: '10px',
                  border: publishOnImport === opt.val ? '2px solid #1E4DB7' : '1px solid #E8E4DF',
                  background: publishOnImport === opt.val ? 'rgba(30,77,183,0.04)' : '#fff',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1714', marginBottom: '4px' }}>{opt.title}</div>
                  <div style={{ fontSize: '12px', color: '#7A7470' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(3)} style={btnSecondary}><ArrowLeft size={14} /> Voltar</button>
            <button onClick={handleCommit} disabled={committing} style={{ ...btnPrimary, background: '#2E7D52', opacity: committing ? 0.5 : 1 }}>
              {committing ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> A importar...</> : <><Package size={14} /> Confirmar Importação</>}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && commitResult && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(46,125,82,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <CheckCircle size={40} color="#2E7D52" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1714', marginBottom: '8px' }}>Skill Importada com Sucesso!</h2>
          <p style={{ fontSize: '14px', color: '#7A7470', maxWidth: '400px' }}>
            A skill <strong style={{ color: '#1E4DB7' }}>{parsed?.skillName}</strong> foi importada {publishOnImport ? "e publicada" : "como draft"}.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <Link href="/skills" style={{ ...btnSecondary, textDecoration: 'none' }}><ArrowLeft size={14} /> Voltar a Skills</Link>
            <Link href={`/skills/${commitResult.skillId}`} style={{ ...btnPrimary, textDecoration: 'none' }}><ArrowRight size={14} /> Ver Skill</Link>
          </div>
        </div>
      )}
    </div>
  );
}
