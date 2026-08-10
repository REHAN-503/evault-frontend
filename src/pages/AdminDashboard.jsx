import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { register } from '../api/auth';
import { grantAccess } from '../api/documents';
import { getSystemStatus, getSystemInfo } from '../api/system';
import { StatusPill, StatCard } from '../components/Atoms';
import { Server, Database, Activity, UserPlus, Key } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'LAWYER' });
  const [grant, setGrant] = useState({ docId: '', userId: '' });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  async function refresh() {
    try {
      setStatus(await getSystemStatus());
      setInfo(await getSystemInfo());
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleRegister(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      setForm({ fullName: '', email: '', password: '', role: 'LAWYER' });
      setNote('Participant registered successfully.');
    } catch (err) {
      setNote(`Error: ${err.message}`);
    }
    setBusy(false);
    setTimeout(() => setNote(''), 4000);
  }

  async function handleGrant(e) {
    e.preventDefault();
    if (!grant.docId || !grant.userId) return;
    setBusy(true);
    try {
      await grantAccess(grant.docId, grant.userId, 'READ');
      setNote(`Access granted to ${grant.userId}.`);
      setGrant({ docId: '', userId: '' });
    } catch (err) {
      setNote(`Error: ${err.message}`);
    }
    setBusy(false);
    setTimeout(() => setNote(''), 4000);
  }

  return (
    <PortalShell role="admin" user={user}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate font-bold mb-1">Administration</p>
          <h1 className="font-display text-3xl">System Dashboard</h1>
        </div>
        {note && (
          <div className="bg-ink text-paper px-4 py-2 rounded shadow-sm text-xs font-medium animate-riseIn">
            {note}
          </div>
        )}
      </div>

      {info && info.metrics && (
        <div className="grid sm:grid-cols-4 gap-5 mb-10">
          <StatCard label="Total Documents" value={info.metrics.totalDocuments} />
          <StatCard label="Verified Today" value={info.metrics.verifiedToday || 0} accent="verified" />
          <StatCard label="Audit Events" value={info.metrics.auditEvents || 0} />
          <StatCard label="Registered Users" value={info.metrics.registeredUsers || 0} accent="seal" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          {/* Register */}
          <div className="rounded-xl border border-line bg-white/70 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus size={18} className="text-seal" />
              <h2 className="font-display text-lg font-medium">Register Participant</h2>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate mb-1 font-medium">Full Name</label>
                <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-seal outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate mb-1 font-medium">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-seal outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate mb-1 font-medium">Password</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-seal outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate mb-1 font-medium">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-seal outline-none">
                  <option value="LAWYER">Lawyer / Client</option>
                  <option value="JUDGE">Judge / Court</option>
                  <option value="ADMIN">Registry Admin</option>
                </select>
              </div>
              <button disabled={busy} className="w-full rounded-md bg-ink text-paper py-2.5 text-sm font-medium hover:bg-ink-2 transition-colors disabled:opacity-60 mt-2">
                Register
              </button>
            </form>
          </div>

          {/* Access */}
          <div className="rounded-xl border border-line bg-white/70 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Key size={18} className="text-seal" />
              <h2 className="font-display text-lg font-medium">Grant Access</h2>
            </div>
            <form onSubmit={handleGrant} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate mb-1 font-medium">Document ID</label>
                <input required value={grant.docId} onChange={(e) => setGrant({ ...grant, docId: e.target.value })}
                  placeholder="e.g. DOC-12345"
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-seal outline-none font-mono" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate mb-1 font-medium">Participant ID</label>
                <input required value={grant.userId} onChange={(e) => setGrant({ ...grant, userId: e.target.value })}
                  placeholder="e.g. usr_105"
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-seal outline-none font-mono" />
              </div>
              <button disabled={busy} className="w-full rounded-md bg-ink text-paper py-2.5 text-sm font-medium hover:bg-ink-2 transition-colors disabled:opacity-60 mt-6">
                Grant Access
              </button>
            </form>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-xl border border-line bg-white/70 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-seal" />
            <h2 className="font-display text-lg font-medium">Infrastructure</h2>
          </div>
          
          {status ? (
            <div className="space-y-5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink flex items-center gap-2">
                  <Server size={14} className="text-slate" /> API Gateway
                </span>
                <StatusPill status={status.status === 'ok' ? 'active' : 'pending'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink flex items-center gap-2">
                  <Database size={14} className="text-slate" /> Database
                </span>
                <StatusPill status={status.services?.database === 'connected' ? 'active' : 'pending'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink flex items-center gap-2">
                  <Activity size={14} className="text-slate" /> Ledger Network
                </span>
                <StatusPill status={status.services?.blockchain === 'operational' ? 'active' : 'pending'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink flex items-center gap-2">
                  <Activity size={14} className="text-slate" /> IPFS Storage
                </span>
                <StatusPill status={status.services?.storage === 'operational' ? 'active' : 'pending'} />
              </div>

              <div className="mt-8 pt-5 border-t border-line">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate">Version</span>
                  <span className="font-mono text-ink-2">{status.version || '1.0.0'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate">Environment</span>
                  <span className="font-mono text-ink-2 capitalize">{info?.environment || 'Production'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate animate-pulse">Checking infrastructure status...</div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
