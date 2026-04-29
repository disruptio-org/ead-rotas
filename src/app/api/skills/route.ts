import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, generateDefaultSkillMd } from "@/lib/skills/parser";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { displayName: { contains: search } },
        { slug: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, versionNumber: true },
        },
        _count: { select: { agentSkills: true } },
      },
    });

    const result = skills.map((s) => ({
      id: s.id,
      slug: s.slug,
      displayName: s.displayName,
      description: s.description,
      status: s.status,
      sourceType: s.sourceType,
      tags: s.tags ? JSON.parse(s.tags) : [],
      currentVersionId: s.currentVersionId,
      latestVersion: s.versions[0] || null,
      agentCount: s._count.agentSkills,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API skills GET]", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { displayName, description, tags, template } = json;

    if (!displayName || !displayName.trim()) {
      return NextResponse.json({ error: "displayName is required" }, { status: 400 });
    }

    const slug = slugify(displayName);

    // Check for slug collision
    const existing = await prisma.skill.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Já existe uma skill com o slug '${slug}'.` },
        { status: 409 }
      );
    }

    // Generate default SKILL.md
    const skillMdContent = generateDefaultSkillMd(slug, displayName, description || "");

    // Create skill + initial draft version in a transaction
    const skill = await prisma.$transaction(async (tx) => {
      const newSkill = await tx.skill.create({
        data: {
          slug,
          displayName,
          description: description || null,
          status: "draft",
          tags: tags ? JSON.stringify(tags) : null,
        },
      });

      const version = await tx.skillVersion.create({
        data: {
          skillId: newSkill.id,
          versionNumber: "0.1.0",
          skillMdContent,
          createdBy: "system",
        },
      });

      // Set current version
      await tx.skill.update({
        where: { id: newSkill.id },
        data: { currentVersionId: version.id },
      });

      return { ...newSkill, currentVersionId: version.id, latestVersion: version };
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("[API skills POST]", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
