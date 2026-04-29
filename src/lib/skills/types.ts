/**
 * Core TypeScript types for the Skill System.
 * Maps to the PRD §6, §8, §11, §14, §16, §20.
 */

// --- Skill Lifecycle States (PRD §11.1) ---
export type SkillStatus = "draft" | "validated" | "published" | "deprecated" | "archived";

// --- SKILL.md Frontmatter (PRD §14.3) ---
export interface SkillFrontmatter {
  name: string;         // Lowercase slug identifier
  description: string;  // Trigger description — the runtime uses this for discovery
  tags?: string[];       // Optional categorization
  inputs?: string[];     // Accepted input types (e.g. ["excel", "csv"])
  outputs?: string[];    // Generated output types (e.g. ["docx", "json"])
}

// --- Parsed SKILL.md (PRD §14) ---
export interface ParsedSkillMd {
  frontmatter: SkillFrontmatter;
  body: string;          // Markdown body with instructions, workflow, rules
  raw: string;           // Original raw content
}

// --- Skill Bundle — full in-memory representation (PRD §8) ---
export interface SkillBundle {
  id: string;
  slug: string;
  displayName: string;
  status: SkillStatus;
  version: {
    id: string;
    versionNumber: string;
    skillMd: ParsedSkillMd;
    openaiYaml?: string;
    inputSchema?: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
  };
  files: SkillFileEntry[];
}

export interface SkillFileEntry {
  id: string;
  path: string;
  fileType: "reference" | "asset" | "script";
  mimeType?: string;
  storagePath: string;
}

// --- Progressive Loading Phases (PRD §16) ---
export enum SkillLoadPhase {
  /** Phase 1: name, description, tags, accepted input types */
  METADATA = "metadata",
  /** Phase 2: SKILL.md parsed into frontmatter + body */
  CORE = "core",
  /** Phase 3: references, scripts, assets loaded on demand */
  RESOURCES = "resources",
}

export interface SkillMetadata {
  id: string;
  slug: string;
  displayName: string;
  description: string | null;
  tags: string[];
  status: SkillStatus;
  currentVersionId: string | null;
}

// --- Validation (PRD §23) ---
export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  path?: string;  // e.g. "frontmatter.name", "references/regras.md"
}

export interface SkillValidationResult {
  valid: boolean;
  structural: ValidationIssue[];
  runtime: ValidationIssue[];
  compatibility: ValidationIssue[];
  summary: string;
}

// --- Built-in Script Registry (PRD §19) ---
export interface BuiltinScript {
  key: string;          // e.g. "excelParser", "docxGenerator"
  displayName: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

export const BUILTIN_SCRIPTS: BuiltinScript[] = [
  {
    key: "excelParser",
    displayName: "Excel Parser",
    description: "Lê ficheiros .xlsx/.xls/.csv e devolve linhas JSON estruturadas.",
    inputTypes: ["xlsx", "xls", "csv"],
    outputTypes: ["json"],
  },
  {
    key: "docxGenerator",
    displayName: "DOCX Generator",
    description: "Gera documentos .docx a partir de templates com dados estruturados.",
    inputTypes: ["json"],
    outputTypes: ["docx"],
  },
];

// --- Import Pipeline Types (PRD ZIP Import §12-§15) ---

export type CompatibilityStatus = "fully_compatible" | "partially_compatible" | "incompatible";

export interface ImportedFileEntry {
  path: string;                    // Relative path inside the archive, e.g. "references/rules.md"
  category: "root" | "config" | "script" | "reference" | "asset";
  sizeBytes: number;
  mimeType: string;
  content?: Buffer;                // Raw file content (for persistence)
}

export interface ImportParseResult {
  skillName: string;               // From SKILL.md frontmatter
  description: string;             // From SKILL.md frontmatter
  skillMdContent: string;          // Raw SKILL.md content
  openaiYaml: string | null;       // agents/openai.yaml content if present
  files: ImportedFileEntry[];      // All files in the archive
  fileTree: string[];              // Flat list of all paths for display
  scriptsCount: number;
  referencesCount: number;
  assetsCount: number;
  tags: string[];                  // From frontmatter if present
}

export interface ImportValidationReport {
  compatibility: CompatibilityStatus;
  issues: ValidationIssue[];
  canImport: boolean;
  summary: string;
}

export interface ImportJobResult {
  jobId: string;
  status: string;
  parsed: ImportParseResult | null;
  validation: ImportValidationReport | null;
  error: string | null;
}
