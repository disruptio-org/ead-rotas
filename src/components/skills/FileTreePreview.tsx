"use client";

import { FileText, Folder, Code2, Image, FileSpreadsheet, File } from "lucide-react";

interface FileTreePreviewProps {
  files: string[];
}

const CAT_COLORS: Record<string, string> = {
  "SKILL.md": "#2E7D52",
  agents:     "#1E4DB7",
  scripts:    "#B45309",
  references: "#7B61FF",
  assets:     "#E8608C",
};

function getIcon(filePath: string) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "md": return <FileText size={14} />;
    case "py": case "js": case "ts": case "sh": return <Code2 size={14} />;
    case "yaml": case "yml": case "json": return <FileText size={14} />;
    case "png": case "jpg": case "jpeg": case "svg": return <Image size={14} />;
    case "xlsx": case "csv": return <FileSpreadsheet size={14} />;
    case "docx": return <FileText size={14} />;
    default: return <File size={14} />;
  }
}

function getColor(filePath: string): string {
  if (filePath === "SKILL.md") return CAT_COLORS["SKILL.md"];
  const topFolder = filePath.split("/")[0];
  return CAT_COLORS[topFolder] || "#4A4744";
}

function buildTree(files: string[]): Map<string, string[]> {
  const tree = new Map<string, string[]>();
  for (const file of files) {
    const parts = file.split("/");
    if (parts.length === 1) {
      if (!tree.has("__root__")) tree.set("__root__", []);
      tree.get("__root__")!.push(file);
    } else {
      const folder = parts[0];
      if (!tree.has(folder)) tree.set(folder, []);
      tree.get(folder)!.push(parts.slice(1).join("/"));
    }
  }
  return tree;
}

export function FileTreePreview({ files }: FileTreePreviewProps) {
  const tree = buildTree(files);
  const sorted = Array.from(tree.keys()).sort((a, b) => {
    if (a === "__root__") return -1;
    if (b === "__root__") return 1;
    return a.localeCompare(b);
  });

  return (
    <div style={{
      background: '#1A1714', borderRadius: '10px', padding: '16px',
      fontFamily: 'monospace', fontSize: '12.5px',
    }}>
      <div style={{ fontSize: '10px', color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: '10px', fontFamily: 'inherit' }}>
        Estrutura do Arquivo
      </div>
      {sorted.map((folder) => {
        const folderFiles = tree.get(folder)!;
        if (folder === "__root__") {
          return folderFiles.map((file) => (
            <div key={file} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 6px', color: getColor(file) }}>
              {getIcon(file)} <span>{file}</span>
            </div>
          ));
        }
        const color = CAT_COLORS[folder] || "#7A7470";
        return (
          <div key={folder}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 6px', color, fontWeight: 600 }}>
              <Folder size={14} /> {folder}/{' '}
              <span style={{ color: '#555', fontWeight: 400, fontSize: '11px' }}>({folderFiles.length})</span>
            </div>
            <div style={{ marginLeft: '18px', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '10px' }}>
              {folderFiles.map((file) => (
                <div key={`${folder}/${file}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 6px', color, opacity: 0.75, fontSize: '11.5px' }}>
                  {getIcon(file)} <span>{file}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
