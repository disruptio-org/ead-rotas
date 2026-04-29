---
name: papira-route-planner
description: plan papira dsc operational routes from an uploaded excel or csv file and a portuguese or english timeframe request, then generate only word outputs using the bundled official templates. use when the user uploads a daily or weekly planning spreadsheet and asks for planning for a specific day, date range, week, next week, tomorrow, or next month, and needs one docx per van per day plus excluded-services docx files when applicable.
---

# Papira Route Planner

## Overview

Use this skill to turn an uploaded CSV/XLSX planning file into final DOCX route sheets by van and day, using the official bundled templates as the only source of truth for layout.

## Workflow

1. Validate the uploaded file and map columns.
2. Interpret the timeframe request.
3. Filter rows for that period.
4. Apply the DSC routing rules conservatively.
5. Generate only Word outputs:
   - one route sheet per van per day
   - excluded-services document per day when applicable

## Rules that always apply

- Use the official templates in `assets/service_template.docx` and `assets/excluded_template.docx`.
- Do not create alternative layouts.
- Preserve the header, structure, and visual hierarchy of the bundled templates.
- Preserve client and service text exactly from the spreadsheet when available.
- If critical fields are missing, exclude the row instead of inventing values.
- Prefer controlled exclusion over an obviously infeasible route.
- Keep the response minimal and centered on delivering the generated DOCX files.
- Do not produce a narrative chat summary unless the user explicitly asks for one.

## Timeframe handling

Support Portuguese and English requests such as:
- amanhã / tomorrow
- hoje / today
- próxima semana / next week
- próximo mês / next month
- semana de 29/06/2026 / week of 2026-06-29
- 23/04/2026
- 23 a 27 de abril
- segunda a terça / Monday to Tuesday

If the request is ambiguous, inspect the spreadsheet date range and choose the nearest matching future period that exists in the file. If no rows exist for the requested period, stop and say so clearly.

See `references/timeframe_examples.md` for examples.

## Spreadsheet handling

Use tolerant header matching. The canonical fields are:
- service_date
- rsad
- client
- location
- service

See `references/column_mapping.md`.

If the sheet uses variants such as `Data`, `NServiço`, `CLI_Nome`, `LocalDesc`, and `EventTypeDesc`, map them automatically.

## Operational routing guidance

Use the business rules in `references/business_rules.md`.

Operational defaults for this skill:
- Lisbon-heavy work should prefer `AA-14-HG`.
- Santarém-heavy work should prefer `AL-96-DL`.
- Alentejo-heavy work should prefer `37-ZH-01`.
- Clearly off-axis North/Algarve rows should be excluded unless the user explicitly instructs otherwise.
- Missing critical data should go to excluded services.

## Scripts

### Main script

Run:

```bash
python scripts/generate_schedule.py \
  --input <uploaded-file> \
  --timeframe "<user timeframe request>" \
  --service-template assets/service_template.docx \
  --excluded-template assets/excluded_template.docx \
  --output-dir <output-dir>
```

This script:
- reads CSV or XLSX
- maps columns
- parses the timeframe
- assigns conservative route clusters
- generates DOCX files using the bundled templates

## Output contract

Return only the generated DOCX files. Generate:
- `Folha_Servico_<date>_<vehicle>.docx`
- `Servicos_Excluidos_<date>.docx` when applicable

If no rows exist for the requested period, say that clearly and do not fabricate outputs.

## Resources

- `references/business_rules.md` — DSC rules and constraints
- `references/timeframe_examples.md` — supported timeframe phrasing
- `references/column_mapping.md` — column mapping rules
- `references/sample_prompts.md` — usage examples
- `assets/service_template.docx` — official route-sheet template
- `assets/excluded_template.docx` — official excluded-services template
