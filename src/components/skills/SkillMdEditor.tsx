"use client";

import { useState, useCallback } from "react";
import { FileText, Eye } from "lucide-react";

interface SkillMdEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  // Legacy support
  content?: string;
}

export function SkillMdEditor({ value, content, onChange, readOnly }: SkillMdEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const effectiveContent = value ?? content ?? "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const renderPreview = (md: string) => {
    return md
      .replace(/^### (.+)$/gm, '<h3 style="font-size:14px;font-weight:700;color:#1A1714;margin:16px 0 8px">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:700;color:#1A1714;margin:20px 0 12px;border-bottom:1px solid #E8E4DF;padding-bottom:8px">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size:18px;font-weight:700;color:#1A1714;margin:20px 0 16px">$1</h1>')
      .replace(/^---$/gm, '<hr style="border-color:#E8E4DF;margin:16px 0" />')
      .replace(/^- (.+)$/gm, '<li style="color:#4A4744;font-size:13px;margin-left:16px">• $1</li>')
      .replace(/^\d+\.\s(.+)$/gm, '<li style="color:#4A4744;font-size:13px;margin-left:16px;list-style:decimal">$1</li>')
      .replace(/`([^`]+)`/g, '<code style="background:#F4F2EE;color:#1E4DB7;padding:1px 4px;border-radius:3px;font-size:12px;font-family:monospace">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#1A1714;font-weight:600">$1</strong>')
      .replace(/\n/g, "<br />");
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9A9490' }}>
          <FileText size={14} />
          <span style={{ fontFamily: 'monospace' }}>SKILL.md</span>
          <span>·</span>
          <span>Frontmatter YAML + Markdown body</span>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
            padding: '5px 10px', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit',
            background: showPreview ? 'rgba(30,77,183,0.08)' : 'transparent',
            color: showPreview ? '#1E4DB7' : '#9A9490',
            border: showPreview ? '1px solid rgba(30,77,183,0.2)' : '1px solid transparent',
          }}
        >
          <Eye size={14} />
          {showPreview ? "Preview ON" : "Preview"}
        </button>
      </div>

      {/* Editor + Preview */}
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={effectiveContent}
            onChange={handleChange}
            readOnly={readOnly}
            spellCheck={false}
            rows={showPreview ? 24 : 20}
            style={{
              width: '100%', background: '#1A1714', border: 'none', borderRadius: '12px',
              padding: '16px 20px', fontSize: '13px', color: '#C8D6C8',
              fontFamily: 'monospace', outline: 'none', resize: 'vertical',
              lineHeight: 1.7, boxSizing: 'border-box',
            }}
            placeholder={`---\nname: my-skill\ndescription: What this skill does\n---\n\n# Skill Instructions\n\nWrite your instructions here...`}
          />
          {effectiveContent.startsWith("---") && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
              fontFamily: 'monospace', background: 'rgba(30,77,183,0.08)',
              color: '#1E4DB7', border: '1px solid rgba(30,77,183,0.2)',
            }}>
              YAML ✓
            </div>
          )}
        </div>
        {showPreview && (
          <div style={{
            background: '#fff', border: '1px solid #E8E4DF', borderRadius: '12px',
            padding: '20px', overflowY: 'auto', maxHeight: '600px',
          }}>
            <div style={{ fontSize: '11px', color: '#9A9490', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Preview</div>
            <div dangerouslySetInnerHTML={{ __html: renderPreview(effectiveContent) }} />
          </div>
        )}
      </div>
    </div>
  );
}
