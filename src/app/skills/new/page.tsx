"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

const TEMPLATES = [
  { id: "empty", label: "Vazia", desc: "Skill em branco." },
  { id: "documental", label: "Documental", desc: "Lê documentos e gera outputs." },
  { id: "analytical", label: "Analítica", desc: "Analisa dados e produz relatórios." },
  { id: "workflow", label: "Workflow", desc: "Orquestra passos sequenciais." },
];

export default function NewSkillPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ displayName: "", description: "", template: "empty" });

  const slug = formData.displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 64);

  const handleCreate = async () => {
    if (!formData.displayName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const skill = await res.json();
        router.push(`/skills/${skill.id}`);
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao criar skill.");
      }
    } catch { alert("Erro ao comunicar com o servidor."); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-10 w-full h-full">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/skills" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar a Skills
        </Link>
        <div className="border-b border-zinc-800 pb-6 flex items-center space-x-4">
          <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400"><Sparkles className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Criar Nova Skill</h1>
            <p className="text-zinc-400 mt-1">Passo {step} de 2</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-indigo-500" : "bg-zinc-800"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-indigo-500" : "bg-zinc-800"}`} />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Nome da Skill</label>
              <input type="text" placeholder="Ex: DSC Rotas" value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" autoFocus />
              {slug && <p className="text-xs text-zinc-600 font-mono">Slug: <span className="text-zinc-400">{slug}</span></p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Descrição (trigger)</label>
              <textarea rows={3} placeholder="Quando e como usar esta skill..." value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={() => setStep(2)} disabled={!formData.displayName.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white rounded-xl transition-colors">
                Seguinte <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-4 block">Template</label>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => setFormData({ ...formData, template: t.id })}
                    className={`text-left p-4 rounded-xl border transition-all ${formData.template === t.id ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"}`}>
                    <div className="text-sm font-bold text-zinc-200 mb-1">{t.label}</div>
                    <div className="text-xs text-zinc-500">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Resumo</div>
              <div className="text-sm"><span className="text-zinc-500">Nome:</span> <span className="text-white font-medium">{formData.displayName}</span></div>
              <div className="text-sm"><span className="text-zinc-500">Slug:</span> <span className="text-zinc-300 font-mono">{slug}</span></div>
            </div>
            <div className="pt-4 flex justify-between">
              <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700">
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              <button onClick={handleCreate} disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A criar...</> : <><Code2 className="w-4 h-4" /> Criar Skill</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
