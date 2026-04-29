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
  versionId: string;
  files: FileRecord[];
  fileType: "reference" | "asset" | "script";
  onRefresh: () => void;
  // Legacy support
  onFilesChange?: () => void;
}

const FILE_TYPE_LABELS: Record<string, string> = {
  reference: "Documentos de Referência",
  asset: "Assets",
  script: "Scripts",
};

export function FileManager({ skillId, files, fileType, onRefresh, onFilesChange }: FileManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const refresh = onRefresh || onFilesChange || (() => {});
  const filteredFiles = files.filter((f) => f.fileType === fileType);

  const handleUpload = useCallback(
    async (fileList: FileList) => {
      setUploading(true);
      try {
        for (const file of Array.from(fileList)) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileType", fileType);
          await fetch(`/api/skills/${skillId}/files`, { method: "POST", body: formData });
        }
        refresh();
      } catch (e) {
        console.error("Upload failed:", e);
      } finally {
        setUploading(false);
      }
    },
    [skillId, fileType, refresh]
  );

  const handleDelete = async (fileId: string) => {
    if (!confirm("Eliminar este ficheiro?")) return;
    try {
      await fetch(`/api/skills/${skillId}/files?fileId=${fileId}`, { method: "DELETE" });
      refresh();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#4A4744', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {FILE_TYPE_LABELS[fileType]}
        </label>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#F4F2EE', border: '1px solid #E8E4DF', borderRadius: '7px',
            padding: '6px 12px', fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit', color: '#4A4744',
          }}
        >
          <Upload size={13} /> Adicionar ficheiro
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />

      {/* Drop zone shown when dragging */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#1E4DB7' : '#E8E4DF'}`,
          borderRadius: '12px', padding: '24px',
          display: filteredFiles.length === 0 || dragActive ? 'flex' : 'none',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
          background: dragActive ? 'rgba(30,77,183,0.04)' : 'transparent',
          marginBottom: '14px',
        }}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E4DB7" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : (
          <>
            <FolderOpen size={24} color="#9A9490" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '13px', color: '#9A9490' }}>
              {filteredFiles.length === 0 ? `Nenhum ficheiro de ${FILE_TYPE_LABELS[fileType].toLowerCase()} adicionado.` : 'Arraste ficheiros aqui'}
            </p>
          </>
        )}
      </div>

      {/* File list */}
      {filteredFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredFiles.map((file) => (
            <div key={file.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', background: '#fff', border: '1px solid #E8E4DF',
              borderRadius: '8px',
            }}>
              <FileText size={14} color="#9A9490" />
              <span style={{ fontSize: '13px', color: '#4A4744', flex: 1 }}>{file.path}</span>
              <button onClick={() => handleDelete(file.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex', padding: 0,
              }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
