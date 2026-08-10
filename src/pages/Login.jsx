import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Seal from '../components/Seal';

const ROLES = [
  { id: 'lawyer', title: 'Lawyer / Client', desc: 'File and track case documents' },
  { id: 'judge', title: 'Judge / Court', desc: 'Verify and review records' },
  { id: 'admin', title: 'Registry Admin', desc: 'Govern access and users' },
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
    <div className="min-h-screen bg-paper text-ink grain flex flex-col">
      <header className="px-6 md:px-10 py-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <Seal status="verified" size={26} animate={false} />
          <span className="font-display text-lg">eVault</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!role ? (
              <motion.div
                key="roles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-3xl mb-1.5">Sign In</h1>
                <p className="text-slate text-sm mb-8">Select your registry role to continue.</p>
                <div className="space-y-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className="w-full flex items-center justify-between rounded-xl border border-line bg-white/60 px-5 py-4 text-left hover:border-seal/50 hover:bg-white/80 transition-all"
                    >
                      <span>
                        <span className="block font-display text-lg">{r.title}</span>
                      </span>
                      <span className="text-slate">→</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
              >
                <button type="button" onClick={() => setRole(null)} className="text-xs text-slate hover:text-ink mb-6 transition-colors">
                  ← back to roles
                </button>
                <h1 className="font-display text-3xl mb-8">
                  {ROLES.find((r) => r.id === role)?.title}
                </h1>

                <label className="block text-xs uppercase tracking-[0.1em] text-slate mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-white/70 px-4 py-2.5 text-sm mb-4 focus:border-seal outline-none transition-colors"
                />
                <label className="block text-xs uppercase tracking-[0.1em] text-slate mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-white/70 px-4 py-2.5 text-sm mb-6 focus:border-seal outline-none transition-colors"
                />

                {error && <p className="text-xs text-maroon mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-ink text-paper py-3 text-sm font-medium hover:bg-ink-2 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Authenticating...' : 'Sign in'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
