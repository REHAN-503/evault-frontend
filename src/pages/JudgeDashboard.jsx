import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { listDocuments, checkAccess } from '../api/documents';
import { FileText, ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle, ChevronRight, Scale } from 'lucide-react';

export default function JudgeDashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [verifiedIds, setVerifiedIds] = useState({});

  useEffect(() => {
    (async () => {
      setDocs(await listDocuments());
      setLoading(false);
    })();
  }, []);

  async function handleVerify(docId) {
    setVerifying(docId);
    const res = await checkAccess(docId, user.id);
    setVerifiedIds((prev) => ({ ...prev, [docId]: res.allowed }));
    setVerifying(null);
  }

  const flagged = docs.filter((d) => d.status === 'flagged').length;

  return (
    <PortalShell role="judge" user={user}>
      {/* Enterprise Page Header */}
      <div className="mb-8 bg-white border border-line rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-ink mb-2">Court Verification Queue</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate"><FileText size={16} className="text-slate-light" /> {docs.length} Assigned Records</span>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1.5 text-verified"><ShieldCheck size={16} className="text-verified" /> {docs.filter((d) => d.status === 'verified').length} Verified</span>
            <span className="text-line">|</span>
            <span className="flex items-center gap-1.5 text-maroon"><ShieldAlert size={16} className="text-maroon" /> {flagged} Flagged</span>
          </div>
        </div>
        <div className="h-10 w-10 bg-paper-dim rounded-full flex items-center justify-center border border-line shrink-0">
          <Scale size={20} className="text-slate" />
        </div>
      </div>

      {/* Main Table Workspace */}
      <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-paper-dim/30">
          <h2 className="font-semibold text-sm text-ink">Pending & Verified Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-paper-dim/50 border-b border-line text-xs uppercase tracking-wider text-slate-light font-semibold">
              <tr>
                <th className="px-5 py-3">Record Title</th>
                <th className="px-5 py-3">Case Ref</th>
                <th className="px-5 py-3">Filed By</th>
                <th className="px-5 py-3">Integrity Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 w-32 bg-paper-dim rounded mb-2"></div><div className="h-3 w-24 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4"><div className="h-4 w-20 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4"><div className="h-4 w-24 bg-paper-dim rounded"></div></td>
                  <td className="px-5 py-4"><div className="h-5 w-20 bg-paper-dim rounded-full"></div></td>
                  <td className="px-5 py-4 text-right"><div className="h-6 w-20 bg-paper-dim rounded ml-auto"></div></td>
                </tr>
              ))}
              {!loading && docs.map((d) => (
                <tr key={d.docId} className="hover:bg-paper-dim/50 transition-colors group">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{d.title}</p>
                    <p className="text-xs text-slate-light font-mono mt-0.5">{d.docId}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate">{d.caseNo}</td>
                  <td className="px-5 py-4 text-xs text-slate">{d.ownerName}</td>
                  <td className="px-5 py-4">
                    {verifiedIds[d.docId] === undefined ? (
                      <button
                        onClick={() => handleVerify(d.docId)}
                        disabled={verifying === d.docId}
                        className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-2 hover:border-seal hover:text-seal transition-all disabled:opacity-50"
                      >
                        {verifying === d.docId ? 'Checking...' : 'Verify Ledger'}
                      </button>
                    ) : verifiedIds[d.docId] ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-verified/30 bg-verified/5 text-xs font-semibold text-verified">
                        <CheckCircle2 size={14} /> Verified Match
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-maroon/30 bg-maroon/5 text-xs font-semibold text-maroon">
                        <AlertCircle size={14} /> Hash Mismatch
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/documents/${d.docId}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate hover:text-seal transition-colors">
                      View <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center text-slate-light border border-line mb-4">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="font-medium text-ink mb-1">Queue Empty</h3>
                      <p className="text-sm text-slate">No records require verification at this time.</p>
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
