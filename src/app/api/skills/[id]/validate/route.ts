import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSkill } from "@/lib/skills/validator";

/**
 * Run validation on a skill.
 * PRD §23
 */
export async function POST(
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
          take: 1,
          include: { files: true },
        },
      },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const currentVersion = skill.versions[0];
    if (!currentVersion) {
      return NextResponse.json(
        { error: "No version to validate" },
        { status: 400 }
      );
    }

    const filePaths = currentVersion.files.map((f) => f.path);

    const result = validateSkill({
      skillMdContent: currentVersion.skillMdContent,
      filePaths,
      displayName: skill.displayName,
      slug: skill.slug,
      description: skill.description,
    });

    // Update status to validated if no errors
    if (result.valid && skill.status === "draft") {
      await prisma.skill.update({
        where: { id },
        data: { status: "validated" },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API skill validate]", error);
    return NextResponse.json({ error: "Failed to validate skill" }, { status: 500 });
  }
}
