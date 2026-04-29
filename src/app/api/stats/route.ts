import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeAgents, publishedSkills, executionsToday, completedToday, totalToday] = await Promise.all([
      prisma.agent.count({ where: { status: "active" } }),
      prisma.skill.count({ where: { status: "published" } }),
      prisma.execution.count({ where: { createdAt: { gte: today } } }),
      prisma.execution.count({ where: { createdAt: { gte: today }, status: "completed" } }),
      prisma.execution.count({ where: { createdAt: { gte: today } } }),
    ]);

    const successRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 100;

    return NextResponse.json({
      activeAgents,
      publishedSkills,
      executionsToday,
      successRate,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
