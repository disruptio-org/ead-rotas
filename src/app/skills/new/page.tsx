"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, ArrowLeft, ArrowRight, Loader2, Sparkles, Check } from "lucide-react";

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
    <div style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <Link
        href="/skills"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#7A7470', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
          paddingBottom: '24px',
        }}
      >
        <ArrowLeft size={15} /> Voltar a Skills
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
            background: 'rgba(30,77,183,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#1E4DB7', flexShrink: 0,
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1714', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Criar Nova Skill
            </h1>
            <p style={{ color: '#7A7470', fontSize: '13px' }}>Passo {step} de 2</p>
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 28px', paddingTop: '20px' }}>
          {[1, 2].map(n => (
            <div key={n} style={{
              flex: 1, height: '4px', borderRadius: '99px',
              background: step >= n ? '#1E4DB7' : '#E8E4DF',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        <div style={{ padding: '28px' }}>
          {step === 1 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '7px' }}>
                  Nome da Skill <span style={{ color: '#1E4DB7' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="ex. DSC Rotas"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  autoFocus
                  style={{
                    width: '100%', background: '#F9F8F5', border: '1px solid #E8E4DF',
                    borderRadius: '9px', padding: '10px 14px', fontSize: '13.5px',
                    color: '#1A1714', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {slug && (
                  <div style={{ fontSize: '11px', color: '#9A9490', fontFamily: 'monospace', marginTop: '6px' }}>
                    Slug: <span style={{ color: '#4A4744' }}>{slug}</span>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '7px' }}>
                  Descrição (trigger)
                </label>
                <textarea
                  rows={3}
                  placeholder="Quando e como usar esta skill..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%', background: '#F9F8F5', border: '1px solid #E8E4DF',
                    borderRadius: '9px', padding: '10px 14px', fontSize: '13.5px',
                    color: '#1A1714', fontFamily: 'inherit', outline: 'none',
                    resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.displayName.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: !formData.displayName.trim() ? '#E8E4DF' : '#1E4DB7',
                    color: !formData.displayName.trim() ? '#9A9490' : '#fff',
                    border: 'none', borderRadius: '9px', padding: '9px 18px',
                    fontSize: '13px', fontWeight: 600, cursor: !formData.displayName.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Seguinte <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A4744', marginBottom: '10px' }}>
                  Template
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormData({ ...formData, template: t.id })}
                      style={{
                        textAlign: 'left', padding: '14px', borderRadius: '10px',
                        border: formData.template === t.id ? '2px solid #1E4DB7' : '1px solid #E8E4DF',
                        background: formData.template === t.id ? 'rgba(30,77,183,0.04)' : '#fff',
                        cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
                      }}
                    >
                      {formData.template === t.id && (
                        <div style={{
                          position: 'absolute', top: '10px', right: '10px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: '#1E4DB7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={10} color="#fff" />
                        </div>
                      )}
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1714', marginBottom: '4px' }}>{t.label}</div>
                      <div style={{ fontSize: '12px', color: '#7A7470' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div style={{
                background: '#F9F8F5', borderRadius: '10px', padding: '14px',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#9A9490', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                  Resumo
                </div>
                <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#7A7470' }}>Nome:</span>{' '}
                  <span style={{ color: '#1A1714', fontWeight: 600 }}>{formData.displayName}</span>
                </div>
                <div style={{ fontSize: '13px' }}>
                  <span style={{ color: '#7A7470' }}>Slug:</span>{' '}
                  <span style={{ fontFamily: 'monospace', color: '#4A4744' }}>{slug}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#F4F2EE', border: '1px solid #E8E4DF', borderRadius: '9px',
                    padding: '9px 16px', fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit', color: '#4A4744',
                  }}
                >
                  <ArrowLeft size={14} /> Anterior
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: loading ? '#E8E4DF' : '#1E4DB7',
                    color: loading ? '#9A9490' : '#fff',
                    border: 'none', borderRadius: '9px', padding: '9px 18px',
                    fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> A criar...</> : <><Code2 size={14} /> Criar Skill</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
