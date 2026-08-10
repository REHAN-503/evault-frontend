import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { listDocuments } from '../api/documents';
import { StatusPill } from '../components/Atoms';
import { FileText, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await listDocuments();
      setDocs(data.filter((d) => d.sharedWith?.includes(user?.id)));
      setLoading(false);
    })();
  }, [user]);

  return (
    <PortalShell role="client" user={user}>
      {/* Enterprise Page Header */}
      <div className="mb-8 bg-white border border-line rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-ink mb-2">My Shared Records</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate"><FileText size={16} className="text-slate-light" /> {docs.length} Accessible Documents</span>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1.5 text-verified"><ShieldCheck size={16} className="text-verified" /> Secure Environment</span>
          </div>
        </div>
      </div>

      {/* Main Table Workspace */}
      <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-paper-dim/30">
          <h2 className="font-semibold text-sm text-ink">Shared With You</h2>
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
                    <Link to={`/documents/${d.docId}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-paper text-xs font-medium text-slate hover:text-seal border border-line hover:border-seal/30 transition-all">
                      Open <ExternalLink size={14} />
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
                      <h3 className="font-medium text-ink mb-1">No shared records</h3>
                      <p className="text-sm text-slate">When your counsel or the court shares a document with you, it will appear securely in this vault.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}
