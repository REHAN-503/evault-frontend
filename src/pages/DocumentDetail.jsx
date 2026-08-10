import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { getDocument, getVersionHistory, getDocumentAudit, downloadDocument } from '../api/documents';
import { StatusPill, HashChip } from '../components/Atoms';
import ManageAccessModal from '../components/ManageAccessModal';
import UpdateVersionModal from '../components/UpdateVersionModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { ArrowLeft, Download, ShieldCheck, History, Clock, FileText, FileSignature, Trash2, Key, Activity, Lock } from 'lucide-react';

export default function DocumentDetail() {
  const { docId } = useParams();
  const { user } = useAuth();
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('history');

  const [updateOpen, setUpdateOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const docData = await getDocument(docId);
      if (!docData) throw new Error("Document not found");
      setDoc(docData);
      setVersions(await getVersionHistory(docId));
      setEvents(await getDocumentAudit(docId));
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load document");
    }
  }, [docId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  if (error) {
    return (
      <PortalShell role={user?.role} user={user}>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-16 w-16 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-display font-semibold text-ink mb-2">Access Restricted</h1>
          <p className="text-slate mb-6 max-w-md">{error}</p>
          <Link to={`/${user?.role?.toLowerCase()}`} className="px-6 py-2.5 bg-ink text-white rounded-md text-sm font-medium hover:bg-ink-2 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </PortalShell>
    );
  }

  if (!doc) {
    return (
      <PortalShell role={user?.role} user={user}>
        <div className="animate-pulse flex gap-6">
          <div className="w-1/3 flex flex-col gap-4">
            <div className="h-64 bg-paper-dim rounded-lg"></div>
            <div className="h-48 bg-paper-dim rounded-lg"></div>
          </div>
          <div className="flex-1 bg-paper-dim rounded-lg h-[500px]"></div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role={user?.role} user={user}>
      {/* Top Workspace Header */}
      <div className="mb-6">
        <Link to={`/${user?.role?.toLowerCase()}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-ink mb-4 transition-colors uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Registry
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-slate font-bold bg-white px-2 py-0.5 rounded border border-line">
                {doc.caseNo}
              </span>
              <StatusPill status={doc.status} />
              {(user.role === 'client' || user.role === 'judge') && (
                <span className="text-[10px] font-bold tracking-widest uppercase bg-slate/10 text-slate px-2 py-0.5 rounded border border-slate/20 flex items-center gap-1">
                  <Lock size={10} /> Read Only
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight leading-tight">{doc.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 rounded-md bg-white border border-line text-ink px-4 py-2 text-sm font-medium hover:border-seal hover:text-seal transition-colors shadow-sm">
              <Download size={16} /> Download Source
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Pane - Document Identity */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white border border-line rounded-lg shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2"><FileText size={14}/> Document Identity</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-slate">Version</span>
                <span className="font-semibold text-ink">v{doc.version}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-slate">Filed By</span>
                <span className="font-medium text-ink">{doc.ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-slate">Size</span>
                <span className="font-medium text-ink">{doc.size || '1.2 MB'}</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-slate">Updated</span>
                <span className="font-medium text-ink">{new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Integrity Card */}
          <div className="bg-white border border-line rounded-lg shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2"><ShieldCheck size={14}/> Ledger Integrity</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate font-bold uppercase tracking-widest mb-1">Content Hash (SHA-256)</p>
                <HashChip value={doc.hash} chars={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate font-bold uppercase tracking-widest mb-1">Storage CID</p>
                <HashChip value={doc.cid} chars={24} />
              </div>
            </div>
          </div>

          {/* Actions Card (Lawyers mostly) */}
          {(user.role === 'lawyer' || user.role === 'admin') && (
            <div className="bg-white border border-line rounded-lg shadow-sm p-2 space-y-1">
              <button onClick={() => setUpdateOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-ink hover:bg-paper-dim transition-colors text-left">
                <FileSignature size={16} className="text-slate-light" /> Update Version
              </button>
              <button onClick={() => setAccessOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-ink hover:bg-paper-dim transition-colors text-left">
                <Key size={16} className="text-slate-light" /> Manage Access
              </button>
              <div className="h-px bg-line my-1 mx-2"></div>
              <button onClick={() => setDeleteOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-maroon hover:bg-maroon/5 transition-colors text-left">
                <Trash2 size={16} /> Delete Record
              </button>
            </div>
          )}
        </div>

        {/* Right Pane - Workspace Content */}
        <div className="w-full lg:w-2/3 bg-white border border-line rounded-lg shadow-sm flex flex-col min-h-[500px]">
          {/* Workspace Tabs */}
          <div className="flex px-4 border-b border-line bg-paper-dim/30">
            {[
              { id: 'history', label: 'Version Timeline', icon: History },
              { id: 'audit', label: 'Audit Trail', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-seal text-seal-dark' : 'border-transparent text-slate hover:text-ink'
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-seal' : 'text-slate-light'} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Workspace Content Area */}
          <div className="flex-1 p-6">
            {activeTab === 'history' && (
              <div>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-px before:bg-line">
                  {versions.map((v, i) => (
                    <div key={v.version} className="relative flex gap-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white shrink-0 z-10 ${i === 0 ? 'border-seal text-seal font-bold' : 'border-line text-slate'}`}>
                        v{v.version}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-ink text-sm">{v.updatedBy || 'System User'}</span>
                          <span className="text-xs text-slate font-medium">{new Date(v.updatedAt || v.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-paper-dim border border-line rounded-md p-3 mt-2 inline-block w-full">
                          <p className="text-[10px] text-slate font-bold uppercase tracking-widest mb-1">Recorded Hash</p>
                          <HashChip value={v.hash} chars={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {versions.length === 0 && <p className="text-sm text-slate ml-10">No version history available.</p>}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] uppercase tracking-wider text-slate border-b border-line">
                    <tr>
                      <th className="pb-3 font-semibold">Timestamp</th>
                      <th className="pb-3 font-semibold">Action</th>
                      <th className="pb-3 font-semibold">Participant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {events.map((e) => (
                      <tr key={e.id} className="hover:bg-paper-dim/30 transition-colors">
                        <td className="py-3 text-xs text-slate-light whitespace-nowrap">
                          {new Date(e.timestamp || e.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 font-medium text-ink text-xs">
                          {e.action}
                        </td>
                        <td className="py-3 text-slate text-xs font-mono">
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
            )}
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <UpdateVersionModal open={updateOpen} onClose={() => setUpdateOpen(false)} docId={docId} onUpdated={loadData} />
      <ManageAccessModal open={accessOpen} onClose={() => setAccessOpen(false)} docId={docId} onUpdated={loadData} />
      <ConfirmDeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} docId={docId} title={doc.title} role={user?.role} />

    </PortalShell>
  );
}
