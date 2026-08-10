import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { listDocuments } from '../api/documents';
import { StatusPill, HashChip, StatCard } from '../components/Atoms';
import UploadModal from '../components/UploadModal';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

export default function LawyerDashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    const data = await listDocuments();
    setDocs(data.filter((d) => d.ownerId === user?.id || true));
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  const verified = docs.filter((d) => d.status === 'verified').length;
  const pending = docs.filter((d) => d.status === 'pending').length;

  return (
    <PortalShell role="lawyer" user={user}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate font-bold mb-1">Overview</p>
          <h1 className="font-display text-3xl">Documents</h1>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2 rounded-md bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:bg-ink-2 transition-colors shadow-sm"
        >
          <Plus size={16} /> Upload Document
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Total Documents" value={docs.length} accent="ink" />
        <StatCard label="Verified Ledger Records" value={verified} accent="verified" />
        <StatCard label="Pending Confirmations" value={pending} accent="seal" />
      </div>

      <div className="rounded-xl border border-line bg-white/50 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-white/80">
          <h2 className="font-medium text-sm text-ink font-display">Recent Filings</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-slate" size={14} />
            <input 
              type="text" 
              placeholder="Search case or title..." 
              className="pl-8 pr-4 py-1.5 text-xs rounded-md border border-line bg-white focus:border-seal outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate border-b border-line bg-paper/50">
                <th className="px-5 py-3 font-medium">Document</th>
                <th className="px-5 py-3 font-medium">Case</th>
                <th className="px-5 py-3 font-medium">Version</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {docs.map((d) => (
                <tr key={d.docId} className="hover:bg-white/80 transition-colors">
                  <td className="px-5 py-4">
                    <Link to={`/documents/${d.docId}`} className="font-medium text-ink hover:text-seal-dark transition-colors">
                      {d.title}
                    </Link>
                    <p className="text-xs text-slate font-mono mt-0.5">{d.docId}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-ink-2">{d.caseNo}</td>
                  <td className="px-5 py-4 text-xs text-slate">v{d.version}</td>
                  <td className="px-5 py-4"><StatusPill status={d.status} /></td>
                  <td className="px-5 py-4 text-xs text-slate">{new Date(d.updatedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/documents/${d.docId}`} className="p-1.5 inline-block text-slate hover:text-ink rounded-md hover:bg-slate/10 transition-colors">
                      <MoreHorizontal size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-slate text-sm">No documents found. Upload your first document to get started.</td>
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
