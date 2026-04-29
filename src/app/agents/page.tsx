"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Plus, ArrowRight, UserCog } from "lucide-react";
import React from "react";

type Agent = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-10 w-full h-full">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-100 to-emerald-400 bg-clip-text text-transparent">Agentes</h1>
            <p className="text-zinc-500 mt-2">Faça a gestão dos seus Agentes Operacionais e associar-lhes novas Skills.</p>
          </div>
          <Link href="/agents/new" className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-800/60 shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
                      <UserCog className="w-6 h-6" />
                    </div>
                    <span className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {agent.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">{agent.name}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {agent.description || "Sem descrição definida."}
                  </p>
                </div>
                <div className="mt-8 border-t border-zinc-800/80 pt-4 flex justify-between items-center">
                  <Link href={`/agents/${agent.id}`} className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center transition-colors">
                    Gerir Agente <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
            
            {agents.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 border border-zinc-800/50 border-dashed rounded-3xl">
                <Bot className="w-12 h-12 mb-4 opacity-50" />
                <p>Nenhum agente criado ainda.</p>
                <Link href="/agents/new" className="mt-4 text-emerald-500 hover:underline">
                  Comece por criar o primeiro agente.
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
