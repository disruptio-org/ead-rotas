"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  Package,
  FileText,
  Code2,
  FolderOpen,
  Sparkles,
  FileArchive,
  AlertTriangle,
  X,
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
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setError("Apenas ficheiros .zip são aceites.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("O ficheiro excede o tamanho máximo de 50MB.");
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/skills/import", {
        method: "POST",
        body: formData,
      });

      const data: ImportResponse = await res.json();

      if (data.error && !data.parsed) {
        setError(data.error);
        setUploading(false);
        return;
      }

      setImportResult(data);
      setStep(2);
    } catch {
      setError("Falha ao comunicar com o servidor.");
    } finally {
      setUploading(false);
    }
  };

  const handleCommit = async () => {
    if (!importResult?.jobId) return;
    setCommitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/skills/import/${importResult.jobId}/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: publishOnImport }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Falha ao confirmar importação.");
        setCommitting(false);
        return;
      }

      setCommitResult(data);
      setStep(5);
    } catch {
      setError("Falha ao comunicar com o servidor.");
    } finally {
      setCommitting(false);
    }
  };

  const parsed = importResult?.parsed;
  const validation = importResult?.validation;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="p-10 w-full h-full">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back link */}
        <Link
          href="/skills"
          className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar a Skills
        </Link>

        {/* Header */}
        <div className="border-b border-zinc-800 pb-6 flex items-center space-x-4">
          <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-200 to-indigo-500 bg-clip-text text-transparent tracking-tight">
              Importar Skill
            </h1>
            <p className="text-zinc-400 mt-1">
              Importar skill empacotada em formato ChatGPT (.zip)
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1 space-y-1.5">
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  step >= s.id ? "bg-indigo-500" : "bg-zinc-800"
                }`}
              />
              <span
                className={`text-[10px] font-medium uppercase tracking-wider ${
                  step >= s.id ? "text-indigo-400" : "text-zinc-700"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ===== STEP 1: Upload ===== */}
        {step === 1 && (
          <div className="space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center py-16 px-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/5 scale-[1.01]"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500 hover:bg-zinc-900/50"
              }`}
              onClick={() => document.getElementById("zip-input")?.click()}
            >
              <input
                id="zip-input"
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
              />

              {selectedFile ? (
                <>
                  <FileArchive className="w-12 h-12 text-emerald-400 mb-4" />
                  <p className="text-lg font-bold text-white">{selectedFile.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    {formatSize(selectedFile.size)}
                  </p>
                  <p className="text-xs text-zinc-600 mt-3">
                    Clique para selecionar outro ficheiro
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-zinc-600 mb-4" />
                  <p className="text-lg font-medium text-zinc-300">
                    Arraste o ficheiro <code className="text-indigo-400">skill.zip</code> aqui
                  </p>
                  <p className="text-sm text-zinc-600 mt-2">
                    ou clique para selecionar • máximo 50MB
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> A processar...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" /> Importar e Analisar
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: Inspect ===== */}
        {step === 2 && parsed && (
          <div className="space-y-6">
            {/* Skill Summary */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{parsed.skillName}</h2>
                  <span className="text-xs font-mono text-zinc-600">
                    ChatGPT Skill Package
                  </span>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {parsed.description || "Sem descrição."}
              </p>
              {parsed.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {parsed.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: FileText, label: "Referências", count: parsed.referencesCount, color: "text-purple-400" },
                { icon: FolderOpen, label: "Assets", count: parsed.assetsCount, color: "text-pink-400" },
                { icon: Code2, label: "Scripts", count: parsed.scriptsCount, color: "text-amber-400" },
                { icon: FileText, label: "Total Ficheiros", count: parsed.fileTree.length, color: "text-zinc-300" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center"
                >
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white">{stat.count}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* File Tree */}
            <FileTreePreview files={parsed.fileTree} />

            {/* SKILL.md Preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-300">Preview SKILL.md</h3>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-h-64 overflow-y-auto">
                <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">
                  {parsed.skillMdContent.slice(0, 2000)}
                  {parsed.skillMdContent.length > 2000 && (
                    <span className="text-zinc-600">
                      {"\n\n"}... ({parsed.skillMdContent.length - 2000} caracteres adicionais)
                    </span>
                  )}
                </pre>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => { setStep(1); setImportResult(null); setSelectedFile(null); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl transition-colors shadow-sm"
              >
                <ArrowRight className="w-4 h-4" /> Validar
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Validate ===== */}
        {step === 3 && validation && (
          <div className="space-y-6">
            <CompatibilityReport
              compatibility={validation.compatibility}
              issues={validation.issues}
              summary={validation.summary}
              canImport={validation.canImport}
            />

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!validation.canImport}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
              >
                <ArrowRight className="w-4 h-4" /> Confirmar
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: Confirm ===== */}
        {step === 4 && parsed && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                Resumo da Importação
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500">Nome:</span>{" "}
                  <span className="text-white font-medium">{parsed.skillName}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Ficheiros:</span>{" "}
                  <span className="text-white">{parsed.fileTree.length}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Source:</span>{" "}
                  <span className="text-indigo-400 font-mono text-xs">ChatGPT ZIP</span>
                </div>
                <div>
                  <span className="text-zinc-500">Compatibilidade:</span>{" "}
                  <span
                    className={
                      validation?.compatibility === "fully_compatible"
                        ? "text-emerald-400"
                        : validation?.compatibility === "partially_compatible"
                        ? "text-amber-400"
                        : "text-red-400"
                    }
                  >
                    {validation?.compatibility === "fully_compatible"
                      ? "Total"
                      : validation?.compatibility === "partially_compatible"
                      ? "Parcial"
                      : "Incompatível"}
                  </span>
                </div>
              </div>
            </div>

            {/* Import Option */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-zinc-300">Opção de Importação</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPublishOnImport(false)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    !publishOnImport
                      ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                  }`}
                >
                  <div className="text-sm font-bold text-zinc-200 mb-1">
                    Importar como Draft
                  </div>
                  <div className="text-xs text-zinc-500">
                    Reveja e configure antes de publicar.
                  </div>
                </button>
                <button
                  onClick={() => setPublishOnImport(true)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    publishOnImport
                      ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                  }`}
                >
                  <div className="text-sm font-bold text-zinc-200 mb-1">
                    Importar e Publicar
                  </div>
                  <div className="text-xs text-zinc-500">
                    Disponível imediatamente para uso.
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button
                onClick={handleCommit}
                disabled={committing}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
              >
                {committing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> A importar...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" /> Confirmar Importação
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 5: Result ===== */}
        {step === 5 && commitResult && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <div className="bg-emerald-500/10 p-6 rounded-3xl">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Skill Importada com Sucesso!
                </h2>
                <p className="text-zinc-400 max-w-md">
                  A skill <strong className="text-indigo-400">{parsed?.skillName}</strong> foi
                  importada para a sua biblioteca{" "}
                  {publishOnImport ? "e publicada" : "como draft"}.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link
                  href="/skills"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar a Skills
                </Link>
                <Link
                  href={`/skills/${commitResult.skillId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl transition-colors shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" /> Ver Skill Importada
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
