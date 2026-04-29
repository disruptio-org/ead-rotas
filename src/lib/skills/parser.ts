/**
 * SKILL.md Parser
 * Extracts YAML frontmatter and markdown body from SKILL.md content.
 * PRD §14
 */

import type { SkillFrontmatter, ParsedSkillMd } from "./types";

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/**
 * Minimal YAML parser for frontmatter fields.
 * Handles: string values, simple arrays (bracket and dash notation).
 * Does NOT handle nested objects — not needed for SKILL.md frontmatter.
 */
function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split(/\r?\n/);

  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Check for array item (dash notation)
    const dashMatch = trimmed.match(/^-\s+(.+)$/);
    if (dashMatch && currentKey && currentArray !== null) {
      currentArray.push(dashMatch[1].replace(/^["']|["']$/g, ""));
      result[currentKey] = currentArray;
      continue;
    }

    // Check for key: value
    const kvMatch = trimmed.match(/^(\w+)\s*:\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      // Bracket array: tags: ["a", "b"]
      if (value.startsWith("[") && value.endsWith("]")) {
        const inner = value.slice(1, -1);
        result[key] = inner
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
        currentKey = null;
        currentArray = null;
        continue;
      }

      // Empty value — could be start of dash-array
      if (!value) {
        currentKey = key;
        currentArray = [];
        result[key] = currentArray;
        continue;
      }

      // Strip quotes
      value = value.replace(/^["']|["']$/g, "");
      result[key] = value;
      currentKey = null;
      currentArray = null;
    }
  }

  return result;
}

/**
 * Parse SKILL.md content into structured frontmatter + body.
 */
export function parseSkillMd(raw: string): ParsedSkillMd {
  const match = raw.match(FRONTMATTER_REGEX);

  if (!match) {
    // No frontmatter — treat entire content as body with defaults
    return {
      frontmatter: {
        name: "untitled",
        description: "",
      },
      body: raw.trim(),
      raw,
    };
  }

  const yamlBlock = match[1];
  const body = match[2].trim();
  const parsed = parseSimpleYaml(yamlBlock);

  const frontmatter: SkillFrontmatter = {
    name: (parsed.name as string) || "untitled",
    description: (parsed.description as string) || "",
    tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : undefined,
    inputs: Array.isArray(parsed.inputs) ? (parsed.inputs as string[]) : undefined,
    outputs: Array.isArray(parsed.outputs) ? (parsed.outputs as string[]) : undefined,
  };

  return { frontmatter, body, raw };
}

/**
 * Serialize frontmatter + body back to SKILL.md format.
 */
export function serializeSkillMd(frontmatter: SkillFrontmatter, body: string): string {
  const lines: string[] = ["---"];

  lines.push(`name: ${frontmatter.name}`);
  lines.push(`description: ${frontmatter.description}`);

  if (frontmatter.tags && frontmatter.tags.length > 0) {
    lines.push(`tags: [${frontmatter.tags.map((t) => `"${t}"`).join(", ")}]`);
  }
  if (frontmatter.inputs && frontmatter.inputs.length > 0) {
    lines.push(`inputs: [${frontmatter.inputs.map((i) => `"${i}"`).join(", ")}]`);
  }
  if (frontmatter.outputs && frontmatter.outputs.length > 0) {
    lines.push(`outputs: [${frontmatter.outputs.map((o) => `"${o}"`).join(", ")}]`);
  }

  lines.push("---");
  lines.push("");
  lines.push(body);

  return lines.join("\n");
}

/**
 * Generate a default SKILL.md template for new skills.
 */
export function generateDefaultSkillMd(slug: string, displayName: string, description: string): string {
  return serializeSkillMd(
    {
      name: slug,
      description,
    },
    `# ${displayName}

## Instruções

<!-- Descreva o comportamento esperado do agente ao usar esta skill -->

## Workflow

1. Receber input do utilizador
2. Processar dados
3. Gerar output estruturado

## Regras

- Responder sempre em formato estruturado
- Nunca inventar dados que não existam no input
- Seguir as instruções de forma precisa

## Referências

<!-- Referenciar ficheiros em references/ quando necessário -->

## Assets

<!-- Referenciar templates em assets/ quando necessário -->
`
  );
}

/**
 * Generate a URL-safe slug from a display name.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 64);
}
