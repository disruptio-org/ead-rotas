/**
 * Progressive Skill Loader
 * Implements the 3-phase loading strategy from PRD §16.
 * Phase 1: Metadata only (for discovery/listing)
 * Phase 2: SKILL.md parsed (when skill is selected)
 * Phase 3: References/scripts/assets on demand
 */

import { prisma } from "@/lib/prisma";
import { parseSkillMd } from "./parser";
import type { SkillMetadata, SkillBundle, SkillStatus } from "./types";

/**
 * Phase 1 — Load metadata only.
 * Used for skill listing, discovery, and triggering decisions.
 */
export async function loadSkillMetadata(skillId: string): Promise<SkillMetadata | null> {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    select: {
      id: true,
      slug: true,
      displayName: true,
      description: true,
      tags: true,
      status: true,
      currentVersionId: true,
    },
  });

  if (!skill) return null;

  return {
    id: skill.id,
    slug: skill.slug,
    displayName: skill.displayName,
    description: skill.description,
    tags: skill.tags ? JSON.parse(skill.tags) : [],
    status: skill.status as SkillStatus,
    currentVersionId: skill.currentVersionId,
  };
}

/**
 * Phase 2 — Load core SKILL.md content.
 * Used when a skill is selected for execution.
 * Returns parsed frontmatter + body.
 */
export async function loadSkillCore(skillVersionId: string) {
  const version = await prisma.skillVersion.findUnique({
    where: { id: skillVersionId },
    select: {
      id: true,
      versionNumber: true,
      skillMdContent: true,
      openaiYaml: true,
      inputSchema: true,
      outputSchema: true,
      skill: {
        select: {
          id: true,
          slug: true,
          displayName: true,
          status: true,
        },
      },
    },
  });

  if (!version) return null;

  const parsed = parseSkillMd(version.skillMdContent);

  return {
    skillId: version.skill.id,
    slug: version.skill.slug,
    displayName: version.skill.displayName,
    versionId: version.id,
    versionNumber: version.versionNumber,
    frontmatter: parsed.frontmatter,
    instructions: parsed.body,
    openaiYaml: version.openaiYaml,
    inputSchema: version.inputSchema ? JSON.parse(version.inputSchema) : null,
    outputSchema: version.outputSchema ? JSON.parse(version.outputSchema) : null,
  };
}

/**
 * Phase 3 — Load specific resource files on demand.
 * Used when the runtime needs references, assets, or scripts.
 */
export async function loadSkillResources(
  skillVersionId: string,
  fileType?: "reference" | "asset" | "script"
) {
  const where: Record<string, unknown> = { skillVersionId };
  if (fileType) where.fileType = fileType;

  const files = await prisma.skillFile.findMany({
    where,
    select: {
      id: true,
      path: true,
      fileType: true,
      mimeType: true,
      storagePath: true,
    },
  });

  return files;
}

/**
 * Full bundle load — assembles a complete SkillBundle.
 * Used when all information is needed (export, deep inspection).
 */
export async function loadSkillBundle(skillId: string): Promise<SkillBundle | null> {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { files: true },
      },
    },
  });

  if (!skill || skill.versions.length === 0) return null;

  const version = skill.versions[0];
  const parsed = parseSkillMd(version.skillMdContent);

  return {
    id: skill.id,
    slug: skill.slug,
    displayName: skill.displayName,
    status: skill.status as SkillStatus,
    version: {
      id: version.id,
      versionNumber: version.versionNumber,
      skillMd: parsed,
      openaiYaml: version.openaiYaml || undefined,
      inputSchema: version.inputSchema ? JSON.parse(version.inputSchema) : undefined,
      outputSchema: version.outputSchema ? JSON.parse(version.outputSchema) : undefined,
    },
    files: version.files.map((f) => ({
      id: f.id,
      path: f.path,
      fileType: f.fileType as "reference" | "asset" | "script",
      mimeType: f.mimeType || undefined,
      storagePath: f.storagePath,
    })),
  };
}

/**
 * Resolve the current published version for a skill.
 * Returns the version ID to use for execution.
 */
export async function resolveSkillVersion(skillId: string): Promise<string | null> {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    select: { currentVersionId: true },
  });

  if (skill?.currentVersionId) return skill.currentVersionId;

  // Fallback: latest version
  const latest = await prisma.skillVersion.findFirst({
    where: { skillId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return latest?.id || null;
}
