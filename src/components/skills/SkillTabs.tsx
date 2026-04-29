"use client";

export type TabId = "overview" | "instructions" | "references" | "assets" | "scripts" | "io" | "versions";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "overview", label: "Overview" },
  { id: "instructions", label: "Instructions" },
  { id: "references", label: "References" },
  { id: "assets", label: "Assets" },
  { id: "scripts", label: "Scripts" },
  { id: "io", label: "I / O" },
  { id: "versions", label: "Versions" },
];

interface SkillTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function SkillTabs({ activeTab, onTabChange }: SkillTabsProps) {
  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #E8E4DF',
      display: 'flex', gap: '2px', padding: '0 20px', flexShrink: 0, overflowX: 'auto',
    }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '12px 16px', background: 'none', border: 'none',
            fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 500,
            color: activeTab === tab.id ? '#1E4DB7' : '#7A7470',
            cursor: 'pointer', fontFamily: 'inherit',
            borderBottom: activeTab === tab.id ? '2px solid #1E4DB7' : '2px solid transparent',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
