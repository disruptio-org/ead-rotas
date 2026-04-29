import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          include: {
            files: true,
            _count: { select: { executions: true } },
          },
        },
        agentSkills: {
          include: { agent: { select: { id: true, name: true } } },
        },
      },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...skill,
      tags: skill.tags ? JSON.parse(skill.tags) : [],
    });
  } catch (error) {
    console.error("[API skill GET]", error);
    return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const { displayName, description, status, tags, skillMdContent } = json;

    // Update skill metadata
    const updateData: Record<string, unknown> = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    // If SKILL.md content is provided, update the current version
    if (skillMdContent !== undefined && skill.currentVersionId) {
      await prisma.skillVersion.update({
        where: { id: skill.currentVersionId },
        data: { skillMdContent },
      });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("[API skill PUT]", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cascade delete in a transaction — remove all dependent records first
    await prisma.$transaction(async (tx) => {
      // 1. Get all version IDs for this skill
      const versions = await tx.skillVersion.findMany({
        where: { skillId: id },
        select: { id: true },
      });
      const versionIds = versions.map((v) => v.id);

      // 2. Nullify execution references (executions belong to Agent, not deleted)
      if (versionIds.length > 0) {
        await tx.execution.updateMany({
          where: { skillVersionId: { in: versionIds } },
          data: { skillVersionId: null },
        });
      }

      // 3. Clear currentVersionId to break circular FK
      await tx.skill.update({
        where: { id },
        data: { currentVersionId: null },
      });

      // 4. Delete skill files (cascaded from SkillVersion, but explicit for safety)
      if (versionIds.length > 0) {
        await tx.skillFile.deleteMany({
          where: { skillVersionId: { in: versionIds } },
        });
      }

      // 5. Delete agent-skill bindings (has onDelete: Cascade but explicit for safety)
      await tx.agentSkill.deleteMany({ where: { skillId: id } });

      // 6. Delete all versions
      await tx.skillVersion.deleteMany({ where: { skillId: id } });

      // 7. Finally delete the skill itself
      await tx.skill.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API skill DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete skill. It may have dependent records." },
      { status: 500 }
    );
  }
}
