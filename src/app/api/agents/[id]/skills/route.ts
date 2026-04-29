/**
 * POST /api/agents/:id/skills — Bind a skill to an agent
 * DELETE /api/agents/:id/skills?skillId=xxx — Unbind a skill from an agent
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { skillId } = await request.json();

    if (!skillId) {
      return NextResponse.json({ error: "skillId is required" }, { status: 400 });
    }

    // Check agent exists
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check skill exists
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Upsert — if already bound, just return it
    const agentSkill = await prisma.agentSkill.upsert({
      where: { agentId_skillId: { agentId: id, skillId } },
      update: { enabled: true },
      create: { agentId: id, skillId, enabled: true },
    });

    return NextResponse.json(agentSkill, { status: 201 });
  } catch (error) {
    console.error("[API agent skills POST]", error);
    return NextResponse.json({ error: "Failed to bind skill" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get("skillId");

    if (!skillId) {
      return NextResponse.json({ error: "skillId is required" }, { status: 400 });
    }

    await prisma.agentSkill.deleteMany({
      where: { agentId: id, skillId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API agent skills DELETE]", error);
    return NextResponse.json({ error: "Failed to unbind skill" }, { status: 500 });
  }
}
