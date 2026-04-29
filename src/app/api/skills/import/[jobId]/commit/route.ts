/**
 * POST /api/skills/import/:jobId/commit
 * Commit a validated import job — persist skill, version, and files.
 * PRD §20
 */

import { NextResponse } from "next/server";
import { commitImport } from "@/lib/skills/importer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    // Parse optional body for publish preference
    let publishImmediately = false;
    try {
      const json = await request.json();
      publishImmediately = json.publish === true;
    } catch {
      // No body or invalid JSON — default to draft
    }

    const result = await commitImport(jobId, publishImmediately);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { skillId: result.skillId, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API skills/import/commit POST]", error);
    return NextResponse.json(
      { error: "Falha ao confirmar a importação." },
      { status: 500 }
    );
  }
}
