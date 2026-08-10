import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadDocument } from '../api/documents';
import { UploadCloud, CheckCircle2, FileText, Loader2, X, ShieldCheck, Fingerprint, Lock } from 'lucide-react';
import { HashChip } from './Atoms';

export default function UploadModal({ open, onClose, onUploaded }) {
  const [title, setTitle] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [file, setFile] = useState(null);
  const [stepLog, setStepLog] = useState([]);
  const [phase, setPhase] = useState('form'); // form | hashing | running | done
  const [result, setResult] = useState(null);

  function reset() {
    setTitle(''); setCaseNo(''); setFile(null); setStepLog([]); setPhase('form'); setResult(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    
    // Simulate a secure hashing phase before actual upload
    setPhase('hashing');
    await new Promise(r => setTimeout(r, 1200));
    
    setPhase('running');
    setStepLog([]);
    const doc = await uploadDocument({ title, caseNo, file }, (i, label) => {
      setStepLog((prev) => [...prev, label]);
    });
    setResult(doc);
    setPhase('done');
    onUploaded?.(doc);
  }

  function handleClose() {
    if (phase === 'running' || phase === 'hashing') return;
    reset();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
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
            className="w-full max-w-[540px] rounded-xl bg-white shadow-2xl overflow-hidden border border-line"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-line bg-[#FAFAFA]">
              <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                <Lock size={18} className="text-slate" /> Secure Document Intake
              </h3>
              <button onClick={handleClose} disabled={phase === 'running' || phase === 'hashing'} className="text-slate hover:text-ink disabled:opacity-30 transition-colors bg-white border border-line rounded p-1">
                <X size={16} />
              </button>
            </div>

            <div className="p-0">
              {phase === 'form' && (
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-5">
                    
                    {/* Metadata Section */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate mb-1.5">Official Title</label>
                        <input required value={title} onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Affidavit of Evidence"
                          className="w-full rounded border border-line bg-[#F4F4F5] px-3.5 py-2.5 text-sm focus:bg-white focus:border-ink outline-none transition-colors" />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate mb-1.5">Case Ref</label>
                        <input required value={caseNo} onChange={(e) => setCaseNo(e.target.value)}
                          placeholder="CIV/2026/0417"
                          className="w-full rounded border border-line bg-[#F4F4F5] px-3.5 py-2.5 text-sm font-mono focus:bg-white focus:border-ink outline-none transition-colors" />
                      </div>
                    </div>

                    {/* File Dropzone */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate mb-1.5">Source Document</label>
                      <label className="flex flex-col items-center justify-center w-full h-36 rounded-lg border-2 border-dashed border-slate/30 bg-[#FAFAFA] hover:bg-slate/5 hover:border-slate/50 transition-all cursor-pointer group">
                        <input required type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        {file ? (
                          <div className="flex flex-col items-center gap-2 text-ink">
                            <FileText size={32} className="text-ink mb-1" />
                            <span className="text-sm font-semibold">{file.name}</span>
                            <span className="text-xs text-slate font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB Ready for encryption</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate group-hover:text-ink transition-colors">
                            <div className="w-12 h-12 bg-white rounded-full border border-line flex items-center justify-center mb-1 shadow-sm">
                              <UploadCloud size={20} />
                            </div>
                            <span className="text-sm font-medium">Click or drag file to secure intake</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate/70 font-bold">PDF, JPG, PNG up to 50MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAFA] border-t border-line">
                    <span className="text-[10px] text-slate font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-verified" /> AES-256 Client-Side Encryption
                    </span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={handleClose} className="px-4 py-2 text-xs font-semibold text-slate hover:text-ink transition-colors">Cancel</button>
                      <button type="submit" disabled={!file || !title || !caseNo} className="rounded bg-ink text-white px-6 py-2 text-sm font-semibold hover:bg-ink/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                        Sign & Register <Fingerprint size={14} />
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {(phase === 'hashing' || phase === 'running') && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full border-4 border-slate/10 border-t-ink animate-spin shrink-0"></div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">
                        {phase === 'hashing' ? 'Generating Cryptographic Identity...' : 'Registering to Ledger...'}
                      </h3>
                      <p className="text-xs text-slate font-mono mt-1">
                        {phase === 'hashing' ? 'Executing SHA-256 local hash' : 'Broadcasting transaction to registry nodes'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-2">
                    {stepLog.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 text-sm text-ink font-medium"
                      >
                        <CheckCircle2 size={16} className="text-verified mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {phase === 'done' && result && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-verified/10 border border-verified/20 flex items-center justify-center shrink-0">
                      <ShieldCheck size={24} className="text-verified" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-ink">Registration Confirmed</h3>
                      <p className="text-xs text-slate font-medium mt-1">Record immutable on the registry</p>
                    </div>
                  </div>

                  <div className="bg-[#F4F4F5] border border-line rounded-lg p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-line pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate">Record ID</span>
                      <span className="text-sm font-mono text-ink font-bold">{result.docId}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-line pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate">Version</span>
                      <span className="text-sm font-bold text-ink">v{result.version}</span>
                    </div>
                    <div className="border-b border-line pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate block mb-1">State Hash</span>
                      <HashChip value={result.hash} chars={32} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate block mb-1">Timestamp</span>
                      <span className="text-xs font-mono text-slate">{new Date(result.updatedAt).toISOString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button onClick={handleClose} className="rounded bg-ink text-white px-8 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors shadow-sm">
                      Close Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
