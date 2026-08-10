import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { getDocument, getVersionHistory, getDocumentAudit, downloadDocument } from '../api/documents';
import { StatusPill, HashChip } from '../components/Atoms';
import { ArrowLeft, Download, ShieldCheck, History, Clock, FileText, UserPlus, FileSignature, Trash2 } from 'lucide-react';

export default function DocumentDetail() {
  const { docId } = useParams();
  const { user } = useAuth();
  const [doc, setDoc] = useState(null);
  const [versions, setVersions] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    (async () => {
      try {
        setDoc(await getDocument(docId));
        setVersions(await getVersionHistory(docId));
        setEvents(await getDocumentAudit(docId));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [docId]);

  const handleDownload = async () => {
    try {
      const url = await downloadDocument(docId);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to download or decrypt file: " + e.message);
    }
  };

  if (!doc) {
    return (
      <PortalShell role={user?.role} user={user}>
        <div className="flex items-center justify-center h-64 text-slate">Loading record...</div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role={user?.role} user={user}>
      <Link to={`/${user?.role?.toLowerCase()}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Registry
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-line">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-slate font-bold bg-white px-2 py-1 rounded border border-line">
              {doc.caseNo}
            </span>
            <StatusPill status={doc.status} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{doc.title}</h1>
          <p className="text-sm text-slate mt-2">
            Filed by <span className="font-medium text-ink-2">{doc.ownerName}</span> · {doc.size || 'N/A'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleDownload} className="flex items-center gap-2 rounded-md bg-ink text-paper px-6 py-2.5 text-sm font-medium hover:bg-ink-2 transition-colors shadow-sm">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-line mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'history', label: 'Version History', icon: History },
          { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-ink text-ink' : 'border-transparent text-slate hover:text-ink-2'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/60 border border-line rounded-xl p-6 shadow-sm">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-6">Ledger Verification</h2>
              <dl className="space-y-5">
                <div>
                  <dt className="text-xs text-slate font-medium mb-1">Content Hash</dt>
                  <dd><HashChip value={doc.hash} chars={24} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-slate font-medium mb-1">IPFS Storage CID</dt>
                  <dd><HashChip value={doc.cid} chars={24} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-slate font-medium mb-1">Current Version</dt>
                  <dd className="text-sm font-medium text-ink-2">v{doc.version}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-6">Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-line rounded-lg text-sm font-medium text-ink hover:border-seal/60 hover:bg-seal/5 transition-all text-left">
                  <FileSignature size={18} className="text-slate" /> Update Version
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-line rounded-lg text-sm font-medium text-ink hover:border-seal/60 hover:bg-seal/5 transition-all text-left">
                  <UserPlus size={18} className="text-slate" /> Manage Access
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-maroon/20 rounded-lg text-sm font-medium text-maroon hover:bg-maroon/5 transition-all text-left">
                  <Trash2 size={18} className="opacity-70" /> Delete Record
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-6">Version History</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-line before:to-transparent">
              {versions.map((v) => (
                <div key={v.version} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-paper bg-white shadow-sm z-10 shrink-0 md:mx-auto">
                    <span className="text-xs font-bold text-ink">v{v.version}</span>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white border border-line p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{v.updatedBy || 'System'}</span>
                      <span className="text-xs text-slate flex items-center gap-1"><Clock size={12}/> {new Date(v.updatedAt || v.createdAt).toLocaleDateString()}</span>
                    </div>
                    <HashChip value={v.hash} chars={12} />
                  </div>
                </div>
              ))}
              {versions.length === 0 && <p className="text-sm text-slate text-center pt-4">No history for this record.</p>}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-6">Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-slate border-b border-line">
                    <th className="pb-3 font-medium">Timestamp</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Participant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td className="py-4 text-xs text-slate whitespace-nowrap">
                        {new Date(e.timestamp || e.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 font-medium text-ink-2">
                        {e.action}
                      </td>
                      <td className="py-4 text-slate">
                        {e.userName || e.userId}
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate">No events logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
