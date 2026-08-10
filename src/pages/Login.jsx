import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Seal from '../components/Seal';
import { Shield, ChevronRight } from 'lucide-react';

const ROLES = [
  { id: 'lawyer', title: 'Counsel / Legal', desc: 'Manage case records' },
  { id: 'judge', title: 'Court / Judge', desc: 'Verify and review' },
  { id: 'admin', title: 'Registry Admin', desc: 'System governance' },
  { id: 'client', title: 'Client Access', desc: 'View shared records' },
];

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [role, setRole] = useState(location.state?.role || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login({ email, password, role });
      setUser(user);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message || 'Could not sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex text-ink font-body selection:bg-seal/20 selection:text-seal-dark">
      {/* Left Branding Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-ink text-white flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-seal/20 blur-[140px] pointer-events-none" />
        <Link to="/" className="inline-flex items-center gap-3 relative z-10">
          <Seal status="verified" size={32} animate={false} />
          <span className="font-display text-2xl font-semibold tracking-tight">eVault</span>
        </Link>
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <Shield size={48} className="text-slate-light opacity-50" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl font-display font-medium leading-tight mb-4"
          >
            Secure Legal Records Management
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-light text-lg max-w-md leading-relaxed"
          >
            Immutable, verifiable, and strictly governed document storage for the modern judicial registry.
          </motion.p>
        </div>
        <div className="text-sm text-slate-light relative z-10">
          &copy; {new Date().getFullYear()} Ministry of Law and Justice. All rights reserved.
        </div>
      </motion.div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col bg-paper relative">
        <header className="lg:hidden p-6 absolute top-0 left-0 w-full flex items-center gap-2">
          <Seal status="verified" size={24} animate={false} />
          <span className="font-display font-semibold">eVault</span>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!role ? (
                <motion.div
                  key="roles"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">Access Portal</h1>
                  <p className="text-slate mb-8">Select your designated registry role to proceed.</p>
                  
                  <div className="space-y-3">
                    {ROLES.map((r, i) => (
                      <motion.button
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setRole(r.id)}
                        className="w-full group flex items-center justify-between rounded-lg border border-line bg-white p-4 text-left hover:border-seal hover:shadow-md transition-all duration-300"
                      >
                        <div>
                          <span className="block font-medium text-ink mb-0.5 group-hover:text-seal transition-colors">{r.title}</span>
                          <span className="block text-xs text-slate">{r.desc}</span>
                        </div>
                        <ChevronRight size={18} className="text-line group-hover:text-seal group-hover:translate-x-1 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="bg-white p-8 rounded-xl border border-line shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-seal to-verified" />
                  
                  <button type="button" onClick={() => setRole(null)} className="text-xs font-medium text-slate hover:text-ink mb-6 flex items-center gap-1 transition-colors">
                    &larr; Back to roles
                  </button>
                  
                  <div className="mb-8">
                    <h1 className="text-2xl font-display font-semibold tracking-tight">Sign In</h1>
                    <p className="text-sm text-slate mt-1">As {ROLES.find((r) => r.id === role)?.title}</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Work Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-line bg-paper-dim px-4 py-2.5 text-sm focus:bg-white focus:border-seal focus:shadow-sm outline-none transition-all duration-200"
                        placeholder="user@registry.gov"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-line bg-paper-dim px-4 py-2.5 text-sm focus:bg-white focus:border-seal focus:shadow-sm outline-none transition-all duration-200"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-maroon/10 border border-maroon/20 rounded-md text-sm text-maroon-dark">
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 rounded-md bg-ink hover:bg-ink-2 text-white py-3 text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Registry'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
