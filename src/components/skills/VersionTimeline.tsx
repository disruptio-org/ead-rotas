"use client";

import { GitBranch, Rocket, Loader2 } from "lucide-react";

interface Version {
  id: string;
  versionNumber: string;
  createdAt: string;
  createdBy: string | null;
  _count: { executions: number; files: number };
}

interface VersionTimelineProps {
  versions: Version[];
  currentVersionId: string | null;
  onPublish: () => void;
  publishing: boolean;
}

export function VersionTimeline({
  versions,
  currentVersionId,
  onPublish,
  publishing,
}: VersionTimelineProps) {
  return (
    <div>
      {/* Publish Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#4A4744', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={14} color="#1E4DB7" /> Gestão de Versões
          </h3>
          <p style={{ fontSize: '12px', color: '#9A9490', marginTop: '4px' }}>
            Publicar cria um snapshot imutável. Execuções anteriores mantêm referência à versão usada.
          </p>
        </div>
        <button
          onClick={onPublish}
          disabled={publishing}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: '1px solid #E8E4DF', borderRadius: '7px',
            padding: '5px 12px', fontSize: '12px', fontWeight: 500,
            cursor: publishing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: '#4A4744',
          }}
        >
          {publishing ? (
            <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> A publicar...</>
          ) : (
            <><Rocket size={14} /> Publicar</>
          )}
        </button>
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {versions.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '200px', color: '#9A9490', border: '2px dashed #E8E4DF', borderRadius: '12px',
          }}>
            <GitBranch size={24} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#4A4744' }}>Nenhuma versão publicada</div>
          </div>
        ) : (
          versions.map((v, i) => {
            const isCurrent = v.id === currentVersionId || i === 0;
            return (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                paddingBottom: '24px', position: 'relative', paddingLeft: '20px',
              }}>
                {/* Timeline dot */}
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: isCurrent ? '#1E4DB7' : '#E8E4DF',
                  border: isCurrent ? '3px solid rgba(30,77,183,0.2)' : 'none',
                  flexShrink: 0, marginTop: '3px', position: 'absolute', left: 0,
                }} />
                {/* Timeline line */}
                {i < versions.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '5px', top: '18px', width: '2px',
                    height: 'calc(100% - 6px)', background: '#E8E4DF',
                  }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1714', fontFamily: 'monospace' }}>
                    v{v.versionNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9A9490', marginTop: '2px' }}>
                    {new Date(v.createdAt).toLocaleDateString("pt-PT", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A7470', marginTop: '2px' }}>
                    {v._count.executions} execuções
                  </div>
                  {isCurrent && (
                    <span style={{
                      display: 'inline-block', background: 'rgba(30,77,183,0.08)',
                      color: '#1E4DB7', borderRadius: '4px', padding: '2px 8px',
                      fontSize: '10.5px', fontWeight: 600, marginTop: '4px',
                    }}>
                      Atual
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
