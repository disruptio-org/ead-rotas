import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const executions = await prisma.execution.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        agent: {
          select: { id: true, name: true },
        },
        skillVersion: {
          select: {
            id: true,
            versionNumber: true,
            skill: {
              select: { id: true, displayName: true, slug: true },
            },
          },
        },
      },
    });

    // Flatten the response for easier frontend consumption
    const enriched = executions.map((ex) => ({
      id: ex.id,
      status: ex.status,
      summary: ex.summary,
      rawOutput: ex.rawOutput,
      createdAt: ex.createdAt,
      completedAt: ex.completedAt,
      agentId: ex.agentId,
      agentName: ex.agent?.name ?? "—",
      skillVersionId: ex.skillVersionId,
      skillName: ex.skillVersion?.skill?.displayName ?? null,
      skillSlug: ex.skillVersion?.skill?.slug ?? null,
      skillVersion: ex.skillVersion?.versionNumber ?? null,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch executions" }, { status: 500 });
  }
}
