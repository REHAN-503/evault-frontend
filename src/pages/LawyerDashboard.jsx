import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { listDocuments, getDocumentAudit } from '../api/documents';
import { StatusPill } from '../components/Atoms';
import UploadModal from '../components/UploadModal';
import { Upload, FileText, Activity, Clock, ShieldCheck, ChevronRight, Hash, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data to simulate system activity
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
  const [recentAudit, setRecentAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    const data = await listDocuments();
    const myDocs = data.filter((d) => d.ownerId === user?.id);
    setDocs(myDocs);
    
    // Mocking a fetch for recent global activity related to this lawyer
    // In a real app, this would be a specific endpoint like /api/v1/audit?user=me
    if (myDocs.length > 0) {
      const audits = await getDocumentAudit(myDocs[0].docId);
      setRecentAudit(audits.slice(0, 5));
    }
    
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  const verified = docs.filter((d) => d.status === 'verified').length;

  return (
    <PortalShell role="lawyer" user={user}>
      
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-ink mb-2">Legal Records Workspace</h1>
          <p className="text-sm text-slate max-w-2xl">
            Manage your cryptographic case files, submit evidence to the verification queue, and monitor ledger integrity.
          </p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center justify-center gap-2 rounded bg-ink text-white px-6 py-3 text-sm font-semibold hover:bg-ink/90 transition-colors shadow-sm shrink-0"
        >
          <Upload size={16} /> Register New Document
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Center Column (Document Management) */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-line p-5 rounded-lg shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate mb-2">Total Filings</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-display font-semibold text-ink leading-none">{docs.length}</p>
                <FileText size={20} className="text-slate-light mb-1" />
              </div>
            </div>
            <div className="bg-white border border-line p-5 rounded-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-verified/5 rounded-bl-full pointer-events-none"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate mb-2">Verified on Ledger</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-display font-semibold text-ink leading-none">{verified}</p>
                <ShieldCheck size={20} className="text-verified mb-1" />
              </div>
            </div>
            <div className="bg-white border border-line p-5 rounded-lg shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate mb-2">Storage Usage</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-display font-semibold text-ink leading-none">1.2 <span className="text-sm font-medium text-slate">GB</span></p>
                <div className="w-16 h-1.5 bg-slate/10 rounded-full mb-2 overflow-hidden">
                  <div className="w-1/3 h-full bg-ink"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Table */}
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="px-6 py-5 border-b border-line flex items-center justify-between bg-[#FAFAFA]">
              <h2 className="font-semibold text-sm text-ink uppercase tracking-wider">Document Workspace</h2>
              <div className="flex items-center gap-2 text-xs font-medium text-slate">
                Sort by: <span className="text-ink bg-white border border-line px-2 py-1 rounded">Newest First</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b border-line text-[10px] uppercase tracking-widest text-slate font-bold">
                  <tr>
                    <th className="px-6 py-4">Title & Identity</th>
                    <th className="px-6 py-4">Case Ref</th>
                    <th className="px-6 py-4">Ver.</th>
                    <th className="px-6 py-4">Ledger Status</th>
                    <th className="px-6 py-4">Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {loading && Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 w-32 bg-slate/10 rounded mb-2"></div><div className="h-3 w-24 bg-slate/10 rounded"></div></td>
                      <td className="px-6 py-5"><div className="h-4 w-20 bg-slate/10 rounded"></div></td>
                      <td className="px-6 py-5"><div className="h-4 w-8 bg-slate/10 rounded"></div></td>
                      <td className="px-6 py-5"><div className="h-5 w-16 bg-slate/10 rounded-full"></div></td>
                      <td className="px-6 py-5"><div className="h-4 w-24 bg-slate/10 rounded"></div></td>
                      <td className="px-6 py-5 text-right"><div className="h-6 w-6 bg-slate/10 rounded ml-auto"></div></td>
                    </tr>
                  ))}
                  
                  {!loading && docs.map((d) => (
                    <tr key={d.docId} className="hover:bg-[#FAFAFA] transition-colors group cursor-pointer" onClick={() => window.location.href = `/documents/${d.docId}`}>
                      <td className="px-6 py-5">
                        <span className="font-semibold text-ink group-hover:text-ink/80 transition-colors block mb-1">
                          {d.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate bg-slate/5 px-2 py-0.5 rounded border border-slate/10 inline-flex">
                          <Hash size={10} /> {d.docId}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-slate">{d.caseNo}</td>
                      <td className="px-6 py-5 text-xs text-slate font-bold">v{d.version}</td>
                      <td className="px-6 py-5"><StatusPill status={d.status} /></td>
                      <td className="px-6 py-5 text-xs text-slate font-medium">{new Date(d.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/documents/${d.docId}`} className="inline-flex items-center justify-center w-8 h-8 rounded border border-line text-slate hover:bg-white hover:text-ink hover:border-slate/30 transition-all shadow-sm">
                          <ArrowUpRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {docs.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-[#FAFAFA] border border-line rounded-full flex items-center justify-center text-slate mb-4">
                            <FileText size={24} />
                          </div>
                          <h3 className="text-base font-semibold text-ink mb-1">No Active Records</h3>
                          <p className="text-sm text-slate mb-6">Your legal workspace is empty. Register a document to begin.</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setUploadOpen(true); }}
                            className="rounded bg-ink text-white px-5 py-2 text-sm font-medium hover:bg-ink/90 transition-colors shadow-sm"
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
        </div>

        {/* Right Sidebar (Analytics & Audit) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          
          {/* Weekly Activity Mini-Chart */}
          <div className="bg-white border border-line rounded-lg shadow-sm p-5">
            <h3 className="text-[10px] font-bold text-slate uppercase tracking-widest flex items-center gap-2 mb-4">
              <Activity size={14} /> Intake Velocity
            </h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uploadData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #E2E8F0', padding: '4px 8px' }}
                    itemStyle={{ color: '#0F172A', fontSize: '10px', fontWeight: '700' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#0F172A" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Ledger Events */}
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-line bg-[#FAFAFA]">
              <h3 className="text-[10px] font-bold text-slate uppercase tracking-widest flex items-center gap-2">
                <History size={14} /> Recent Ledger Events
              </h3>
            </div>
            <div className="p-5">
              {recentAudit.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:h-full before:w-[2px] before:bg-line">
                  {recentAudit.map((event, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-ink shrink-0 z-10 mt-1"></div>
                      <div>
                        <p className="text-xs font-semibold text-ink leading-tight mb-0.5">{event.action}</p>
                        <p className="text-[10px] text-slate font-medium flex items-center gap-1">
                          <Clock size={10} /> {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate">No recent activity detected on the ledger.</p>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-line bg-[#FAFAFA]">
              <Link to="/lawyer/audit" className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-ink border border-line rounded bg-white hover:bg-slate/5 transition-colors shadow-sm">
                View Full Global Audit
              </Link>
            </div>
          </div>

        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={refresh} />
    </PortalShell>
  );
}
