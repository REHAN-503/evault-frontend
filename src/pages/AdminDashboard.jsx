import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { register } from '../api/auth';
import { grantAccess } from '../api/documents';
import { getSystemStatus, getSystemInfo } from '../api/system';
import { StatusPill } from '../components/Atoms';
import { Server, Database, Activity, UserPlus, Key, ShieldCheck, HardDrive, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Mock chart data
const loadData = [
  { time: '08:00', reqs: 420 },
  { time: '09:00', reqs: 850 },
  { time: '10:00', reqs: 1100 },
  { time: '11:00', reqs: 1400 },
  { time: '12:00', reqs: 900 },
  { time: '13:00', reqs: 1250 },
  { time: '14:00', reqs: 1600 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'LAWYER' });
  const [grant, setGrant] = useState({ docId: '', userId: '' });
  const [busy, setBusy] = useState(false);

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
      toast.success('Participant registered successfully in the network.');
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
    setBusy(false);
  }

  async function handleGrant(e) {
    e.preventDefault();
    if (!grant.docId || !grant.userId) return;
    setBusy(true);
    try {
      await grantAccess(grant.docId, grant.userId, 'READ');
      toast.success(`Access successfully granted to user ${grant.userId}.`);
      setGrant({ docId: '', userId: '' });
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
    setBusy(false);
  }

  return (
    <PortalShell role="admin" user={user}>
      {/* Enterprise Page Header */}
      <div className="mb-6 bg-white border border-line rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-display font-semibold tracking-tight text-ink mb-2">Registry Infrastructure</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-verified"><div className="w-2 h-2 rounded-full bg-verified"></div> Network Operational</span>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1.5 text-slate font-mono text-xs"><Server size={14} className="text-slate-light" /> Node ID: eVR-0x74B9</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Pane - System Status */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white border border-line rounded-lg shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate uppercase tracking-wider mb-5 flex items-center gap-2"><Activity size={14}/> Core Services</h3>
            {status ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-sm font-medium text-ink flex items-center gap-2">
                    <Server size={14} className="text-slate-light" /> API Gateway
                  </span>
                  <StatusPill status={status.status === 'ok' ? 'verified' : 'pending'} />
                </div>
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-sm font-medium text-ink flex items-center gap-2">
                    <Database size={14} className="text-slate-light" /> Registry DB
                  </span>
                  <StatusPill status={status.services?.database === 'connected' ? 'verified' : 'pending'} />
                </div>
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-sm font-medium text-ink flex items-center gap-2">
                    <ShieldCheck size={14} className="text-slate-light" /> EVM Ledger
                  </span>
                  <StatusPill status={status.services?.blockchain === 'operational' ? 'verified' : 'pending'} />
                </div>
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-sm font-medium text-ink flex items-center gap-2">
                    <HardDrive size={14} className="text-slate-light" /> IPFS Nodes
                  </span>
                  <StatusPill status={status.services?.storage === 'operational' ? 'verified' : 'pending'} />
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex justify-between pb-3 border-b border-line">
                    <div className="h-4 w-24 bg-paper-dim rounded"></div>
                    <div className="h-5 w-16 bg-paper-dim rounded-full"></div>
                  </div>
                ))}
              </div>
            )}
            
            {info && (
              <div className="mt-6 pt-4 border-t border-line">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate tracking-widest mb-1">Total Records</p>
                    <p className="text-xl font-display font-semibold">{info.metrics?.totalDocuments || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate tracking-widest mb-1">Users</p>
                    <p className="text-xl font-display font-semibold">{info.metrics?.registeredUsers || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Admin Actions */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Analytics Chart */}
          <div className="bg-white border border-line rounded-lg shadow-sm p-5 h-[280px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={14} /> System Traffic
              </h3>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loadData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0F172A', fontSize: '12px', fontWeight: '600' }}
                  />
                  <Bar dataKey="reqs" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Add User */}
            <div className="bg-white border border-line rounded-lg shadow-sm">
              <div className="px-5 py-4 border-b border-line bg-paper-dim/30">
                <h2 className="font-semibold text-sm text-ink flex items-center gap-2"><UserPlus size={16} className="text-slate-light" /> Provision Account</h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full rounded-md border border-line bg-paper-dim px-3 py-2 text-sm focus:bg-white focus:border-seal outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Email</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-md border border-line bg-paper-dim px-3 py-2 text-sm focus:bg-white focus:border-seal outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Password</label>
                      <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full rounded-md border border-line bg-paper-dim px-3 py-2 text-sm focus:bg-white focus:border-seal outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Access Level</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full rounded-md border border-line bg-paper-dim px-3 py-2 text-sm focus:bg-white focus:border-seal outline-none transition-colors">
                      <option value="LAWYER">Counsel / Filer</option>
                      <option value="JUDGE">Judge / Court</option>
                      <option value="ADMIN">Registry Admin</option>
                      <option value="CLIENT">Client Access</option>
                    </select>
                  </div>
                  <div className="pt-2 border-t border-line mt-2">
                    <button disabled={busy} className="w-full rounded-md bg-ink text-white px-6 py-2 text-sm font-medium hover:bg-ink-2 transition-colors shadow-sm disabled:opacity-50">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Manual Access Granting */}
            <div className="bg-white border border-line rounded-lg shadow-sm">
              <div className="px-5 py-4 border-b border-line bg-paper-dim/30">
                <h2 className="font-semibold text-sm text-ink flex items-center gap-2"><Key size={16} className="text-slate-light" /> Override Grant</h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleGrant} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Document ID</label>
                    <input required value={grant.docId} onChange={(e) => setGrant({ ...grant, docId: e.target.value })}
                      placeholder="DOC-..."
                      className="w-full rounded-md border border-line bg-paper-dim px-3 py-2 text-sm focus:bg-white focus:border-seal outline-none transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink-2 mb-1.5 uppercase tracking-wide">User ID</label>
                    <input required value={grant.userId} onChange={(e) => setGrant({ ...grant, userId: e.target.value })}
                      placeholder="usr_..."
                      className="w-full rounded-md border border-line bg-paper-dim px-3 py-2 text-sm focus:bg-white focus:border-seal outline-none transition-colors font-mono" />
                  </div>
                  <div className="pt-2 border-t border-line mt-2">
                    <button disabled={busy} className="w-full rounded-md border border-seal text-seal px-6 py-2 text-sm font-medium hover:bg-seal hover:text-white transition-colors shadow-sm disabled:opacity-50">
                      Grant Permission
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PortalShell>
  );
}
