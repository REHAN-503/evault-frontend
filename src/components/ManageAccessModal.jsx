import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grantAccess, revokeAccess } from '../api/documents';
import { UserPlus, UserMinus, X, Loader2 } from 'lucide-react';

export default function ManageAccessModal({ open, onClose, docId, onUpdated }) {
  const [userId, setUserId] = useState('');
  const [permission, setPermission] = useState('READ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleGrant(e) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await grantAccess(docId, userId, permission);
      setSuccess(`Granted ${permission} access to ${userId}.`);
      setUserId('');
      onUpdated?.();
    } catch (err) {
      setError(err.message || 'Failed to grant access');
    }
    setLoading(false);
  }

  async function handleRevoke() {
    if (!userId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await revokeAccess(docId, userId);
      setSuccess(`Revoked access for ${userId}.`);
      setUserId('');
      onUpdated?.();
    } catch (err) {
      setError(err.message || 'Failed to revoke access');
    }
    setLoading(false);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-[2px] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[420px] rounded-xl bg-paper shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-white/50">
            <h3 className="font-display text-lg font-medium flex items-center gap-2"><UserPlus size={18}/> Manage Access</h3>
            <button onClick={onClose} disabled={loading} className="text-slate hover:text-ink disabled:opacity-50">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleGrant}>
              <label className="block text-xs uppercase tracking-wider text-slate mb-1.5 font-medium">Participant ID</label>
              <input
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. usr_105"
                className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm mb-4 focus:border-seal outline-none font-mono"
              />

              <label className="block text-xs uppercase tracking-wider text-slate mb-1.5 font-medium">Permission Level</label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm mb-6 focus:border-seal outline-none"
              >
                <option value="READ">View Only (Read)</option>
                <option value="WRITE">Edit & Update (Write)</option>
              </select>

              {error && <p className="text-xs text-maroon mb-4">{error}</p>}
              {success && <p className="text-xs text-verified-dark mb-4">{success}</p>}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleRevoke}
                  disabled={loading || !userId}
                  className="flex items-center justify-center gap-2 rounded-md border border-maroon/30 text-maroon hover:bg-maroon/5 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin"/> : <UserMinus size={16} />} Revoke
                </button>
                <button
                  type="submit"
                  disabled={loading || !userId}
                  className="flex items-center justify-center gap-2 rounded-md bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-ink-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin"/> : <UserPlus size={16} />} Grant
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
