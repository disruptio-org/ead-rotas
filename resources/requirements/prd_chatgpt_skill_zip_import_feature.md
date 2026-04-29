# PRD — ChatGPT Skill ZIP Import Feature

## 1. Overview

Add a feature to your platform that allows users to **import packaged ChatGPT-style skill files (`skill.zip`)** directly into your solution.

The imported skill should become a first-class object in your system, with:
- parsed metadata
- extracted instructions
- references
- assets
- scripts
- validation status
- compatibility report
- runnable execution profile

This feature is critical because it turns ChatGPT into a **skill authoring environment** and your app into the **skill runtime and orchestration layer**.

---

## 2. Product goal

Enable users to:
1. create or obtain a `skill.zip` from ChatGPT,
2. upload that ZIP into your app,
3. inspect and validate the imported skill,
4. resolve any compatibility issues,
5. publish it into their internal skill library,
6. run it inside their agent system.

---

## 3. Why this matters

Today, you can create skills in ChatGPT and package them as ZIPs. But without import support in your own solution:
- those skills are trapped in a separate environment,
- users must manually recreate them,
- version portability is lost,
- authoring and runtime are disconnected.

This feature creates a bridge:
- **ChatGPT = skill authoring**
- **your app = skill execution, governance, orchestration**

---

## 4. Problem statement

Users need a reliable way to bring externally-authored skills into the platform without:
- manually copying instructions,
- manually re-uploading templates/assets,
- losing structure,
- breaking execution.

The platform currently lacks a proper **skill ingestion pipeline**.

---

## 5. Success criteria

The feature is successful when a user can:
- upload a `skill.zip`,
- see whether it is valid,
- inspect its contents,
- understand what the skill does,
- import it as a platform skill,
- bind it to an agent,
- run it with uploaded inputs.

---

## 6. Scope

## In scope
- ZIP upload
- ZIP extraction
- skill structure detection
- metadata parsing
- file indexing
- validation
- compatibility analysis
- import wizard
- skill registration
- asset/reference/script storage
- version creation
- publish to skill library

## Out of scope for v1
- automatic rewriting of broken skills
- automatic execution sandbox for arbitrary scripts without review
- multi-skill ZIP bundles
- importing from remote URLs
- auto-conversion of non-ChatGPT agent formats

---

## 7. User stories

### Admin / builder
- As a builder, I want to upload a `skill.zip` so I can reuse a skill created in ChatGPT.
- As a builder, I want to see whether the skill is valid before importing it.
- As a builder, I want to inspect its contents before publishing it.
- As a builder, I want to know whether the skill is runnable in my app or needs adaptation.
- As a builder, I want imported skills to keep their files, structure, and version history.

### Operator
- As an operator, I want imported skills to show up in the skill library like native skills.
- As an operator, I want to attach an imported skill to an agent and run it.

---

## 8. Primary use case flow

1. User gets `skill.zip` from ChatGPT.
2. User opens “Import Skill” in your app.
3. User uploads ZIP.
4. System extracts archive.
5. System detects whether it contains exactly one skill.
6. System validates required structure.
7. System parses:
   - `SKILL.md`
   - `agents/openai.yaml`
   - `scripts/`
   - `references/`
   - `assets/`
8. System generates compatibility report.
9. User reviews import screen.
10. User clicks “Import”.
11. System stores the skill as a new versioned skill in platform DB/storage.
12. Skill appears in library as Draft or Published.
13. User can bind it to an agent and run it.

---

## 9. Functional requirements

## 9.1 Upload and extraction

### FR-01 Upload ZIP
The system must allow a user to upload a `.zip` file.

### FR-02 File type validation
The system must reject non-ZIP files.

### FR-03 Archive size validation
The system must enforce a configurable maximum upload size.

### FR-04 Safe extraction
The system must extract ZIP contents safely and reject:
- zip-slip path traversal
- malformed archives
- encrypted archives if unsupported

---

## 9.2 Skill detection

### FR-05 Detect skill root
The system must detect whether the archive contains a valid skill root.

### FR-06 Single-skill enforcement
For v1, the system must only allow archives containing exactly one skill.

### FR-07 Locate `SKILL.md`
The system must require `SKILL.md` to exist.

### FR-08 Locate optional folders
The system should detect:
- `agents/`
- `scripts/`
- `references/`
- `assets/`

---

## 9.3 Parsing

### FR-09 Parse frontmatter
The system must parse YAML frontmatter from `SKILL.md`.

### FR-10 Extract required metadata
The system must extract:
- `name`
- `description`

### FR-11 Parse body instructions
The system must extract the markdown body of `SKILL.md`.

### FR-12 Parse UI metadata
If present, the system must parse `agents/openai.yaml`.

### FR-13 Index files
The system must index all files in:
- scripts
- references
- assets

---

## 9.4 Validation

### FR-14 Structural validation
The system must validate:
- presence of `SKILL.md`
- valid YAML frontmatter
- required fields
- no duplicate/conflicting root structure

### FR-15 Compatibility validation
The system must determine whether the skill is:
- fully compatible
- partially compatible
- incompatible

### FR-16 Reference resolution
The system should detect references in `SKILL.md` to bundled files and verify they exist.

### FR-17 Script policy validation
The system must inspect scripts and classify them:
- runnable as-is
- requires review
- unsupported

### FR-18 Asset validation
The system must detect asset file types and sizes.

---

## 9.5 Import review UX

### FR-19 Show import summary
Before import, the user must see:
- skill name
- description
- detected folders
- number of scripts
- number of references
- number of assets
- compatibility status

### FR-20 Show validation issues
The user must see warnings/errors clearly.

### FR-21 Preview file tree
The user must be able to inspect the imported file structure.

### FR-22 Preview `SKILL.md`
The user must be able to read the parsed instructions before import.

### FR-23 Preview compatibility report
The user must see what may not work in your runtime.

---

## 9.6 Import and persistence

### FR-24 Create skill record
On successful import, the system must create a new skill record.

### FR-25 Create skill version
The imported archive must create a new immutable skill version.

### FR-26 Persist raw source files
The system must store imported files in object storage or equivalent.

### FR-27 Persist parsed metadata
The system must store parsed metadata in database fields for indexing/search.

### FR-28 Preserve original archive
The system should preserve the original uploaded ZIP for audit/debugging.

### FR-29 Draft import state
The imported skill should initially land as Draft unless auto-publish is enabled.

---

## 9.7 Runtime readiness

### FR-30 Execution profile generation
The system must derive an execution profile from the imported skill:
- required inputs
- output expectations
- script availability
- template assets
- runtime dependencies

### FR-31 Agent binding
The imported skill must be attachable to one or more agents.

### FR-32 Run eligibility status
The system must show whether the skill is runnable:
- ready to run
- needs configuration
- blocked

---

## 10. Non-functional requirements

### NFR-01 Security
Archive extraction and script ingestion must be sandbox-safe.

### NFR-02 Reliability
Imports should be deterministic and repeatable.

### NFR-03 Auditability
Every import must be logged with:
- user
- timestamp
- original file
- parsed result
- validation report

### NFR-04 Performance
Small/medium skill ZIP imports should complete quickly and feel interactive.

### NFR-05 Extensibility
The import pipeline should support future formats beyond ChatGPT skill ZIP.

---

## 11. Supported file model

Your importer should assume this target structure:

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
├── references/
└── assets/
```

### Required
- `SKILL.md`

### Optional
- `agents/openai.yaml`
- `scripts/*`
- `references/*`
- `assets/*`

---

## 12. Import pipeline architecture

## 12.1 Pipeline stages

### Stage 1 — Upload intake
- receive ZIP
- store temporary original file
- generate import job id

### Stage 2 — Archive inspection
- extract to temp sandbox
- scan files
- locate skill root
- reject invalid layouts

### Stage 3 — Parse
- parse `SKILL.md`
- extract metadata
- parse optional config files
- create file inventory

### Stage 4 — Validate
- structural validation
- compatibility validation
- file reference resolution
- policy checks

### Stage 5 — Review
- render import report in UI

### Stage 6 — Commit import
- persist skill
- persist skill version
- persist files
- preserve original ZIP
- mark skill state

---

## 13. Compatibility model

Define 3 compatibility classes.

### 13.1 Fully compatible
The skill:
- has valid structure
- uses supported file types
- has no unsupported script/runtime assumptions
- can run in your runtime

### 13.2 Partially compatible
The skill imports successfully, but:
- some scripts are unsupported
- some paths need remapping
- some assets exceed recommended limits
- some features can be stored but not executed yet

### 13.3 Incompatible
The skill cannot be imported cleanly because:
- `SKILL.md` missing
- frontmatter invalid
- structure broken
- unsupported packaging
- critical runtime requirements unavailable

---

## 14. Compatibility report design

The report should include:

### Overview
- skill name
- version/import timestamp
- compatibility status

### Structure
- skill root found
- required files present/missing

### Metadata
- parsed `name`
- parsed `description`

### Bundled resources
- scripts count
- references count
- assets count

### Warnings
Examples:
- `openai.yaml` missing
- script requires unsupported interpreter
- referenced template missing
- archive contains nested extra folders
- asset size too large

### Result
- import blocked / import allowed / import allowed with warnings

---

## 15. Data model

## 15.1 Skill
- id
- slug
- display_name
- description
- source_type (`native`, `imported_chatgpt`, etc.)
- current_version_id
- status
- created_at
- updated_at

## 15.2 SkillVersion
- id
- skill_id
- version_number
- source_archive_url
- skill_md_content
- openai_yaml_content
- compatibility_status
- validation_report_json
- import_manifest_json
- created_at
- created_by

## 15.3 SkillFile
- id
- skill_version_id
- path
- category (`script`, `reference`, `asset`, `config`, `root`)
- mime_type
- size_bytes
- storage_url
- checksum

## 15.4 SkillImportJob
- id
- uploaded_file_name
- uploaded_file_url
- status
- started_at
- completed_at
- validation_report_json
- error_message
- created_by

---

## 16. UX requirements

## 16.1 Import entry point
Add entry points in:
- Skill Library
- Agent skill management
- Dedicated “Import Skill” action

## 16.2 Import wizard steps

### Step 1 — Upload ZIP
Simple file drop/upload.

### Step 2 — Inspect
Show parsed summary.

### Step 3 — Validate
Show compatibility and issues.

### Step 4 — Confirm import
User chooses:
- import as draft
- import and publish
- cancel

### Step 5 — Result
Show imported skill detail page.

---

## 17. Skill detail page after import

After import, the skill page should show:
- imported badge
- source type: ChatGPT ZIP
- original file name
- import date
- compatibility status
- parsed `SKILL.md`
- file browser
- versions
- validation report
- bind to agent action

---

## 18. Security requirements

### 18.1 Archive security
Reject:
- path traversal
- hidden malicious path entries
- oversized decompression bombs

### 18.2 Script security
Do not auto-run imported scripts on import.

### 18.3 Safe storage
Store raw uploaded ZIP separately from extracted/imported files.

### 18.4 Policy layer
Introduce script execution policy:
- disabled by default
- enabled only in approved runtime environments

---

## 19. Execution model after import

Once imported, the skill should go through runtime normalization.

### Runtime normalization includes:
- determine supported scripts
- determine accepted file types
- determine expected outputs
- determine required user inputs/config
- determine whether templates/assets are available

This creates a runtime-ready manifest.

Example fields:
- `accepted_input_extensions`
- `needs_uploaded_file`
- `produces_docx`
- `requires_scripts`
- `requires_template_assets`
- `timeframe_prompt_supported`

---

## 20. API requirements

## POST `/api/skills/import`
Upload ZIP and create import job.

## GET `/api/skills/import/:jobId`
Return parse/validation status.

## POST `/api/skills/import/:jobId/commit`
Commit successful import into skill library.

## GET `/api/skills/:skillId`
Return skill metadata.

## GET `/api/skills/:skillId/versions/:versionId/files`
Return imported file tree.

## GET `/api/skills/:skillId/versions/:versionId/report`
Return compatibility report.

---

## 21. Error handling

The system must provide explicit user-facing errors for:
- invalid ZIP
- missing `SKILL.md`
- malformed YAML
- multiple skills found
- file too large
- unsupported script runtime
- corrupted archive
- reference mismatch

Errors must be actionable, not generic.

Bad:
- “Import failed”

Good:
- “Import failed because `SKILL.md` was not found at the skill root.”
- “Import blocked because the archive contains 2 skill roots. Only 1 is supported in v1.”

---

## 22. Metrics / KPIs

Track:
- number of imports attempted
- number of successful imports
- failure rate by reason
- percentage fully compatible
- percentage partially compatible
- time to import
- imported skills later executed successfully
- imported skills later bound to agents

---

## 23. Risks

### Risk 1 — Skills import but cannot run
Mitigation: compatibility report + runtime readiness status.

### Risk 2 — Security issues with ZIP/scripts
Mitigation: sandbox extraction + do not auto-run scripts.

### Risk 3 — Users assume all ChatGPT skills are runnable
Mitigation: clear compatibility classes and warnings.

### Risk 4 — Imported structure drifts from your native model
Mitigation: store both raw imported bundle and normalized internal model.

### Risk 5 — Future skill formats change
Mitigation: importer architecture should be adapter-based.

---

## 24. Recommended architecture approach

Implement the importer as a separate subsystem:

- `Archive Intake Service`
- `Skill Parser`
- `Skill Validator`
- `Compatibility Analyzer`
- `Import Commit Service`

Do **not** mix upload, validation, and persistence in one controller.

This will make it much easier to support:
- ChatGPT ZIP import
- native export/import
- future marketplace imports
- Git-based skill sync later

---

## 25. Phased rollout

## Phase 1 — Basic import
- upload ZIP
- parse structure
- validate `SKILL.md`
- import into library as draft

## Phase 2 — Review and compatibility
- compatibility report
- file browser
- imported skill detail page

## Phase 3 — Runtime integration
- bind imported skill to agents
- runtime readiness manifest
- execution support

## Phase 4 — Advanced
- re-import as new version
- diff between versions
- import from URL/repo
- bulk imports
- compatibility auto-fixes

---

## 26. Definition of done

This feature is done when:
1. a user can upload a ChatGPT-generated `skill.zip`;
2. the system validates it safely;
3. the system shows a compatibility report;
4. the user can import it into the library;
5. the imported skill appears as a versioned skill object;
6. the skill can be attached to an agent;
7. the platform can determine whether it is runnable.

---

## 27. Recommendation

The best implementation pattern is:

**store imported skills in two layers**
1. **raw imported bundle**  
2. **normalized platform representation**

That gives you:
- fidelity to the original ChatGPT package
- compatibility with your own runtime
- future reprocessing if your runtime evolves

This is the key architectural decision that will make the feature durable.
