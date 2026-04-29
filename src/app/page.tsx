"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bot, Code2, ArrowRight, Play, Briefcase } from "lucide-react";
import { launchDSCPlaneamento } from "@/app/actions/quickLaunch";

export default function DashboardPage() {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const agentId = await launchDSCPlaneamento();
      router.push(`/agents/${agentId}`);
    } catch (e) {
      alert("Erro ao iniciar launcher.");
      setLaunching(false);
    }
  };

  return (
    <div className="relative p-10 h-full w-full">
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-50">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Agents OS</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Sua plataforma para automatização e delegação de processos logísticos complexos. 
            Transforme conhecimentos repetitivos em Agentes e Skills reutilizáveis.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-8 shadow-2xl transition-all hover:bg-zinc-800/80 hover:border-emerald-500/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="bg-emerald-500/10 p-3 w-max rounded-xl">
                  <Bot className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Agentes Customizados</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                    Configure agentes especialistas com instruções específicas de comportamento para orquestrar as suas Skills.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/agents/new" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400">
                Criar Agente
              </Link>
              <Link href="/agents" className="inline-flex items-center justify-center rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white">
                Ver Todos
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-8 shadow-2xl transition-all hover:bg-zinc-800/80 hover:border-indigo-500/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="bg-indigo-500/10 p-3 w-max rounded-xl">
                  <Code2 className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Skills Studio</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                    Crie fluxos de trabalho (Skills) que aceitam ficheiros de entrada, usam LLMs para raciocínio e geram templates DOCX.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/skills/new" className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400">
                Nova Skill
              </Link>
              <Link href="/skills" className="inline-flex items-center justify-center rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white">
                Ver Biblioteca
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Launch / Recent */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Casos de Uso Rápidos</h2>
          </div>
          <div 
            onClick={handleLaunch}
            className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 flex items-center justify-between hover:bg-zinc-800/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-50">Planeamento DSC <span className="ml-2 text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">MVP</span></h4>
                <p className="text-sm text-zinc-500 mt-1">Carregar Excel de serviços e gerar rotas otimizadas.</p>
              </div>
            </div>
            <div className="flex items-center text-emerald-500 font-medium">
              Executar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
