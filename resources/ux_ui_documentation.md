# Agents OS — UX/UI Technical Documentation

**Platform**: Agents OS (Rotas)  
**Client**: EAD  
**Version**: v1.0.0  
**Last updated**: April 2026  
**Live URL**: https://ead-rotas-production.up.railway.app  

---

## 1. Design System

### Typography
- **Font Family**: Inter (Google Fonts), loaded as the primary sans-serif
- **Headings**: `font-bold` / `font-extrabold` with `tracking-tight`
- **Monospace**: Used for slugs, version numbers, JSON, and technical labels
- **Antialiased** rendering is globally enabled

### Color Palette
The application uses a **dark-mode-only** design with the following primary palette:

| Token             | Usage                          | Color                    |
|---|---|---|
| `zinc-950`        | Sidebar background             | `#09090b`                |
| `zinc-900/40`     | Main content background        | Semi-transparent dark    |
| `emerald-400/500` | Primary brand / Agents accent  | `#34d399` / `#10b981`   |
| `indigo-400/500`  | Skills accent                  | `#818cf8` / `#6366f1`   |
| `zinc-800`        | Borders, dividers              | `#27272a`                |
| `zinc-400/500`    | Secondary text, muted labels   | `#a1a1aa` / `#71717a`   |
| `red-400/500`     | Errors, destructive actions    | `#f87171`                |
| `amber-400/500`   | Warnings, alerts               | `#fbbf24`                |
| `blue-400/500`    | Validated status               | `#60a5fa`                |

### Visual Effects
- **Grid pattern overlay**: Subtle `24×24px` grid applied to the main content area (`linear-gradient` with `#80808012`)
- **Gradient text**: Headers use `bg-clip-text text-transparent` with emerald or indigo gradients
- **Glassmorphism**: Semi-transparent backgrounds (`bg-zinc-900/40`, `bg-zinc-900/50`)
- **Micro-animations**: Hover transitions on all interactive elements (`transition-all`, `transition-colors`)
- **Arrow slide**: `→` arrows shift right on card hover (`group-hover:translate-x-1`)
- **Top accent lines**: Cards have a hidden top gradient bar that reveals on hover (`opacity-0 → opacity-100`)

### Component Patterns
- **Cards**: `rounded-2xl` or `rounded-3xl`, `border border-zinc-800/80`, `shadow-lg`
- **Buttons (Primary)**: `bg-emerald-500` (agents) or `bg-indigo-500` (skills), `rounded-xl`, `font-bold`
- **Buttons (Secondary)**: `bg-zinc-800`, `text-zinc-300`, `rounded-xl`
- **Inputs**: `bg-zinc-900/50`, `border-zinc-800`, `rounded-xl`, focus ring with `ring-2 ring-[accent]/50`
- **Status badges**: Pill-shaped, `rounded-full`, colored background + border + text per status
- **Loading**: `Loader2` icon with `animate-spin`, paired with text
- **Empty states**: Dashed border container with icon + message + action link

### Icon System
- **Library**: Lucide React (all icons from `lucide-react`)
- **Key icons used**:
  - `Bot` — Agents
  - `Code2` — Skills
  - `Home` — Dashboard
  - `History` — Execution log
  - `Settings` — Settings
  - `Plus`, `ArrowRight`, `ArrowLeft` — Navigation
  - `Save`, `Trash2`, `CheckCircle`, `Loader2` — Actions
  - `Paperclip`, `Send` — File upload + execution
  - `Upload`, `FileArchive`, `Package` — Import flow
  - `AlertTriangle`, `XCircle` — Errors/warnings

---

## 2. Global Layout

### Structure
```
┌─────────────────────────────────────────────────┐
│ Sidebar (240px fixed)  │  Main Content (flex-1)  │
│                        │                         │
│  Logo: AGENTS OS       │  24px grid overlay      │
│  ──────────────        │  ┌───────────────────┐  │
│  • Dashboard           │  │                   │  │
│  • Agents              │  │  Page Content     │  │
│  • Skills Studio       │  │  (max-w-5xl)      │  │
│  • Execution Log       │  │                   │  │
│  ──────────────        │  └───────────────────┘  │
│  • Settings            │                         │
└─────────────────────────────────────────────────┘
```

### Sidebar (`Sidebar.tsx`)
- **Width**: `w-60` (240px), fixed, `shrink-0`
- **Background**: `bg-zinc-950`, right border `border-zinc-800/60`
- **Logo area**: `h-16`, Bot icon in emerald tinted container + gradient text "AGENTS OS"
- **Navigation items**: 4 main items + 1 bottom Settings link
  - Active state: `bg-emerald-500/10 text-emerald-400`
  - Inactive state: `text-zinc-500 hover:bg-zinc-800/50`
  - Items use `rounded-xl px-3 py-2.5`
- **Bottom section**: Separated by `border-t border-zinc-800/60`

### Main Content Area
- `flex-1 overflow-y-auto bg-zinc-900/40`
- Grid overlay: absolute positioned, `pointer-events-none`
- Individual pages add `p-10` and center content with `max-w-5xl mx-auto`

---

## 3. Pages

### 3.1 Dashboard (`/`)

**Purpose**: Landing page with quick actions and use case launchers.

**Layout**: Single column, `max-w-5xl`, 3 sections vertically stacked.

**Section 1 — Header**
- H1: "Welcome to **Agents OS**" (with emerald gradient on "Agents OS")
- Subtitle: Portuguese description of the platform

**Section 2 — Action Cards** (2-column grid on `md:`)
- **Card 1: "Agentes Customizados"** (emerald accent)
  - Bot icon in tinted container
  - Title + description paragraph
  - Two buttons: "Criar Agente" (primary emerald) + "Ver Todos" (secondary)
  - Top accent bar on hover (emerald gradient)
  
- **Card 2: "Skills Studio"** (indigo accent)
  - Code2 icon in tinted container
  - Title + description paragraph
  - Two buttons: "Nova Skill" (primary indigo) + "Ver Biblioteca" (secondary)
  - Top accent bar on hover (indigo gradient)

**Section 3 — "Casos de Uso Rápidos"**
- H2 heading
- Single clickable row card: "Planeamento DSC" with MVP badge
  - Briefcase icon in circle, description text
  - "Executar →" action on the right
  - On click: creates a new agent execution and navigates to it

---

### 3.2 Agents List (`/agents`)

**Purpose**: Grid view of all configured agents.

**Header bar**:
- H1: "Agentes" (emerald gradient text)
- Subtitle: Portuguese description
- "Novo Agente" button (emerald, Plus icon)

**Content**:
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Agent card** (`rounded-2xl`):
  - UserCog icon in emerald tinted container
  - Status badge (emerald pill)
  - Agent name (H3, bold)
  - Description (clamped to 3 lines)
  - Footer: "Gerir Agente →" link (emerald, with hover arrow animation)
- **Empty state**: Dashed border, Bot icon, "Nenhum agente criado" message + create link

---

### 3.3 Create Agent (`/agents/new`)

**Purpose**: Form to create a new agent.

**Layout**: Single column, `max-w-3xl`.

**Navigation**: "← Voltar a Agentes" back link.

**Header**: Bot icon + "Criar Novo Agente" title + subtitle.

**Form fields**:
1. **Nome do Agente** — text input, required
2. **Descrição Curta** — text input, required
3. **Instruções de Sistema Base (Prompt)** — textarea (5 rows), monospace, pre-filled with default prompt

**Submit**: "Criar Agente" button with Save icon (emerald), loading spinner state.

---

### 3.4 Agent Execution Workspace (`/agents/[id]`)

**Purpose**: Chat-like interface for executing skills on an agent. This is the **primary operational screen**.

**Layout**: Full-height, 3-panel layout.

```
┌──────────────────────────────────────────────────┐
│ Header Bar (agent name, active skill, controls)  │
├──────────┬───────────────────────────────────────┤
│ History  │  Results Area                         │
│ Sidebar  │                                       │
│ (w-72)   │  ┌─────────────────────────────────┐  │
│          │  │  Result Panel / Empty State /    │  │
│ • exec 1 │  │  Loading spinner / Error card    │  │
│ • exec 2 │  └─────────────────────────────────┘  │
│ • exec 3 │                                       │
│          ├───────────────────────────────────────┤
│          │  Input Bar (textarea + file + execute) │
└──────────┴───────────────────────────────────────┘
```

**Header Bar**:
- Back arrow → `/agents`
- Bot icon + agent name
- Active skill label (indigo) with (×) remove button
- "(alterar)" button to open Skill Picker dropdown
- **Skill Picker**: Floating dropdown (`w-80`, `shadow-2xl`), lists all available skills with bind/unbind actions

**History Sidebar** (`w-72`):
- "Histórico" label
- List of past executions, each showing:
  - Status badge (completed/running/failed)
  - Timestamp
  - Summary (2-line clamp)
- Clickable — loads result into main panel

**Results Area**:
- **Empty state**: Bot icon in circle, "Pronto para executar" heading, instruction text
- **Loading state**: Spinner + "A processar dados e consultar o modelo..."
- **Error state**: Red bordered card with XCircle icon + monospace error text
- **Success state**: `ResultPanel` component (see Components section)

**Input Bar** (bottom, fixed):
- Textarea (2 rows), resizable-feel within rounded container
- Paperclip icon for file upload (`.xlsx`, `.xls`, `.csv`)
- Attached file shown as emerald pill with 📎 icon
- "Executar" button (emerald) with Send icon
- `⌘+Enter` keyboard shortcut label

---

### 3.5 Skills Library (`/skills`)

**Purpose**: Browsable, filterable grid of all skills.

**Header bar**:
- H1: "Skills Studio" (indigo gradient text)
- Subtitle in Portuguese
- "Importar ZIP" button (secondary, Upload icon)
- "Nova Skill" button (primary indigo, Plus icon)

**Filters bar**:
- Search input with Search icon (left), `rounded-xl`
- Status filter pills: Todos | Draft | Validated | Published | Deprecated

**Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**Skill Card** (`rounded-2xl`):
- Code2 icon in indigo tinted container
- Version badge (monospace, e.g. "v1.0.0")
- Display name (H3)
- Slug (monospace, muted)
- Description (3-line clamp)
- Footer divider with:
  - Status badge pill (colored per status)
  - "Imported" badge (if source is ChatGPT)
  - Agent count label
  - "Editar →" link (indigo, hover arrow animation)

**Empty state**: Dashed border, Code2 icon, "Nenhuma skill" message.

---

### 3.6 Create Skill (`/skills/new`)

**Purpose**: 2-step wizard for creating a new skill.

**Layout**: `max-w-2xl`, stepper progress bar.

**Step 1 — Identity**:
- "Nome da Skill" text input
- Auto-generated slug preview (monospace)
- "Descrição (trigger)" textarea
- "Seguinte →" button

**Step 2 — Template**:
- 2×2 grid of template cards:
  - Vazia, Documental, Analítica, Workflow
  - Selected state: indigo border + ring
- Summary card showing Name + Slug
- "← Anterior" + "Criar Skill" buttons

---

### 3.7 Skill Editor (`/skills/[id]`)

**Purpose**: Full-featured editor for managing a skill's content, files, and versions.

**Layout**: Full-height, header + tabs + tab content.

**Header Bar**:
- Back arrow → `/skills`
- Code2 icon + skill name + slug + version + status badge + "Imported" badge
- "Eliminar" (red, destructive) + "Guardar" (indigo primary) buttons
- Save confirmation: shows ✓ Guardado! for 3 seconds

**Tab Bar** (7 tabs, horizontal scroll):
| Tab | Label | Content |
|---|---|---|
| `overview` | Overview | Name input + description textarea + associated agents list + ValidationPanel |
| `instructions` | Instructions | Markdown editor (`SkillMdEditor`) |
| `references` | References | File manager for reference documents |
| `assets` | Assets | File manager for template files (DOCX, etc.) |
| `scripts` | Scripts | Read-only list of built-in scripts with metadata |
| `io` | I/O Config | Input/Output JSON schema textareas (monospace, emerald text) |
| `versions` | Versions | Version timeline with publish action |

---

### 3.8 Import Skill (`/skills/import`)

**Purpose**: 5-step wizard for importing a ChatGPT-compatible skill package (.zip).

**Layout**: `max-w-3xl`, 5-step progress bar.

**Step 1 — Upload**:
- Drag-and-drop zone (`border-dashed`, `rounded-2xl`)
  - Changes color on drag (indigo), file selected (emerald)
  - Upload icon, file name + size display
- "Importar e Analisar →" button

**Step 2 — Inspect**:
- Skill summary card: name, description, tags
- 4 stat cards (grid-cols-4): References, Assets, Scripts, Total Files
- `FileTreePreview` component showing file structure
- SKILL.md content preview (monospace, max 2000 chars)

**Step 3 — Validate**:
- `CompatibilityReport` component showing compatibility status + issues
- Color-coded: fully_compatible (green), partially (amber), incompatible (red)

**Step 4 — Confirm**:
- Summary card: name, file count, source type, compatibility
- Import option: "Importar como Draft" vs "Importar e Publicar" (radio-style cards)

**Step 5 — Result**:
- Success screen with large CheckCircle icon
- "Skill Importada com Sucesso!" heading
- "Voltar a Skills" + "Ver Skill Importada" buttons

---

### 3.9 Execution Log (`/history`)

**Purpose**: Master-detail view of all past executions across all agents.

**Layout**: Full-height, 2-panel split.

```
┌────────────────────┬──────────────────────────────┐
│ Execution List     │  Execution Detail            │
│ (w-1/3, min 300px) │                              │
│                    │  Agent + Skill + Timestamp    │
│ ● completed 14:30  │  Duration                    │
│ ● failed    14:15  │                              │
│ ● completed 13:00  │  ResultPanel                 │
│                    │  [Repetir Execução] button    │
└────────────────────┴──────────────────────────────┘
```

**Left panel — List**:
- "Execution Log" heading + count
- Execution cards showing:
  - Status icon (CheckCircle/XCircle/Loader2) + status badge
  - Timestamp
  - Agent name (Bot icon) + Skill name (Code2 icon)
  - Summary (2-line clamp)
- Selected state: emerald border + tinted background

**Right panel — Detail**:
- **Empty state**: Clock icon + "Selecione uma execução"
- **Selected**: Agent + Skill labels, timestamp, duration calculation
- "Repetir Execução" button (navigates to agent workspace)
- `ResultPanel` component with full result rendering

---

## 4. Key Components

### ResultPanel (`components/ResultPanel.tsx`)
Renders structured execution results. Adapts to JSON output format:
- **Status indicator**: CheckCircle (green) or XCircle (red)
- **Summary text** + execution ID
- **Stats grid** (3 columns): Total / Incluídos / Excluídos
- **Generated files**: Download links with FileDown icon (indigo styled)
- **Alerts list**: Amber cards with AlertTriangle icons
- **Vehicle plan**: Grouped list per vehicle with service items
- **Raw JSON toggle**: Collapsible monospace pre block
- **Error detail**: Red monospace block for failed executions

### FileManager (`components/skills/FileManager.tsx`)
Drag-and-drop file upload interface for skill references and assets. Shows uploaded files in a list with delete actions.

### SkillMdEditor (`components/skills/SkillMdEditor.tsx`)
Full-height textarea for editing SKILL.md content. Monospace font, dark background.

### VersionTimeline (`components/skills/VersionTimeline.tsx`)
Vertical timeline of skill versions with publish button. Shows version numbers, creation dates, and execution counts.

### ValidationPanel (`components/skills/ValidationPanel.tsx`)
One-click validation runner for skills. Shows pass/fail results and issue list.

### CompatibilityReport (`components/skills/CompatibilityReport.tsx`)
Visual compatibility report for imported skills. Color-coded header (green/amber/red) with categorized issue list.

### FileTreePreview (`components/skills/FileTreePreview.tsx`)
Tree-view rendering of skill package file structure, showing directory hierarchy.

---

## 5. Data Model Overview

| Entity | Purpose |
|---|---|
| **Agent** | Operational agent with name, description, system instructions |
| **Skill** | Reusable workflow definition (slug, display name, status, tags) |
| **SkillVersion** | Versioned snapshot of a skill's content and config |
| **SkillFile** | Files attached to a version (references, assets, scripts) |
| **AgentSkill** | Many-to-many binding between agents and skills |
| **Execution** | Runtime execution record (status, summary, raw JSON output) |
| **ExecutionFile** | Files associated with an execution (input/output) |
| **SkillImportJob** | Tracks ZIP import workflow state |

### Status Lifecycle
```
Skill:   draft → validated → published → deprecated → archived
Agent:   active
Execution: running → completed | failed
```

---

## 6. Language & Localization

- **UI labels**: Primarily **Portuguese (pt)** (`html lang="pt"`)
- **Technical terms**: English (e.g., "Draft", "Published", "Overview", "Scripts")
- **Mixed approach**: Portuguese descriptions with English UI framework terms
- **Date format**: `pt-PT` locale for timestamps

---

## 7. Responsive Behavior

- **Sidebar**: Fixed `w-60`, does not collapse (no mobile sidebar toggle currently)
- **Card grids**: Responsive via `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Agent workspace**: History sidebar (`w-72`) is fixed width
- **Execution log**: Fixed 1/3 + 2/3 split
- **No dedicated mobile breakpoints** — designed primarily for desktop use

---

## 8. Interaction Patterns

| Pattern | Implementation |
|---|---|
| **Card hover** | Border color change + background darken + accent bar reveal |
| **Button states** | `disabled:opacity-40`, `hover:bg-[lighter]`, loading spinner |
| **Save feedback** | ✓ checkmark replaces save icon for 3 seconds |
| **Delete confirm** | Browser `confirm()` dialog |
| **File upload** | Hidden `<input>`, triggered via icon click or drag-and-drop |
| **Keyboard shortcut** | `⌘+Enter` to execute in agent workspace |
| **Error display** | Red bordered cards with monospace error text |
| **Loading** | Centered spinner + descriptive text |
| **Empty states** | Dashed border + icon + text + action link |

---

## 9. File Structure Reference

```
src/
├── app/
│   ├── layout.tsx              # Root layout (sidebar + main)
│   ├── page.tsx                # Dashboard
│   ├── globals.css             # Design tokens (Tailwind + shadcn)
│   ├── agents/
│   │   ├── page.tsx            # Agent list
│   │   ├── new/page.tsx        # Create agent form
│   │   └── [id]/page.tsx       # Agent execution workspace
│   ├── skills/
│   │   ├── page.tsx            # Skills library grid
│   │   ├── new/page.tsx        # 2-step create wizard
│   │   ├── [id]/page.tsx       # Skill editor (7 tabs)
│   │   └── import/page.tsx     # 5-step import wizard
│   ├── history/
│   │   └── page.tsx            # Execution log (master-detail)
│   └── api/                    # REST API routes
├── components/
│   ├── Sidebar.tsx             # Global navigation
│   ├── ResultPanel.tsx         # Execution result renderer
│   └── skills/
│       ├── SkillTabs.tsx       # Tab bar for skill editor
│       ├── SkillMdEditor.tsx   # Markdown editor
│       ├── FileManager.tsx     # File upload/management
│       ├── FileTreePreview.tsx # ZIP file tree visualization
│       ├── ValidationPanel.tsx # Skill validation runner
│       ├── VersionTimeline.tsx # Version history timeline
│       └── CompatibilityReport.tsx # Import compatibility report
└── lib/
    ├── prisma.ts               # Database client
    └── skills/                 # Skill engine (parser, validator, etc.)
```
