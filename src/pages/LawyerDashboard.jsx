import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { listDocuments } from '../api/documents';
import { StatusPill } from '../components/Atoms';
import UploadModal from '../components/UploadModal';
import { Plus, Search, ChevronRight, FileText, Upload, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data
const uploadData = [
  { day: 'Mon', count: 2 },
  { day: 'Tue', count: 5 },
  { day: 'Wed', count: 3 },
  { day: 'Thu', count: 7 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 1 },
  { day: 'Sun', count: 6 },
];

export default function LawyerDashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    const data = await listDocuments();
    setDocs(data.filter((d) => d.ownerId === user?.id));
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  const verified = docs.filter((d) => d.status === 'verified').length;
  const pending = docs.filter((d) => d.status === 'pending').length;

  return (
    <PortalShell role="lawyer" user={user}>
      {/* Enterprise Page Header */}
      <div className="mb-8 bg-white border border-line rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-ink mb-2">Legal Records Workspace</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate"><FileText size={16} className="text-slate-light" /> {docs.length} Total Records</span>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1.5 text-verified"><div className="w-2 h-2 rounded-full bg-verified"></div> {verified} Verified</span>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1.5 text-slate"><div className="w-2 h-2 rounded-full border border-slate"></div> {pending} Pending</span>
          </div>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-seal text-white px-5 py-2.5 text-sm font-medium hover:bg-seal-dark transition-colors shadow-sm shrink-0"
        >
          <Upload size={16} /> Upload Record
        </button>
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-line rounded-lg shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={14} /> Weekly Filing Activity
            </h3>
          </div>
          <div className="flex-1 min-h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={uploadData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontSize: '12px', fontWeight: '600' }}
                />
                <Area type="monotone" dataKey="count" stroke="#1E3A8A" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-line rounded-lg shadow-sm p-5 flex-1 flex flex-col justify-center">
            <p className="text-[10px] uppercase font-bold text-slate tracking-widest mb-1">Approval Rate</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-display font-semibold text-ink leading-none">
                {docs.length ? Math.round((verified / docs.length) * 100) : 0}%
              </p>
              <span className="text-xs text-verified font-medium mb-1">+5% this week</span>
            </div>
          </div>
          <div className="bg-white border border-line rounded-lg shadow-sm p-5 flex-1 flex flex-col justify-center">
            <p className="text-[10px] uppercase font-bold text-slate tracking-widest mb-1">Storage Utilized</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-display font-semibold text-ink leading-none">
                124 <span className="text-xl text-slate font-medium">MB</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Workspace */}
      <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-paper-dim/30">
          <h2 className="font-semibold text-sm text-ink">Recent Filings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-paper-dim/50 border-b border-line text-xs uppercase tracking-wider text-slate-light font-semibold">
              <tr>
                <th className="px-5 py-3">Record Title</th>
                <th className="px-5 py-3">Case Ref</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 w-32 bg-paper-dim rounded mb-2"></div><div className="h-3 w-24 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4"><div className="h-4 w-20 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4"><div className="h-4 w-8 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4"><div className="h-5 w-16 bg-paper-dim rounded-full"></div></td>
                  <td className="px-5 py-4"><div className="h-4 w-24 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4 text-right"><div className="h-6 w-6 bg-paper-dim rounded ml-auto"></div></td>
                </tr>
              ))}
              {!loading && docs.map((d) => (
                <tr key={d.docId} className="hover:bg-paper-dim/50 transition-colors group">
                  <td className="px-5 py-4">
                    <Link to={`/documents/${d.docId}`} className="font-medium text-ink group-hover:text-seal transition-colors">
                      {d.title}
                    </Link>
                    <p className="text-xs text-slate-light font-mono mt-0.5">{d.docId}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate">{d.caseNo}</td>
                  <td className="px-5 py-4 text-xs text-slate font-medium">v{d.version}</td>
                  <td className="px-5 py-4"><StatusPill status={d.status} /></td>
                  <td className="px-5 py-4 text-xs text-slate">{new Date(d.updatedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/documents/${d.docId}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate hover:text-seal transition-colors">
                      View <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center text-slate-light border border-line mb-4">
                        <Search size={20} />
                      </div>
                      <h3 className="font-medium text-ink mb-1">No records found</h3>
                      <p className="text-sm text-slate mb-6">Your legal workspace is currently empty.</p>
                      <button
                        onClick={() => setUploadOpen(true)}
                        className="rounded-md bg-seal text-white px-5 py-2 text-sm font-medium hover:bg-seal-dark transition-colors"
                      >
                        Upload Document
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={refresh} />
    </PortalShell>
  );
}
