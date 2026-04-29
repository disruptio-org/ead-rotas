"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemInstructions: "You are a helpful operational agent."
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/agents");
      } else {
        alert("Erro ao criar agente.");
      }
    } catch (e) {
      alert("Erro ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 w-full h-full">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <Link href="/agents" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar a Agentes
        </Link>
        
        <div className="border-b border-zinc-800 pb-6 flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Criar Novo Agente</h1>
            <p className="text-zinc-400 mt-1">Configure a identidade fundamental e propósito do seu agente.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Nome do Agente</label>
            <input
              required
              type="text"
              placeholder="Ex: Planeamento Operacional DSC"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Descrição Curta</label>
            <input
              required
              type="text"
              placeholder="Uma frase sobre o propósito deste agente"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Instruções de Sistema Base (Prompt)</label>
            <p className="text-xs text-zinc-500 mb-2">Comportamento de alto nível que precede qualquer skill específica.</p>
            <textarea
              required
              rows={5}
              placeholder="És um coordenador logístico encarregue de otimizar..."
              value={formData.systemInstructions}
              onChange={(e) => setFormData({ ...formData, systemInstructions: e.target.value })}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm leading-relaxed resize-none"
            />
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-950 mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? "A Guardar..." : "Criar Agente"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
