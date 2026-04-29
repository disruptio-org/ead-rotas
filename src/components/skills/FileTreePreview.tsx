"use client";

import { FileText, Folder, Code2, Image, FileSpreadsheet, File } from "lucide-react";

interface FileTreePreviewProps {
  files: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "SKILL.md": "text-emerald-400",
  agents: "text-blue-400",
  scripts: "text-amber-400",
  references: "text-purple-400",
  assets: "text-pink-400",
};

function getIcon(filePath: string) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "md":
      return <FileText className="w-4 h-4" />;
    case "py":
    case "js":
    case "ts":
    case "sh":
      return <Code2 className="w-4 h-4" />;
    case "yaml":
    case "yml":
    case "json":
      return <FileText className="w-4 h-4" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
      return <Image className="w-4 h-4" />;
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="w-4 h-4" />;
    case "docx":
      return <FileText className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

function getCategoryColor(filePath: string): string {
  if (filePath === "SKILL.md") return CATEGORY_COLORS["SKILL.md"];
  const topFolder = filePath.split("/")[0];
  return CATEGORY_COLORS[topFolder] || "text-zinc-400";
}

function buildTree(files: string[]): Map<string, string[]> {
  const tree = new Map<string, string[]>();
  
  for (const file of files) {
    const parts = file.split("/");
    if (parts.length === 1) {
      // Root-level file
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
  const sortedFolders = Array.from(tree.keys()).sort((a, b) => {
    if (a === "__root__") return -1;
    if (b === "__root__") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-sm">
      <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">
        Estrutura do Arquivo
      </div>
      <div className="space-y-1">
        {sortedFolders.map((folder) => {
          const folderFiles = tree.get(folder)!;

          if (folder === "__root__") {
            return folderFiles.map((file) => (
              <div
                key={file}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-zinc-800/50 transition-colors ${getCategoryColor(file)}`}
              >
                {getIcon(file)}
                <span className="truncate">{file}</span>
              </div>
            ));
          }

          const folderColor = CATEGORY_COLORS[folder] || "text-zinc-400";
          return (
            <div key={folder}>
              <div
                className={`flex items-center gap-2 py-1 px-2 rounded-lg ${folderColor} font-semibold`}
              >
                <Folder className="w-4 h-4" />
                <span>{folder}/</span>
                <span className="text-xs text-zinc-600 font-normal">
                  ({folderFiles.length} ficheiro{folderFiles.length !== 1 ? "s" : ""})
                </span>
              </div>
              <div className="ml-5 border-l border-zinc-800/60 pl-3 space-y-0.5">
                {folderFiles.map((file) => (
                  <div
                    key={`${folder}/${file}`}
                    className={`flex items-center gap-2 py-0.5 px-2 rounded-lg hover:bg-zinc-800/50 transition-colors ${folderColor} opacity-80`}
                  >
                    {getIcon(file)}
                    <span className="truncate text-xs">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
