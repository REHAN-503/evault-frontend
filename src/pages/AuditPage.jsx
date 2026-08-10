import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PortalShell from '../components/PortalShell';
import { getDocumentAudit } from '../api/documents';
import { Search, History, Clock } from 'lucide-react';

export default function AuditPage({ role }) {
  const { user } = useAuth();
  const [docId, setDocId] = useState('');
  const [events, setEvents] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!docId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await getDocumentAudit(docId.trim());
      setEvents(data);
    } catch (err) {
      setEvents([]);
    }
    setLoading(false);
  }

  return (
    <PortalShell role={role} user={user}>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-slate font-bold mb-1">Compliance</p>
        <h1 className="font-display text-3xl">Document Audit Trail</h1>
      </div>

      <div className="bg-white/70 border border-line rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-line bg-white/50">
          <form onSubmit={handleSearch} className="max-w-xl">
            <label className="block text-sm font-medium text-ink mb-2">Search Ledger Events by Document ID</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate" size={16} />
                <input
                  type="text"
                  required
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  placeholder="e.g. DOC-88213"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-line bg-white focus:border-seal focus:ring-1 focus:ring-seal outline-none transition-shadow font-mono"
                />
              </div>
              <button disabled={loading} className="px-5 py-2 bg-ink text-paper text-sm font-medium rounded-md hover:bg-ink-2 transition-colors disabled:opacity-70">
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        <div className="p-0">
          {!searched ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate">
              <History size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">Enter a Document ID to view its tamper-evident audit log.</p>
            </div>
          ) : events.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate border-b border-line bg-paper/30">
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Event / Action</th>
                  <th className="px-6 py-3 font-medium">Participant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate whitespace-nowrap flex items-center gap-1.5">
                      <Clock size={12} /> {new Date(e.timestamp || e.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-ink">
                      {e.action}
                    </td>
                    <td className="px-6 py-4 text-slate">
                      {e.userName || e.userId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-slate text-sm">
              No audit events found for document ID "{docId}".
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
