/**
 * Skill Validator
 * Structural, runtime, and compatibility validation for skills.
 * PRD §23
 */

import type { SkillValidationResult, ValidationIssue } from "./types";
import { parseSkillMd } from "./parser";

/**
 * Validate a skill's structural integrity, runtime readiness, and ChatGPT compatibility.
 */
export function validateSkill(opts: {
  skillMdContent: string;
  filePaths: string[];
  displayName: string;
  slug: string;
  description: string | null;
}): SkillValidationResult {
  const structural = validateStructure(opts);
  const runtime = validateRuntime(opts);
  const compatibility = validateCompatibility(opts);

  const allIssues = [...structural, ...runtime, ...compatibility];
  const hasErrors = allIssues.some((i) => i.severity === "error");

  return {
    valid: !hasErrors,
    structural,
    runtime,
    compatibility,
    summary: hasErrors
      ? `${allIssues.filter((i) => i.severity === "error").length} erros encontrados.`
      : allIssues.length > 0
      ? `Válida com ${allIssues.length} avisos.`
      : "Skill válida e compatível.",
  };
}

// --- Structural Validation (PRD §23.2) ---

function validateStructure(opts: {
  skillMdContent: string;
  displayName: string;
  slug: string;
  description: string | null;
}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check SKILL.md presence / content
  if (!opts.skillMdContent || opts.skillMdContent.trim().length === 0) {
    issues.push({
      severity: "error",
      code: "STRUCT_NO_SKILL_MD",
      message: "SKILL.md está vazio ou ausente. É o entrypoint obrigatório da skill.",
      path: "SKILL.md",
    });
    return issues;
  }

  // Parse and validate frontmatter
  const parsed = parseSkillMd(opts.skillMdContent);

  if (!parsed.frontmatter.name || parsed.frontmatter.name === "untitled") {
    issues.push({
      severity: "error",
      code: "STRUCT_NO_NAME",
      message: "O frontmatter do SKILL.md não contém o campo 'name'.",
      path: "SKILL.md → frontmatter.name",
    });
  }

  if (!parsed.frontmatter.description || parsed.frontmatter.description.length < 10) {
    issues.push({
      severity: "warning",
      code: "STRUCT_WEAK_DESCRIPTION",
      message: "A descrição no frontmatter é demasiado curta. Deve servir como trigger principal (>10 caracteres).",
      path: "SKILL.md → frontmatter.description",
    });
  }

  if (parsed.body.length < 50) {
    issues.push({
      severity: "warning",
      code: "STRUCT_SHORT_BODY",
      message: "O body do SKILL.md tem pouco conteúdo (<50 caracteres). Adicione instruções detalhadas.",
      path: "SKILL.md → body",
    });
  }

  // Metadata fields
  if (!opts.slug) {
    issues.push({
      severity: "error",
      code: "STRUCT_NO_SLUG",
      message: "A skill não tem slug definido.",
    });
  }

  if (!opts.displayName) {
    issues.push({
      severity: "error",
      code: "STRUCT_NO_DISPLAY_NAME",
      message: "A skill não tem nome de exibição.",
    });
  }

  return issues;
}

// --- Runtime Validation (PRD §23.2) ---

function validateRuntime(opts: {
  skillMdContent: string;
  filePaths: string[];
}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check if SKILL.md references files that don't exist
  const parsed = parseSkillMd(opts.skillMdContent);
  const body = parsed.body;

  // Find references to files in the body
  const fileRefs = body.match(/(?:references|assets|scripts)\/[\w\-./]+/g) || [];

  for (const ref of fileRefs) {
    if (!opts.filePaths.includes(ref)) {
      issues.push({
        severity: "warning",
        code: "RUNTIME_MISSING_FILE_REF",
        message: `SKILL.md referencia '${ref}' mas o ficheiro não existe na skill.`,
        path: ref,
      });
    }
  }

  return issues;
}

// --- Compatibility Validation (PRD §23.2) ---

function validateCompatibility(opts: {
  skillMdContent: string;
  slug: string;
}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const parsed = parseSkillMd(opts.skillMdContent);

  // Slug must be lowercase
  if (opts.slug !== opts.slug.toLowerCase()) {
    issues.push({
      severity: "error",
      code: "COMPAT_SLUG_CASE",
      message: "O slug deve ser em lowercase para compatibilidade.",
      path: "slug",
    });
  }

  // Name in frontmatter must match slug
  if (parsed.frontmatter.name && parsed.frontmatter.name !== opts.slug) {
    issues.push({
      severity: "warning",
      code: "COMPAT_NAME_SLUG_MISMATCH",
      message: `O 'name' no frontmatter ('${parsed.frontmatter.name}') difere do slug da skill ('${opts.slug}').`,
      path: "SKILL.md → frontmatter.name",
    });
  }

  return issues;
}
