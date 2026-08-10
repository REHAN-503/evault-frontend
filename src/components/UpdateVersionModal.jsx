import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateDocument } from '../api/documents';
import { UploadCloud, CheckCircle2, FileText, Loader2, X, FileSignature } from 'lucide-react';

export default function UpdateVersionModal({ open, onClose, docId, onUpdated }) {
  const [file, setFile] = useState(null);
  const [stepLog, setStepLog] = useState([]);
  const [phase, setPhase] = useState('form'); // form | running | done
  const [result, setResult] = useState(null);

  function reset() {
    setFile(null); setStepLog([]); setPhase('form'); setResult(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setPhase('running');
    setStepLog([]);
    try {
      const doc = await updateDocument(docId, { file }, (i, label) => {
        setStepLog((prev) => [...prev, label]);
      });
      setResult(doc);
      setPhase('done');
      onUpdated?.(doc);
    } catch(err) {
      alert("Failed to update version: " + err.message);
      reset();
      onClose();
    }
  }

  function handleClose() {
    if (phase === 'running') return;
    reset();
    onClose();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-[2px] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[480px] rounded-xl bg-paper shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-white/50">
            <h3 className="font-display text-lg font-medium flex items-center gap-2">
              <FileSignature size={18} className="text-seal"/> Update Version
            </h3>
            <button onClick={handleClose} disabled={phase === 'running'} className="text-slate hover:text-ink disabled:opacity-50 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {phase === 'form' && (
              <form onSubmit={handleSubmit}>
                <p className="text-sm text-slate mb-6">
                  Upload a new file. It will be encrypted and appended to the document's version history automatically.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate mb-1.5 font-medium">New File</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border border-dashed border-slate/40 bg-white/50 hover:bg-white/80 transition-colors cursor-pointer group">
                      <input required type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      {file ? (
                        <div className="flex flex-col items-center gap-2 text-ink">
                          <FileText size={24} className="text-seal" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-slate">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate group-hover:text-ink transition-colors">
                          <UploadCloud size={24} />
                          <span className="text-sm">Click or drag new version to upload</span>
                          <span className="text-xs text-slate/70">PDF, JPG, PNG up to 50MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-8">
                  <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-slate hover:text-ink font-medium">Cancel</button>
                  <button type="submit" disabled={!file} className="rounded-md bg-ink text-paper px-6 py-2 text-sm font-medium hover:bg-ink-2 transition-colors disabled:opacity-50">
                    Upload & Update
                  </button>
                </div>
              </form>
            )}

            {phase !== 'form' && (
              <div className="py-2">
                <div className="flex items-center gap-3 mb-6">
                  {phase === 'running' ? (
                    <Loader2 className="animate-spin text-seal" size={24} />
                  ) : (
                    <CheckCircle2 className="text-verified" size={24} />
                  )}
                  <h3 className="font-display text-xl">
                    {phase === 'running' ? 'Uploading New Version...' : 'Update Complete'}
                  </h3>
                </div>

                <div className="space-y-4 mb-8">
                  {stepLog.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 text-sm text-ink/80"
                    >
                      <CheckCircle2 size={16} className="text-verified mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </motion.div>
                  ))}
                </div>

                {phase === 'done' && result && (
                  <div className="rounded-lg border border-line bg-white/70 p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-verified/10 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-verified" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">Version {result.version} Registered</p>
                      <p className="text-xs text-slate font-mono mt-0.5 truncate">{result.hash}</p>
                    </div>
                  </div>
                )}

                {phase === 'done' && (
                  <div className="flex justify-end mt-8">
                    <button onClick={handleClose} className="rounded-md bg-ink text-paper px-6 py-2 text-sm font-medium hover:bg-ink-2 transition-colors">
                      Done
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
