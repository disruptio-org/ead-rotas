"use client";

import { useState, useCallback } from "react";
import { FileText, Eye } from "lucide-react";

interface SkillMdEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export function SkillMdEditor({ content, onChange, readOnly }: SkillMdEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // Simple markdown-to-HTML renderer for preview
  const renderPreview = (md: string) => {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-zinc-200 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-zinc-100 mt-6 mb-3 border-b border-zinc-800 pb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-4">$1</h1>')
      .replace(/^---$/gm, '<hr class="border-zinc-800 my-4" />')
      .replace(/^- (.+)$/gm, '<li class="text-zinc-400 text-sm ml-4">• $1</li>')
      .replace(/^\d+\.\s(.+)$/gm, '<li class="text-zinc-400 text-sm ml-4 list-decimal">$1</li>')
      .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/<!--(.+?)-->/g, '<span class="text-zinc-600 text-xs italic">$1</span>')
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <FileText className="w-3.5 h-3.5" />
          <span className="font-mono">SKILL.md</span>
          <span className="text-zinc-700">·</span>
          <span>Frontmatter YAML + Markdown body</span>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            showPreview
              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {showPreview ? "Preview ON" : "Preview"}
        </button>
      </div>

      {/* Editor + Preview */}
      <div className={`grid gap-4 ${showPreview ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Editor */}
        <div className="relative">
          <textarea
            value={content}
            onChange={handleChange}
            readOnly={readOnly}
            spellCheck={false}
            rows={showPreview ? 24 : 20}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-300 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm leading-relaxed resize-y"
            placeholder={`---\nname: my-skill\ndescription: What this skill does\n---\n\n# Skill Instructions\n\nWrite your instructions here...`}
          />
          {/* Frontmatter highlight indicator */}
          {content.startsWith("---") && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              YAML ✓
            </div>
          )}
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 overflow-y-auto max-h-[600px]">
            <div className="text-xs text-zinc-600 mb-3 uppercase tracking-wider font-medium">Preview</div>
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
