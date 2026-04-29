import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir, unlink, readdir } from "fs/promises";

const SKILLS_STORAGE_DIR = path.join(process.cwd(), "public", "skills");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const skill = await prisma.skill.findUnique({
      where: { id },
      select: { currentVersionId: true },
    });

    if (!skill?.currentVersionId) {
      return NextResponse.json([]);
    }

    const files = await prisma.skillFile.findMany({
      where: { skillVersionId: skill.currentVersionId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("[API skill files GET]", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const skill = await prisma.skill.findUnique({
      where: { id },
      select: { currentVersionId: true, slug: true },
    });

    if (!skill?.currentVersionId) {
      return NextResponse.json({ error: "Skill has no current version" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string || "reference";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine storage directory
    const typeDir = fileType === "asset" ? "assets" : fileType === "script" ? "scripts" : "references";
    const skillDir = path.join(SKILLS_STORAGE_DIR, skill.slug, typeDir);
    await mkdir(skillDir, { recursive: true });

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(skillDir, file.name);
    await writeFile(filePath, buffer);

    // Store metadata in DB
    const storagePath = `skills/${skill.slug}/${typeDir}/${file.name}`;
    const skillFilePath = `${typeDir}/${file.name}`;

    const record = await prisma.skillFile.create({
      data: {
        skillVersionId: skill.currentVersionId,
        path: skillFilePath,
        fileType,
        mimeType: file.type || null,
        storagePath,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("[API skill files POST]", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    const file = await prisma.skillFile.findUnique({ where: { id: fileId } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from filesystem
    try {
      const fullPath = path.join(process.cwd(), "public", file.storagePath);
      await unlink(fullPath);
    } catch {
      // File may not exist on disk — continue with DB cleanup
    }

    await prisma.skillFile.delete({ where: { id: fileId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API skill files DELETE]", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
