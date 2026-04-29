import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        agentSkills: { include: { skill: true } },
        executions: { orderBy: { createdAt: "desc" }, take: 10 }
      }
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const { name, description, systemInstructions, status } = json;

    const agent = await prisma.agent.update({
      where: { id },
      data: { name, description, systemInstructions, status },
    });

    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.agent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
