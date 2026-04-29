"use server"

import { prisma } from "@/lib/prisma"
import { generateDefaultSkillMd } from "@/lib/skills/parser"

const DSC_SKILL_MD = `---
name: dsc-rotas
description: Skill para ler um Excel diário de serviços DSC, aplicar regras operacionais, organizar rotas, gerar folhas de serviço e documento de excluídos. Usar quando o utilizador quer transformar um ficheiro operacional em outputs DOCX consistentes.
tags: ["logistics", "dsc", "routing"]
inputs: ["xlsx", "xls"]
outputs: ["json", "docx"]
---

# DSC Rotas — Planeamento Logístico

## Instruções

És um agente de operações logísticas especializado em planeamento DSC.
Quando recebes um ficheiro Excel de serviços diários, deves:

1. Ler todas as linhas do ficheiro
2. Identificar campos relevantes: código de serviço, destino, tipo, viatura, condutor
3. Aplicar regras de exclusão (serviços com tipo "cancelado", "adiado", etc.)
4. Agrupar serviços incluídos por viatura/rota
5. Gerar plano estruturado por viatura

## Regras

- Nunca inventar dados que não existam no ficheiro
- Responder sempre em JSON válido
- Estruturar a resposta com: resumo, total_servicos, incluidos, excluidos, plano_por_viatura
- Se houver ambiguidade, manter o serviço como incluído

## Workflow

1. Receber ficheiro Excel
2. Parse com script excelParser
3. Aplicar regras de exclusão
4. Agrupar por viatura
5. Gerar output estruturado
`;

export async function launchDSCPlaneamento() {
  // Find or Create Skill (using new schema)
  let skill = await prisma.skill.findFirst({ where: { slug: "dsc-rotas" } })
  if (!skill) {
    skill = await prisma.skill.create({
      data: {
        slug: "dsc-rotas",
        displayName: "DSC Rotas",
        description: "Lê um Excel diário de serviços DSC, aplica regras, e gera rotas.",
        status: "published",
        tags: JSON.stringify(["logistics", "dsc", "routing"]),
      }
    })

    const version = await prisma.skillVersion.create({
      data: {
        skillId: skill.id,
        versionNumber: "1.0.0",
        skillMdContent: DSC_SKILL_MD,
        createdBy: "system",
      }
    })

    await prisma.skill.update({
      where: { id: skill.id },
      data: { currentVersionId: version.id },
    })
  }

  // Find or Create Agent
  let agent = await prisma.agent.findFirst({ where: { name: "Planeamento DSC" } })
  if (!agent) {
    agent = await prisma.agent.create({
      data: {
        name: "Planeamento DSC",
        description: "Agente responsável por gerir exclusões e planeamento logístico diário.",
        systemInstructions: "És um assistente especializado em rotas DSC. Segue as instruções da skill activa."
      }
    })
  }

  // Link them if not linked
  const link = await prisma.agentSkill.findFirst({ where: { agentId: agent.id, skillId: skill.id } })
  if (!link) {
    await prisma.agentSkill.create({
      data: { agentId: agent.id, skillId: skill.id }
    })
  }

  return agent.id
}
