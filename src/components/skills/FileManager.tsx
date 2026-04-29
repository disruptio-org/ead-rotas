"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, File, Trash2, FolderOpen, FileText, Image, FileCode } from "lucide-react";

interface FileRecord {
  id: string;
  path: string;
  fileType: string;
  mimeType: string | null;
  storagePath: string;
}

interface FileManagerProps {
  skillId: string;
  files: FileRecord[];
  fileType: "reference" | "asset" | "script";
  onFilesChange: () => void;
}

const FILE_TYPE_ICONS: Record<string, typeof File> = {
  reference: FileText,
  asset: Image,
  script: FileCode,
};

const FILE_TYPE_LABELS: Record<string, string> = {
  reference: "Referências",
  asset: "Assets",
  script: "Scripts",
};

const FILE_TYPE_DESCRIPTIONS: Record<string, string> = {
  reference: "Documentos de conhecimento auxiliar — regras de negócio, schemas, glossários.",
  asset: "Ficheiros para output ou apoio — templates DOCX, logos, imagens.",
  script: "Lógica executável registada — parsers, geradores, validadores.",
};

export function FileManager({ skillId, files, fileType, onFilesChange }: FileManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const Icon = FILE_TYPE_ICONS[fileType] || File;
  const filteredFiles = files.filter((f) => f.fileType === fileType);

  const handleUpload = useCallback(
    async (fileList: FileList) => {
      setUploading(true);
      try {
        for (const file of Array.from(fileList)) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileType", fileType);

          await fetch(`/api/skills/${skillId}/files`, {
            method: "POST",
            body: formData,
          });
        }
        onFilesChange();
      } catch (e) {
        console.error("Upload failed:", e);
      } finally {
        setUploading(false);
      }
    },
    [skillId, fileType, onFilesChange]
  );

  const handleDelete = async (fileId: string) => {
    if (!confirm("Eliminar este ficheiro?")) return;
    try {
      await fetch(`/api/skills/${skillId}/files?fileId=${fileId}`, {
        method: "DELETE",
      });
      onFilesChange();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Icon className="w-4 h-4 text-indigo-400" />
          {FILE_TYPE_LABELS[fileType]}
        </h3>
        <p className="text-xs text-zinc-600 mt-1">{FILE_TYPE_DESCRIPTIONS[fileType]}</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
        {uploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
        ) : (
          <>
            <Upload className="w-6 h-6 text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-500">
              Arraste ficheiros aqui ou <span className="text-indigo-400">clique para selecionar</span>
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {filteredFiles.length > 0 ? (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 group hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-zinc-300 truncate font-mono">{file.path}</p>
                  {file.mimeType && (
                    <p className="text-xs text-zinc-600">{file.mimeType}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className="shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-zinc-600 text-sm">
          <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Nenhum ficheiro de {FILE_TYPE_LABELS[fileType].toLowerCase()} adicionado.
        </div>
      )}
    </div>
  );
}
