import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { register } from '../api/auth';
import { grantAccess } from '../api/documents';
import { getSystemStatus, getSystemInfo } from '../api/system';
import { Server, Database, Activity, UserPlus, Key, HardDrive, BarChart3, Wifi, Cpu, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Mock chart data representing API / Ledger traffic
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
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-ink mb-2">Registry Infrastructure</h1>
          <p className="text-sm text-slate max-w-2xl">
            Monitor blockchain node health, manage storage infrastructure, and provision cryptographic identities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-verified/10 border border-verified/20 text-verified px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-verified animate-pulse"></span>
            Network Active
          </div>
          <div className="bg-white border border-line rounded px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-slate shadow-sm">
            <Server size={14} /> Node: eVR-0x74B9
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Metrics & Traffic */}
        <div className="w-full xl:w-2/3 flex flex-col gap-6">
          
          {/* System Health Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-line rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2 text-slate">
                <Wifi size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">API Gateway</span>
              </div>
              <p className="text-xl font-semibold text-ink mb-1">{status?.api || 'Operational'}</p>
              <p className="text-[10px] text-verified">99.99% Uptime</p>
            </div>
            <div className="bg-white border border-line rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2 text-slate">
                <Database size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">PostgreSQL DB</span>
              </div>
              <p className="text-xl font-semibold text-ink mb-1">{status?.db || 'Connected'}</p>
              <p className="text-[10px] text-slate">14ms latency</p>
            </div>
            <div className="bg-white border border-line rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2 text-slate">
                <Layers size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Blockchain Node</span>
              </div>
              <p className="text-xl font-semibold text-ink mb-1">{status?.chain || 'Synced'}</p>
              <p className="text-[10px] text-slate">Block #149021</p>
            </div>
            <div className="bg-white border border-line rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2 text-slate">
                <HardDrive size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">IPFS Storage</span>
              </div>
              <p className="text-xl font-semibold text-ink mb-1">{status?.ipfs || 'Online'}</p>
              <p className="text-[10px] text-slate">1.2 TB Utilized</p>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden flex-1">
            <div className="px-6 py-4 border-b border-line bg-[#FAFAFA] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={14} /> Network Traffic (Requests/hr)
              </h3>
            </div>
            <div className="p-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loadData}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #E2E8F0', padding: '8px' }}
                    itemStyle={{ color: '#0F172A', fontSize: '12px', fontWeight: '700' }}
                  />
                  <Bar dataKey="reqs" fill="#0F172A" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* Right Column: Provisioning & Tools */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6 shrink-0">
          
          {/* Identity Provisioning Form */}
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-line bg-[#FAFAFA]">
              <h3 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-2">
                <UserPlus size={14} /> Identity Provisioning
              </h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate mb-1">Full Legal Name</label>
                  <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full text-sm border border-line rounded px-3 py-2 bg-paper-dim focus:bg-white focus:border-ink outline-none transition-colors" placeholder="e.g. Ananya Rao" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate mb-1">Institutional Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full text-sm border border-line rounded px-3 py-2 bg-paper-dim focus:bg-white focus:border-ink outline-none transition-colors" placeholder="user@registry.gov.in" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate mb-1">Network Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full text-sm border border-line rounded px-3 py-2 bg-paper-dim focus:bg-white focus:border-ink outline-none transition-colors">
                    <option value="LAWYER">Legal Counsel</option>
                    <option value="JUDGE">Hon. Court</option>
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Registry Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate mb-1">Temporary Password</label>
                  <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full text-sm border border-line rounded px-3 py-2 bg-paper-dim focus:bg-white focus:border-ink outline-none transition-colors" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={busy} className="w-full rounded bg-ink text-white px-4 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors disabled:opacity-50 shadow-sm mt-2">
                  Provision Identity
                </button>
              </form>
            </div>
          </div>

          {/* Root Access Override */}
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-line bg-[#FAFAFA]">
              <h3 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-2">
                <Key size={14} /> Root Access Override
              </h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleGrant} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input required value={grant.docId} onChange={(e) => setGrant({ ...grant, docId: e.target.value })}
                      className="w-full text-sm font-mono border border-line rounded px-3 py-2 bg-paper-dim focus:bg-white focus:border-ink outline-none transition-colors" placeholder="DOC-ID" />
                  </div>
                  <div className="flex-1">
                    <input required value={grant.userId} onChange={(e) => setGrant({ ...grant, userId: e.target.value })}
                      className="w-full text-sm font-mono border border-line rounded px-3 py-2 bg-paper-dim focus:bg-white focus:border-ink outline-none transition-colors" placeholder="USER-ID" />
                  </div>
                </div>
                <button type="submit" disabled={busy} className="w-full rounded bg-white border border-line text-ink px-4 py-2 text-sm font-semibold hover:bg-slate/5 transition-colors disabled:opacity-50 shadow-sm">
                  Force Grant Read Access
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </PortalShell>
  );
}
