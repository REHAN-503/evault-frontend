import { useState } from 'react';

export function HashChip({ value, chars = 10 }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const short = `${value.slice(0, chars)}…${value.slice(-4)}`;
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      title={value}
      className="group inline-flex items-center gap-1.5 rounded-md border border-line bg-white/70 px-2 py-1 font-mono text-[11px] text-ink-2 hover:border-seal/60 hover:bg-seal/5 transition-colors"
    >
      {short}
      <span className="text-slate group-hover:text-seal transition-colors">{copied ? '✓' : '⧉'}</span>
    </button>
  );
}

const statusStyles = {
  verified: 'bg-verified-bg text-verified-dark border-verified/30',
  pending: 'bg-seal/10 text-seal-dark border-seal/30',
  flagged: 'bg-maroon/10 text-maroon-dark border-maroon/30',
  active: 'bg-verified-bg text-verified-dark border-verified/30',
};

export function StatusPill({ status }) {
  const cls = statusStyles[status] || 'bg-slate/10 text-slate border-slate/20';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

const accentText = {
  ink: 'text-ink',
  seal: 'text-seal-dark',
  verified: 'text-verified-dark',
  maroon: 'text-maroon-dark',
};

export function StatCard({ label, value, sub, accent = 'ink' }) {
  return (
    <div className="rounded-xl border border-line bg-white/70 p-5 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate font-medium">{label}</p>
      <p className={`mt-3 font-display text-3xl ${accentText[accent] || accentText.ink}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate">{sub}</p>}
    </div>
  );
}
