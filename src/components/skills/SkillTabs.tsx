"use client";

import { ReactNode } from "react";

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
  { id: "io", label: "I/O Config" },
  { id: "versions", label: "Versions" },
];

interface SkillTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function SkillTabs({ activeTab, onTabChange }: SkillTabsProps) {
  return (
    <div className="flex gap-1 border-b border-zinc-800 overflow-x-auto scrollbar-none">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === tab.id
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
              : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
