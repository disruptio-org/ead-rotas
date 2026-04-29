"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Save, ArrowLeft, Loader2, Check } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemInstructions: "Você é um assistente especializado da Papiro. A sua função é processar dados fornecidos pelo utilizador e gerar documentos estruturados seguindo as instruções da skill associada.\n\nSempre responda em português europeu.\nSeja conciso, preciso e profissional.",
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
        setSaved(true);
        setTimeout(() => router.push("/agents"), 1500);
      } else {
        alert("Erro ao criar agente.");
      }
    } catch {
      alert("Erro ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <Link
        href="/agents"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#7A7470', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
          paddingBottom: '24px', marginLeft: '-2px',
        }}
      >
        <ArrowLeft size={15} /> Voltar a Agentes
      </Link>

      <div style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #E8E4DF',
        overflow: 'hidden', maxWidth: '640px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '28px', borderBottom: '1px solid #F4F2EE',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'rgba(212,70,14,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#D4460E', flexShrink: 0,
          }}>
            <Bot size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Criar Novo Agente
            </h1>
            <p style={{ color: '#7A7470', fontSize: '14px' }}>
              Defina as instruções de sistema e associe skills ao seu agente.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '7px' }}>
              Nome do Agente <span style={{ color: '#D4460E' }}>*</span>
            </label>
            <input
              required
              type="text"
              placeholder="ex. DSC Planner"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%', background: '#F9F8F5', border: '1px solid #E8E4DF',
                borderRadius: '9px', padding: '10px 14px', fontSize: '13.5px',
                color: '#1A1714', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '7px' }}>
              Descrição Curta <span style={{ color: '#D4460E' }}>*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Breve descrição do propósito do agente"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%', background: '#F9F8F5', border: '1px solid #E8E4DF',
                borderRadius: '9px', padding: '10px 14px', fontSize: '13.5px',
                color: '#1A1714', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '7px' }}>
              Instruções de Sistema Base{' '}
              <span style={{ color: '#9A9490', fontWeight: 400, fontSize: '12px' }}>(Prompt)</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.systemInstructions}
              onChange={(e) => setFormData({ ...formData, systemInstructions: e.target.value })}
              style={{
                width: '100%', background: '#F9F8F5', border: '1px solid #E8E4DF',
                borderRadius: '9px', padding: '10px 14px', fontSize: '13px',
                color: '#1A1714', fontFamily: 'monospace', outline: 'none',
                resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={loading || !formData.name}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: (loading || !formData.name) ? '#E8E4DF' : '#D4460E',
                color: (loading || !formData.name) ? '#9A9490' : '#fff',
                border: 'none', borderRadius: '9px', padding: '10px 20px',
                fontSize: '13px', fontWeight: 600,
                cursor: (loading || !formData.name) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> A criar...</>
                : saved ? <><Check size={15} /> Criado!</>
                : <><Save size={15} /> Criar Agente</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
