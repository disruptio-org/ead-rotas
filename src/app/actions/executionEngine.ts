"use server"

import { prisma } from "@/lib/prisma";
import { loadSkillCore, resolveSkillVersion } from "@/lib/skills/loader";
import { generateDocxOutputs } from "@/lib/skills/docxGenerator";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Convert an Excel serial date number to a YYYY-MM-DD string.
 * Excel epoch: Jan 1 1900 = serial 1 (with the Lotus 1-2-3 Feb 29 1900 bug).
 */
function excelSerialToDateStr(serial: number): string {
  // Excel day 1 = Jan 1 1900, but JS epoch is Jan 1 1970 = Excel serial 25569
  const utcDays = Math.floor(serial - 25569);
  const ms = utcDays * 86400 * 1000;
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseExcelDataUrl(fileDataUrl: string): any[] {
  try {
    // Dynamically require xlsx to avoid Turbopack static analysis issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require("xlsx");
    const base64Data = fileDataUrl.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Convert Excel serial date numbers to YYYY-MM-DD strings so the AI model
    // can interpret them correctly. We detect date columns by checking if
    // the column name contains "data" or "date" (case-insensitive).
    if (rows.length > 0) {
      const keys = Object.keys(rows[0]);
      const dateKeys = keys.filter(
        (k) => k.toLowerCase().includes("data") || k.toLowerCase().includes("date")
      );

      for (const row of rows) {
        for (const key of dateKeys) {
          const val = row[key];
          if (typeof val === "number" && val > 40000 && val < 60000) {
            // Looks like an Excel serial date (range ~2009-2064)
            row[key] = excelSerialToDateStr(val);
          }
        }
      }
    }

    return rows;
  } catch (e: any) {
    console.error("Excel parse failed:", e.message);
    return [];
  }
}

export async function runSkill(
  agentId: string,
  skillId: string,
  instruction: string,
  fileDataUrl?: string
): Promise<{ id: string; status: string; summary: string | null; rawOutput: string | null }> {
  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent) throw new Error("Agent não encontrado.");

  // Resolve the published version of the skill (progressive loading Phase 1→2)
  const versionId = await resolveSkillVersion(skillId);
  if (!versionId) throw new Error("Skill não tem versão publicada.");

  const skillCore = await loadSkillCore(versionId);
  if (!skillCore) throw new Error("Falha ao carregar SKILL.md.");

  const execution = await prisma.execution.create({
    data: {
      agentId,
      skillVersionId: versionId,
      status: "running",
      summary: "Execução iniciada...",
      loadingTrace: JSON.stringify({
        phases: ["metadata", "core"],
        skillSlug: skillCore.slug,
        versionNumber: skillCore.versionNumber,
      }),
    },
  });

  try {
    // Parse Excel if provided
    let parsedRows: any[] = [];
    let dataContext = "Nenhum ficheiro fornecido.";
    if (fileDataUrl && fileDataUrl.startsWith("data:")) {
      parsedRows = parseExcelDataUrl(fileDataUrl);
      if (parsedRows.length > 0) {
        // Build a date summary so the model knows exactly what dates are available
        const dateCol = Object.keys(parsedRows[0]).find(
          (k) => k.toLowerCase().includes("data") || k.toLowerCase().includes("date")
        );
        let dateSummary = "";
        if (dateCol) {
          const dateCounts: Record<string, number> = {};
          for (const row of parsedRows) {
            const d = String(row[dateCol] || "");
            dateCounts[d] = (dateCounts[d] || 0) + 1;
          }
          const sortedDates = Object.entries(dateCounts).sort(([a], [b]) => a.localeCompare(b));
          dateSummary = `\n\nDatas disponíveis no ficheiro (coluna '${dateCol}'):\n` +
            sortedDates.map(([d, c]) => `  ${d}: ${c} serviços`).join("\n");
        }

        dataContext = `${parsedRows.length} linhas encontradas.${dateSummary}\n\nTodas as linhas:\n${JSON.stringify(parsedRows, null, 2)}`;
      } else {
        dataContext = "Ficheiro Excel sem dados ou formato não reconhecido.";
      }
    }

    // Build system prompt from SKILL.md (progressive loading — Phase 2 content)
    const runtimeRules = `
CONTEXTO DE EXECUÇÃO:
- Estás a correr como um motor de planeamento dentro de uma API. NÃO tens acesso a shell, terminal, ou filesystem.
- NÃO podes executar scripts Python, gerar ficheiros DOCX, ou invocar comandos externos.
- Ignora quaisquer instruções no SKILL.md sobre "Run:", "python scripts/...", ou geração de ficheiros.
- O teu trabalho é ANALISAR os dados Excel fornecidos e devolver o PLANO DE ROTAS completo como JSON estruturado.

FORMATO DE RESPOSTA OBRIGATÓRIO (JSON):
{
  "resumo": {
    "total_linhas": <int>,
    "periodo": "<data início> a <data fim>",
    "servicos_incluidos": <int>,
    "servicos_excluidos": <int>
  },
  "plano_por_dia": {
    "<YYYY-MM-DD>": {
      "total_servicos": <int>,
      "plano_por_viatura": {
        "<matrícula>": {
          "servicos": [
            {
              "rsad": <int>,
              "cliente": "<nome>",
              "morada": "<local>",
              "servico": "<tipo>"
            }
          ],
          "total_paragens": <int>,
          "rota_resumo": "<sequência de localidades>"
        }
      },
      "excluidos": [
        {
          "rsad": <int>,
          "cliente": "<nome>",
          "morada": "<local>",
          "servico": "<tipo>",
          "motivo": "<razão da exclusão>"
        }
      ]
    }
  },
  "alertas": ["<avisos relevantes>"]
}

REGRAS ADICIONAIS:
- Responde SEMPRE em JSON válido seguindo o formato acima.
- Nunca inventes campos que não existam nos dados.
- Usa os dados Excel como fonte da verdade.
- Aplica as regras operacionais do SKILL.md (clusters geográficos, limites de condução, etc).
- Preserva os campos críticos do Excel exactamente: RSAD, Cliente (CLI_Nome), Morada (LocalDesc), Serviço (EventTypeDesc).
- Se um campo estiver como "NULL", mantém como "NULL" e sinaliza nos alertas.`;

    const systemPrompt = `${agent.systemInstructions || ""}\n\n--- SKILL: ${skillCore.displayName} (v${skillCore.versionNumber}) ---\n\n${skillCore.instructions}\n\n${runtimeRules}`;

    const userPrompt = `Instruções do utilizador: ${instruction}\n\nDados do ficheiro Excel:\n${dataContext}`;

    let outputRaw = "{}";
    let summary = "Concluído com sucesso.";

    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      outputRaw = completion.choices[0].message.content || "{}";
      try {
        const parsed = JSON.parse(outputRaw);
        const resumo = parsed.resumo;
        if (typeof resumo === "string") {
          summary = resumo;
        } else if (resumo && typeof resumo === "object") {
          const inc = resumo.servicos_incluidos ?? resumo.incluidos ?? "?";
          const exc = resumo.servicos_excluidos ?? resumo.excluidos ?? 0;
          const periodo = resumo.periodo || "";
          summary = `${periodo ? periodo + " — " : ""}${inc} incluídos, ${exc} excluídos.`;
        } else if (parsed.error || parsed.message) {
          summary = parsed.error || parsed.message;
        } else {
          summary = `Processadas ${parsedRows.length} linhas.`;
        }
      } catch {
        summary = "Execução concluída.";
      }
    } else {
      outputRaw = JSON.stringify({
        resumo: "Modo de demonstração (sem API Key configurada).",
        total_servicos: parsedRows.length,
        incluidos: parsedRows.length,
        excluidos: 0,
        plano_por_viatura: {},
      });
      summary = "Demonstração concluída (sem chave OpenAI).";
    }

    // --- DOCX Generation ---
    // If the AI produced a valid route plan with plano_por_dia, generate Word files
    let generatedFiles: { fileName: string; downloadUrl: string }[] = [];
    try {
      const planData = JSON.parse(outputRaw);
      if (planData.plano_por_dia && Object.keys(planData.plano_por_dia).length > 0) {
        generatedFiles = await generateDocxOutputs(planData, execution.id);
        // Inject file links into the output
        planData.ficheiros_gerados = generatedFiles;
        outputRaw = JSON.stringify(planData, null, 2);

        const fileCount = generatedFiles.length;
        summary = `${summary} ${fileCount} ficheiro${fileCount !== 1 ? "s" : ""} DOCX gerado${fileCount !== 1 ? "s" : ""}.`;
      }
    } catch (docxError) {
      console.error("[executionEngine] DOCX generation failed:", docxError);
      // Non-fatal — the JSON result is still valid
    }

    const updated = await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "completed",
        summary,
        rawOutput: outputRaw,
        completedAt: new Date(),
        scriptsCalled: JSON.stringify(
          fileDataUrl
            ? ["excelParser", ...(generatedFiles.length > 0 ? ["docxGenerator"] : [])]
            : []
        ),
      },
    });

    return updated;
  } catch (error: any) {
    const msg = error?.message || "Erro desconhecido.";
    console.error("[executionEngine] Error:", msg);
    await prisma.execution.update({
      where: { id: execution.id },
      data: { status: "failed", summary: msg, completedAt: new Date() },
    });
    throw new Error(msg);
  }
}
