import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const versions = await prisma.skillVersion.findMany({
      where: { skillId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        versionNumber: true,
        createdAt: true,
        createdBy: true,
        _count: { select: { executions: true, files: true } },
      },
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("[API skill versions GET]", error);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}

/**
 * Publish a new version — creates an immutable snapshot from the current draft.
 * PRD §25
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
      return NextResponse.json({ error: "No draft version to publish" }, { status: 400 });
    }

    // Compute next version number
    const versionParts = currentVersion.versionNumber.split(".").map(Number);
    versionParts[1] = (versionParts[1] || 0) + 1;
    const nextVersion = versionParts.join(".");

    // Create immutable snapshot
    const newVersion = await prisma.$transaction(async (tx) => {
      const published = await tx.skillVersion.create({
        data: {
          skillId: id,
          versionNumber: nextVersion,
          skillMdContent: currentVersion.skillMdContent,
          openaiYaml: currentVersion.openaiYaml,
          manifestJson: currentVersion.manifestJson,
          inputSchema: currentVersion.inputSchema,
          outputSchema: currentVersion.outputSchema,
          createdBy: "system",
        },
      });

      // Copy files to new version
      for (const file of currentVersion.files) {
        await tx.skillFile.create({
          data: {
            skillVersionId: published.id,
            path: file.path,
            fileType: file.fileType,
            mimeType: file.mimeType,
            storagePath: file.storagePath,
            checksum: file.checksum,
          },
        });
      }

      // Update skill to point to published version and set status
      await tx.skill.update({
        where: { id },
        data: {
          currentVersionId: published.id,
          status: "published",
        },
      });

      return published;
    });

    return NextResponse.json(newVersion, { status: 201 });
  } catch (error) {
    console.error("[API skill versions POST]", error);
    return NextResponse.json({ error: "Failed to publish version" }, { status: 500 });
  }
}
