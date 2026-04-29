/**
 * POST /api/skills/import
 * Upload a skill.zip, run the full parse + validation pipeline, return import job result.
 * PRD §20
 */

import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "@/lib/prisma";
import {
  extractZip,
  detectSkillRoot,
  parseImportedSkill,
  validateImport,
} from "@/lib/skills/importer";

const IMPORTS_DIR = path.join(process.cwd(), "public", "imports");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum ficheiro enviado." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith(".zip")) {
      return NextResponse.json(
        { error: "Apenas ficheiros .zip são aceites." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Stage 1: Extract
    const { entries, error: extractError } = await extractZip(buffer, file.name);
    if (extractError) {
      // Create a failed job record for auditing
      const failedJob = await prisma.skillImportJob.create({
        data: {
          uploadedFileName: file.name,
          status: "failed",
          errorMessage: extractError,
          completedAt: new Date(),
        },
      });
      return NextResponse.json(
        { jobId: failedJob.id, status: "failed", parsed: null, validation: null, error: extractError },
        { status: 422 }
      );
    }

    // Stage 2: Detect skill root
    const { root, error: detectError } = detectSkillRoot(entries);
    if (detectError) {
      const failedJob = await prisma.skillImportJob.create({
        data: {
          uploadedFileName: file.name,
          status: "failed",
          errorMessage: detectError,
          completedAt: new Date(),
        },
      });
      return NextResponse.json(
        { jobId: failedJob.id, status: "failed", parsed: null, validation: null, error: detectError },
        { status: 422 }
      );
    }

    // Stage 3: Parse
    const parsed = parseImportedSkill(entries, root);

    // Stage 4: Validate
    const validation = validateImport(parsed);

    // Persist the original ZIP for audit/commit
    await mkdir(IMPORTS_DIR, { recursive: true });
    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const zipStoragePath = path.join(IMPORTS_DIR, safeFileName);
    await writeFile(zipStoragePath, buffer);

    const uploadedFileUrl = `imports/${safeFileName}`;

    // Create a serializable version of parsed (without Buffer content)
    const parsedForStorage = {
      ...parsed,
      files: parsed.files.map((f) => ({
        path: f.path,
        category: f.category,
        sizeBytes: f.sizeBytes,
        mimeType: f.mimeType,
      })),
    };

    // Create import job record
    const job = await prisma.skillImportJob.create({
      data: {
        uploadedFileName: file.name,
        uploadedFileUrl,
        status: validation.canImport ? "ready" : "failed",
        parsedResult: JSON.stringify(parsedForStorage),
        validationReport: JSON.stringify(validation),
        compatibilityStatus: validation.compatibility,
        errorMessage: validation.canImport ? null : validation.summary,
        completedAt: validation.canImport ? null : new Date(),
      },
    });

    return NextResponse.json(
      {
        jobId: job.id,
        status: job.status,
        parsed: parsedForStorage,
        validation,
        error: validation.canImport ? null : validation.summary,
      },
      { status: validation.canImport ? 200 : 422 }
    );
  } catch (error) {
    console.error("[API skills/import POST]", error);
    return NextResponse.json(
      { error: "Falha inesperada na importação." },
      { status: 500 }
    );
  }
}
