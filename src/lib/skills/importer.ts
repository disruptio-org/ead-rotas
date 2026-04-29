/**
 * Skill ZIP Importer
 * 5-stage pipeline for importing ChatGPT-packaged skill archives.
 * PRD §12 — Archive Intake → Inspection → Parse → Validate → Commit
 */

import JSZip from "jszip";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { parseSkillMd, slugify } from "./parser";
import type {
  ImportedFileEntry,
  ImportParseResult,
  ImportValidationReport,
  ImportJobResult,
  CompatibilityStatus,
  ValidationIssue,
} from "./types";

const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_EXTRACTED_SIZE = 100 * 1024 * 1024; // 100MB total extracted
const SKILLS_STORAGE_DIR = path.join(process.cwd(), "public", "skills");
const IMPORTS_STORAGE_DIR = path.join(process.cwd(), "public", "imports");

// MIME type inference from file extension
const MIME_MAP: Record<string, string> = {
  ".md": "text/markdown",
  ".yaml": "text/yaml",
  ".yml": "text/yaml",
  ".json": "application/json",
  ".py": "text/x-python",
  ".js": "text/javascript",
  ".ts": "text/typescript",
  ".sh": "text/x-shellscript",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv": "text/csv",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

function inferMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || "application/octet-stream";
}

function categorizeFile(relativePath: string): ImportedFileEntry["category"] {
  if (relativePath === "SKILL.md") return "root";
  if (relativePath.startsWith("agents/")) return "config";
  if (relativePath.startsWith("scripts/")) return "script";
  if (relativePath.startsWith("references/")) return "reference";
  if (relativePath.startsWith("assets/")) return "asset";
  // Fallback: files at root level other than SKILL.md → reference
  return "reference";
}

// --- Stage 1: Extract ZIP safely ---

export async function extractZip(
  buffer: Buffer,
  fileName: string
): Promise<{ entries: Map<string, Buffer>; error?: string }> {
  // Size check on compressed archive
  if (buffer.length > MAX_ZIP_SIZE) {
    return { entries: new Map(), error: `O ficheiro ZIP excede o tamanho máximo permitido (${Math.round(MAX_ZIP_SIZE / 1024 / 1024)}MB).` };
  }

  try {
    const zip = await JSZip.loadAsync(buffer);
    const entries = new Map<string, Buffer>();
    let totalSize = 0;

    for (const [entryPath, zipEntry] of Object.entries(zip.files)) {
      // Skip directories
      if (zipEntry.dir) continue;

      // Zip-slip protection: reject paths with .. or absolute paths
      const normalized = path.normalize(entryPath);
      if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
        return { entries: new Map(), error: `Caminho malicioso detectado no arquivo: '${entryPath}'. Importação bloqueada por segurança.` };
      }

      // Skip hidden files/folders (macOS __MACOSX, .DS_Store, etc.)
      if (entryPath.includes("__MACOSX") || path.basename(entryPath).startsWith(".")) {
        continue;
      }

      const content = await zipEntry.async("nodebuffer");
      totalSize += content.length;

      // Decompression bomb protection
      if (totalSize > MAX_EXTRACTED_SIZE) {
        return { entries: new Map(), error: `O conteúdo extraído excede o limite de segurança (${Math.round(MAX_EXTRACTED_SIZE / 1024 / 1024)}MB). Possível archive bomb.` };
      }

      entries.set(entryPath, content);
    }

    if (entries.size === 0) {
      return { entries: new Map(), error: "O ficheiro ZIP está vazio ou contém apenas diretórios." };
    }

    return { entries };
  } catch {
    return { entries: new Map(), error: "Ficheiro ZIP inválido ou corrompido. Não foi possível extrair o conteúdo." };
  }
}

// --- Stage 2: Detect skill root ---

export function detectSkillRoot(
  entries: Map<string, Buffer>
): { root: string; error?: string } {
  const paths = Array.from(entries.keys());

  // Case 1: SKILL.md at root
  if (entries.has("SKILL.md")) {
    return { root: "" };
  }

  // Case 2: SKILL.md inside a single root folder (e.g. papira-route-planner/SKILL.md)
  const skillMdPaths = paths.filter((p) => p.endsWith("/SKILL.md") || p === "SKILL.md");

  if (skillMdPaths.length === 0) {
    return { root: "", error: "SKILL.md não encontrado no arquivo. Este é o ficheiro obrigatório para qualquer skill." };
  }

  if (skillMdPaths.length > 1) {
    return { root: "", error: `Encontrados ${skillMdPaths.length} ficheiros SKILL.md. A v1 suporta apenas uma skill por arquivo ZIP.` };
  }

  // Extract root folder prefix
  const skillMdPath = skillMdPaths[0];
  const parts = skillMdPath.split("/");
  if (parts.length === 2) {
    // e.g. "papira-route-planner/SKILL.md" → root = "papira-route-planner/"
    return { root: parts[0] + "/" };
  }

  if (parts.length > 2) {
    return { root: "", error: `SKILL.md encontrado em caminho demasiado profundo: '${skillMdPath}'. Deve estar na raiz ou dentro de uma pasta de nível único.` };
  }

  return { root: "" };
}

// --- Stage 3: Parse imported skill ---

export function parseImportedSkill(
  entries: Map<string, Buffer>,
  root: string
): ImportParseResult {
  // Read SKILL.md
  const skillMdBuffer = entries.get(root + "SKILL.md")!;
  const skillMdContent = skillMdBuffer.toString("utf-8");
  const parsed = parseSkillMd(skillMdContent);

  // Read optional openai.yaml
  let openaiYaml: string | null = null;
  const yamlKey = root + "agents/openai.yaml";
  if (entries.has(yamlKey)) {
    openaiYaml = entries.get(yamlKey)!.toString("utf-8");
  }

  // Build file inventory
  const files: ImportedFileEntry[] = [];
  const fileTree: string[] = [];
  let scriptsCount = 0;
  let referencesCount = 0;
  let assetsCount = 0;

  for (const [entryPath, content] of entries) {
    // Strip root prefix to get relative path
    const relativePath = root ? entryPath.slice(root.length) : entryPath;
    if (!relativePath) continue; // Skip the root folder itself

    const category = categorizeFile(relativePath);
    const entry: ImportedFileEntry = {
      path: relativePath,
      category,
      sizeBytes: content.length,
      mimeType: inferMimeType(relativePath),
      content,
    };

    files.push(entry);
    fileTree.push(relativePath);

    if (category === "script") scriptsCount++;
    if (category === "reference") referencesCount++;
    if (category === "asset") assetsCount++;
  }

  // Sort file tree for display
  fileTree.sort();

  return {
    skillName: parsed.frontmatter.name || "untitled",
    description: parsed.frontmatter.description || "",
    skillMdContent,
    openaiYaml,
    files,
    fileTree,
    scriptsCount,
    referencesCount,
    assetsCount,
    tags: parsed.frontmatter.tags || [],
  };
}

// --- Stage 4: Validate import ---

export function validateImport(parsed: ImportParseResult): ImportValidationReport {
  const issues: ValidationIssue[] = [];

  // --- Structural validation ---

  // SKILL.md exists (guaranteed at this point, but check content)
  if (!parsed.skillMdContent || parsed.skillMdContent.trim().length === 0) {
    issues.push({
      severity: "error",
      code: "IMPORT_EMPTY_SKILL_MD",
      message: "SKILL.md está vazio.",
      path: "SKILL.md",
    });
  }

  // Check frontmatter name
  if (!parsed.skillName || parsed.skillName === "untitled") {
    issues.push({
      severity: "error",
      code: "IMPORT_NO_NAME",
      message: "SKILL.md não contém campo 'name' no frontmatter.",
      path: "SKILL.md → frontmatter.name",
    });
  }

  // Check description
  if (!parsed.description || parsed.description.length < 10) {
    issues.push({
      severity: "warning",
      code: "IMPORT_WEAK_DESCRIPTION",
      message: "A descrição no frontmatter é curta (<10 caracteres). Deve servir como trigger para o runtime.",
      path: "SKILL.md → frontmatter.description",
    });
  }

  // --- File reference validation ---
  const bodyRefs = parsed.skillMdContent.match(/(?:references|assets|scripts)\/[\w\-./]+/g) || [];
  for (const ref of bodyRefs) {
    if (!parsed.fileTree.includes(ref)) {
      issues.push({
        severity: "warning",
        code: "IMPORT_MISSING_REF",
        message: `SKILL.md referencia '${ref}' mas o ficheiro não existe no arquivo.`,
        path: ref,
      });
    }
  }

  // --- Script policy validation ---
  const scriptFiles = parsed.files.filter((f) => f.category === "script");
  for (const script of scriptFiles) {
    const ext = path.extname(script.path).toLowerCase();
    if ([".py", ".js", ".ts", ".sh"].includes(ext)) {
      issues.push({
        severity: "info",
        code: "IMPORT_SCRIPT_REVIEW",
        message: `Script '${script.path}' será armazenado mas requer revisão antes de execução.`,
        path: script.path,
      });
    } else {
      issues.push({
        severity: "warning",
        code: "IMPORT_UNSUPPORTED_SCRIPT",
        message: `Script '${script.path}' tem extensão não suportada ('${ext}'). Será armazenado mas não pode ser executado.`,
        path: script.path,
      });
    }
  }

  // --- Asset validation ---
  const MAX_ASSET_SIZE = 10 * 1024 * 1024; // 10MB per asset
  for (const file of parsed.files.filter((f) => f.category === "asset")) {
    if (file.sizeBytes > MAX_ASSET_SIZE) {
      issues.push({
        severity: "warning",
        code: "IMPORT_LARGE_ASSET",
        message: `Asset '${file.path}' tem ${Math.round(file.sizeBytes / 1024 / 1024)}MB. Assets grandes podem impactar performance.`,
        path: file.path,
      });
    }
  }

  // --- openai.yaml check ---
  if (!parsed.openaiYaml) {
    issues.push({
      severity: "info",
      code: "IMPORT_NO_OPENAI_YAML",
      message: "agents/openai.yaml não encontrado. A skill será importada sem configuração OpenAI.",
      path: "agents/openai.yaml",
    });
  }

  // --- Determine compatibility ---
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  let compatibility: CompatibilityStatus;
  if (errors.length > 0) {
    compatibility = "incompatible";
  } else if (warnings.length > 0) {
    compatibility = "partially_compatible";
  } else {
    compatibility = "fully_compatible";
  }

  const canImport = errors.length === 0;

  let summary: string;
  if (!canImport) {
    summary = `Importação bloqueada: ${errors.length} erro(s) encontrado(s).`;
  } else if (warnings.length > 0) {
    summary = `Importável com ${warnings.length} aviso(s).`;
  } else {
    summary = "Skill totalmente compatível. Pronta para importar.";
  }

  return { compatibility, issues, canImport, summary };
}

// --- Stage 5: Commit import ---

export async function commitImport(
  jobId: string,
  publishImmediately: boolean = false
): Promise<{ skillId: string; error?: string }> {
  // Load the import job
  const job = await prisma.skillImportJob.findUnique({ where: { id: jobId } });
  if (!job) {
    return { skillId: "", error: "Import job não encontrado." };
  }

  if (job.status === "committed") {
    return { skillId: "", error: "Este import já foi concluído." };
  }

  if (job.status === "failed") {
    return { skillId: "", error: "Este import falhou e não pode ser concluído." };
  }

  if (!job.parsedResult) {
    return { skillId: "", error: "Dados parsed não disponíveis. Execute a importação novamente." };
  }

  const parsed: ImportParseResult = JSON.parse(job.parsedResult);
  // Reconstruct file contents from the stored ZIP
  // We need to re-extract the ZIP to get file contents since ImportParseResult
  // doesn't store Buffer content in JSON
  
  // Read the stored ZIP
  const fs = await import("fs/promises");
  if (!job.uploadedFileUrl) {
    return { skillId: "", error: "Ficheiro ZIP original não encontrado." };
  }
  const zipPath = path.join(process.cwd(), "public", job.uploadedFileUrl);
  const zipBuffer = await fs.readFile(zipPath);

  // Re-extract
  const { entries, error: extractError } = await extractZip(zipBuffer, job.uploadedFileName);
  if (extractError) {
    return { skillId: "", error: extractError };
  }

  const { root } = detectSkillRoot(entries);

  const slug = slugify(parsed.skillName);

  // Check for slug collision
  const existing = await prisma.skill.findUnique({ where: { slug } });
  if (existing) {
    return { skillId: "", error: `Já existe uma skill com o slug '${slug}'. Renomeie ou elimine a skill existente.` };
  }

  // Create skill directory structure
  const skillDir = path.join(SKILLS_STORAGE_DIR, slug);

  try {
    // Transaction: create Skill + SkillVersion + SkillFiles
    const skill = await prisma.$transaction(async (tx) => {
      const newSkill = await tx.skill.create({
        data: {
          slug,
          displayName: parsed.skillName,
          description: parsed.description || null,
          sourceType: "imported_chatgpt",
          status: publishImmediately ? "published" : "draft",
          tags: parsed.tags.length > 0 ? JSON.stringify(parsed.tags) : null,
        },
      });

      const version = await tx.skillVersion.create({
        data: {
          skillId: newSkill.id,
          versionNumber: "1.0.0",
          skillMdContent: parsed.skillMdContent,
          openaiYaml: parsed.openaiYaml,
          sourceArchiveUrl: job.uploadedFileUrl,
          compatibilityStatus: job.compatibilityStatus,
          validationReport: job.validationReport,
          createdBy: "import",
        },
      });

      // Set current version
      await tx.skill.update({
        where: { id: newSkill.id },
        data: { currentVersionId: version.id },
      });

      // Write files to disk and create DB records
      for (const [entryPath, content] of entries) {
        const relativePath = root ? entryPath.slice(root.length) : entryPath;
        if (!relativePath) continue;

        const category = categorizeFile(relativePath);

        // Determine fileType for DB
        let fileType: string;
        if (category === "root") fileType = "root";
        else if (category === "config") fileType = "config";
        else if (category === "script") fileType = "script";
        else if (category === "asset") fileType = "asset";
        else fileType = "reference";

        // Write to filesystem
        const targetPath = path.join(skillDir, relativePath);
        await mkdir(path.dirname(targetPath), { recursive: true });
        await writeFile(targetPath, content);

        const storagePath = `skills/${slug}/${relativePath}`;

        await tx.skillFile.create({
          data: {
            skillVersionId: version.id,
            path: relativePath,
            fileType,
            mimeType: inferMimeType(relativePath),
            sizeBytes: content.length,
            storagePath,
          },
        });
      }

      return newSkill;
    });

    // Mark import job as committed
    await prisma.skillImportJob.update({
      where: { id: jobId },
      data: {
        status: "committed",
        completedAt: new Date(),
      },
    });

    return { skillId: skill.id };
  } catch (err) {
    console.error("[importer commitImport]", err);

    // Mark as failed
    await prisma.skillImportJob.update({
      where: { id: jobId },
      data: {
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Unknown error during commit",
        completedAt: new Date(),
      },
    });

    return { skillId: "", error: "Falha ao persistir a skill importada." };
  }
}
