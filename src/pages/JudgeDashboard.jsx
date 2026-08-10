import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { listDocuments, checkAccess } from '../api/documents';
import { StatusPill, HashChip, StatCard } from '../components/Atoms';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

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
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-slate font-bold mb-1">Queue</p>
        <h1 className="font-display text-3xl">Records Verification</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Assigned Records" value={docs.length} accent="ink" />
        <StatCard label="Verified Today" value={docs.filter((d) => d.status === 'verified').length} accent="verified" />
        <StatCard label="Flagged for Review" value={flagged} accent="maroon" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {docs.map((d) => (
          <div key={d.docId} className="rounded-xl border border-line bg-white/70 p-5 shadow-sm flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0 flex items-center gap-3">
                <div className="h-10 w-10 bg-slate/10 text-slate rounded-md flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <Link to={`/documents/${d.docId}`} className="font-medium text-ink hover:text-seal-dark transition-colors truncate block">
                    {d.title}
                  </Link>
                  <p className="text-xs text-slate font-mono mt-0.5">{d.caseNo}</p>
                </div>
              </div>
              <StatusPill status={d.status} />
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate">Filed by</span>
                <span className="font-medium text-ink-2">{d.ownerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate">Updated</span>
                <span className="font-medium text-ink-2">{new Date(d.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-line flex items-center justify-between">
              {verifiedIds[d.docId] === undefined ? (
                <button
                  onClick={() => handleVerify(d.docId)}
                  disabled={verifying === d.docId}
                  className="rounded-md border border-slate/30 px-4 py-1.5 text-xs font-medium text-ink-2 hover:bg-slate/5 transition-colors disabled:opacity-50"
                >
                  {verifying === d.docId ? 'Checking...' : 'Verify Ledger Match'}
                </button>
              ) : verifiedIds[d.docId] ? (
                <div className="flex items-center gap-1.5 text-xs text-verified-dark font-medium">
                  <CheckCircle2 size={16} /> Matches ledger record
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-maroon-dark font-medium">
                  <AlertCircle size={16} /> Verification failed
                </div>
              )}
              
              <Link to={`/documents/${d.docId}`} className="text-xs font-medium text-seal-dark hover:text-ink transition-colors">
                View Details &rarr;
              </Link>
            </div>
          </div>
        ))}
        {!loading && docs.length === 0 && (
          <div className="col-span-2 rounded-xl border border-line bg-white/50 px-6 py-16 text-center text-slate text-sm">
            No case files assigned to your bench yet.
          </div>
        )}
      </div>
    </PortalShell>
  );
}
