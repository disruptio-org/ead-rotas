/**
 * Dynamic file server for runtime-generated files.
 *
 * Next.js standalone mode does NOT serve files added to /public after build.
 * This API route serves files from /public/outputs and /public/skills at runtime.
 *
 * GET /api/files/outputs/<executionId>/<filename>
 * GET /api/files/skills/<slug>/assets/<filename>
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// Allowed root directories (relative to process.cwd()/public)
const ALLOWED_ROOTS = ["outputs", "skills", "imports"];

// MIME type map for common file types
const MIME_TYPES: Record<string, string> = {
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pdf": "application/pdf",
  ".csv": "text/csv",
  ".json": "application/json",
  ".txt": "text/plain",
  ".zip": "application/zip",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;

  if (!segments || segments.length < 2) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // Validate the root directory is allowed
  const root = segments[0];
  if (!ALLOWED_ROOTS.includes(root)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent directory traversal
  const relativePath = segments.join("/");
  if (relativePath.includes("..") || relativePath.includes("~")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const absolutePath = path.join(process.cwd(), "public", relativePath);

  // Ensure the resolved path is still under public/
  const publicDir = path.join(process.cwd(), "public");
  if (!absolutePath.startsWith(publicDir)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileName = path.basename(absolutePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
