/**
 * DOCX Generator for DSC Route Planning
 * 
 * Produces documents matching the exact format of the official samples:
 *  - Folha_Servico_<date>_<vehicle>.docx — service sheet per van per day
 *  - Servicos_Excluidos_<date>.docx — excluded services per day
 * 
 * Format is derived from resources/samples/ reference documents.
 */

import PizZip from "pizzip";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "public", "outputs");

// Template paths (from imported skill assets)
const SERVICE_TEMPLATE = path.join(
  process.cwd(), "public", "skills", "papira-route-planner", "assets", "service_template.docx"
);
const EXCLUDED_TEMPLATE = path.join(
  process.cwd(), "public", "skills", "papira-route-planner", "assets", "excluded_template.docx"
);

// --- Types ---

interface ServiceEntry {
  rsad: number;
  cliente: string;
  morada: string;
  servico: string;
}

interface VehiclePlan {
  servicos: ServiceEntry[];
  total_paragens: number;
  rota_resumo: string;
}

interface DayPlan {
  total_servicos: number;
  plano_por_viatura: Record<string, VehiclePlan>;
  excluidos: (ServiceEntry & { motivo?: string })[];
}

interface RoutePlanOutput {
  resumo: {
    total_linhas: number;
    periodo: string;
    servicos_incluidos: number;
    servicos_excluidos: number;
  };
  plano_por_dia: Record<string, DayPlan>;
  alertas: string[];
}

// --- Helpers ---

/** Escape XML special characters */
function esc(text: string): string {
  return String(text || "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Convert YYYY-MM-DD to DD/MM/YYYY */
function formatDatePT(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return isoDate;
}

/** Format RSAD number with prefix */
function formatRsad(rsad: number): string {
  return `RSAD${String(rsad).padStart(6, "0")}`;
}

// --- XML Builders (matching sample structure exactly) ---

/**
 * Build the service sheet document.xml content matching the sample format:
 * - Centered title "FOLHA DE SERVIÇO DIÁRIO - DSC"
 * - 2-column identification table (Data, Viatura, Condutor, Ajudante)
 * - "Sequência da Rota" with arrow-separated locations
 * - "Plano de Execução" header
 * - Each service as: RSAD / Cliente / Serviço a realizar paragraphs
 */
function buildServiceSheetXml(
  date: string,
  vehicle: string,
  plan: VehiclePlan,
  originalSectPr?: string
): string {
  const datePT = formatDatePT(date);
  const route = plan.rota_resumo
    ? plan.rota_resumo.split(",").map(s => s.trim()).join(" → ")
    : "Rota a definir";

  // Build service blocks
  let serviceBlocks = "";
  for (const s of plan.servicos) {
    const rsad = formatRsad(s.rsad);
    const servDesc = String(s.servico || "—");
    const morada = s.morada && String(s.morada) !== "NULL" ? ` — ${esc(String(s.morada))}` : "";

    serviceBlocks += `
      <w:p><w:r><w:br/><w:t>RSAD: ${esc(rsad)}</w:t></w:r></w:p>
      <w:p><w:r><w:t>Cliente: ${esc(String(s.cliente))}</w:t></w:r></w:p>
      <w:p><w:r><w:t>Serviço a realizar: ${esc(servDesc)}${morada}</w:t></w:r></w:p>`;
  }

  return `<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14">
<w:body>
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>FOLHA DE SERVIÇO DIÁRIO - DSC</w:t></w:r>
  </w:p>

  <w:tbl>
    <w:tblPr>
      <w:tblStyle w:val="TableGrid"/>
      <w:tblW w:type="auto" w:w="0"/>
      <w:tblLook w:firstColumn="1" w:firstRow="1" w:lastColumn="0" w:lastRow="0" w:noHBand="0" w:noVBand="1" w:val="04A0"/>
    </w:tblPr>
    <w:tblGrid><w:gridCol w:w="4320"/><w:gridCol w:w="4320"/></w:tblGrid>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>Data</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>${esc(datePT)}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>Viatura</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>${esc(vehicle)}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>Condutor</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>—</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>Ajudante</w:t></w:r></w:p></w:tc>
      <w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4320"/></w:tcPr><w:p><w:r><w:t>—</w:t></w:r></w:p></w:tc>
    </w:tr>
  </w:tbl>

  <w:p><w:r><w:br/><w:t>Sequência da Rota</w:t></w:r></w:p>
  <w:p><w:r><w:t>${esc(route)}</w:t></w:r></w:p>

  <w:p><w:r><w:br/><w:t>Plano de Execução</w:t></w:r></w:p>

  ${serviceBlocks}

  ${originalSectPr || `<w:sectPr>
    <w:pgSz w:w="12240" w:h="15840"/>
    <w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800" w:header="720" w:footer="720" w:gutter="0"/>
    <w:cols w:space="720"/>
    <w:docGrid w:linePitch="360"/>
  </w:sectPr>`}
</w:body>
</w:document>`;
}

/**
 * Build excluded services document.xml:
 * - Centered bold title: "SERVIÇOS EXCLUÍDOS / A REMARCAR"
 * - Date subtitle
 * - 5-column table: RSAD | Cliente | Morada | Serviço | Motivo
 * - Total count footer
 */
function buildExcludedSheetXml(
  date: string,
  excluded: (ServiceEntry & { motivo?: string })[],
  originalSectPr?: string
): string {
  const datePT = formatDatePT(date);

  // Helper to build a single table cell with optional bold
  const tc = (text: string, width: number, bold = false) => {
    const rPr = bold ? `<w:rPr><w:b/><w:sz w:val="20"/></w:rPr>` : `<w:rPr><w:sz w:val="20"/></w:rPr>`;
    return `<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="${width}"/></w:tcPr><w:p><w:r>${rPr}<w:t>${esc(text)}</w:t></w:r></w:p></w:tc>`;
  };

  // Column widths (total ~14400 = landscape A4 usable width)
  const W_RSAD = 1800, W_CLIENTE = 3600, W_MORADA = 3600, W_SERVICO = 2800, W_MOTIVO = 2600;

  // Header row
  const headerRow = `<w:tr>
    ${tc("RSAD", W_RSAD, true)}
    ${tc("Cliente", W_CLIENTE, true)}
    ${tc("Morada", W_MORADA, true)}
    ${tc("Serviço", W_SERVICO, true)}
    ${tc("Motivo Exclusão", W_MOTIVO, true)}
  </w:tr>`;

  // Data rows
  let dataRows = "";
  for (const s of excluded) {
    dataRows += `<w:tr>
      ${tc(formatRsad(s.rsad), W_RSAD)}
      ${tc(String(s.cliente || "—"), W_CLIENTE)}
      ${tc(String(s.morada || "—"), W_MORADA)}
      ${tc(String(s.servico || "—"), W_SERVICO)}
      ${tc(String(s.motivo || "—"), W_MOTIVO)}
    </w:tr>`;
  }

  return `<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14">
<w:body>
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>SERVIÇOS EXCLUÍDOS / A REMARCAR</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t>${esc(datePT)}</w:t></w:r>
  </w:p>
  <w:p><w:r><w:t> </w:t></w:r></w:p>

  <w:tbl>
    <w:tblPr>
      <w:tblStyle w:val="TableGrid"/>
      <w:tblW w:type="auto" w:w="0"/>
      <w:tblLook w:firstColumn="1" w:firstRow="1" w:lastColumn="0" w:lastRow="0" w:noHBand="0" w:noVBand="1" w:val="04A0"/>
    </w:tblPr>
    <w:tblGrid>
      <w:gridCol w:w="${W_RSAD}"/>
      <w:gridCol w:w="${W_CLIENTE}"/>
      <w:gridCol w:w="${W_MORADA}"/>
      <w:gridCol w:w="${W_SERVICO}"/>
      <w:gridCol w:w="${W_MOTIVO}"/>
    </w:tblGrid>
    ${headerRow}
    ${dataRows}
  </w:tbl>

  <w:p><w:r><w:br/><w:t> </w:t></w:r></w:p>
  <w:p>
    <w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Total: ${excluded.length} serviço${excluded.length !== 1 ? "s" : ""} excluído${excluded.length !== 1 ? "s" : ""}</w:t></w:r>
  </w:p>

  ${originalSectPr || `<w:sectPr>
    <w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/>
    <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    <w:cols w:space="720"/>
    <w:docGrid w:linePitch="360"/>
  </w:sectPr>`}
</w:body>
</w:document>`;
}

// --- Template-based generation ---

/**
 * Extract the <w:sectPr> element from the template's document.xml.
 * This preserves header/footer references (e.g. logo images).
 */
function extractSectPr(templateZip: PizZip): string | undefined {
  try {
    const docXml = templateZip.file("word/document.xml")?.asText();
    if (!docXml) return undefined;
    const match = docXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
    return match ? match[0] : undefined;
  } catch {
    return undefined;
  }
}

async function generateFromTemplate(
  templatePath: string,
  xmlBuilder: (sectPr?: string) => string
): Promise<Buffer> {
  let templateBuffer: Buffer;
  try {
    templateBuffer = await readFile(templatePath);
  } catch {
    // Fallback: create minimal DOCX zip structure if template not found
    console.warn(`[docxGenerator] Template not found: ${templatePath}, using minimal structure`);
    return generateMinimalDocx(xmlBuilder());
  }

  const zip = new PizZip(templateBuffer);
  // Extract the original sectPr (preserves header/footer/logo references)
  const sectPr = extractSectPr(zip);
  // Build the new document.xml with the template's sectPr
  const documentXml = xmlBuilder(sectPr);
  zip.file("word/document.xml", documentXml);
  return zip.generate({ type: "nodebuffer" }) as Buffer;
}

function generateMinimalDocx(documentXml: string): Buffer {
  const zip = new PizZip();

  // [Content_Types].xml
  zip.file("[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.file("_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // word/_rels/document.xml.rels
  zip.file("word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`
  );

  // word/document.xml
  zip.file("word/document.xml", documentXml);

  return zip.generate({ type: "nodebuffer" }) as Buffer;
}

// --- Main export ---

export interface GeneratedFile {
  fileName: string;
  downloadUrl: string;
}

export async function generateDocxOutputs(
  routePlan: RoutePlanOutput,
  executionId: string
): Promise<GeneratedFile[]> {
  const outputDir = path.join(OUTPUT_DIR, executionId);
  await mkdir(outputDir, { recursive: true });

  const generatedFiles: GeneratedFile[] = [];

  for (const [date, dayPlan] of Object.entries(routePlan.plano_por_dia)) {
    // Generate service sheet per vehicle
    for (const [vehicle, vehiclePlan] of Object.entries(dayPlan.plano_por_viatura)) {
      const safeVehicle = vehicle.replace(/[^a-zA-Z0-9-]/g, "_");
      const fileName = `Folha_Servico_${date}_${safeVehicle}.docx`;

      const buffer = await generateFromTemplate(
        SERVICE_TEMPLATE,
        (sectPr) => buildServiceSheetXml(date, vehicle, vehiclePlan, sectPr)
      );

      await writeFile(path.join(outputDir, fileName), buffer);
      generatedFiles.push({
        fileName,
        downloadUrl: `/outputs/${executionId}/${fileName}`,
      });
    }

    // Generate excluded services sheet if applicable
    if (dayPlan.excluidos && dayPlan.excluidos.length > 0) {
      const fileName = `Servicos_Excluidos_${date}.docx`;

      const buffer = await generateFromTemplate(
        EXCLUDED_TEMPLATE,
        (sectPr) => buildExcludedSheetXml(date, dayPlan.excluidos, sectPr)
      );

      await writeFile(path.join(outputDir, fileName), buffer);
      generatedFiles.push({
        fileName,
        downloadUrl: `/outputs/${executionId}/${fileName}`,
      });
    }
  }

  return generatedFiles;
}
