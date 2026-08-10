import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Seal from '../components/Seal';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  const [view, setView] = useState('login'); // 'login' | 'register' | 'success'
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regForm, setRegForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login({ email, password });
      setUser(user);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // By default, public registration creates a pending client account
      await register({ ...regForm, role: 'client', status: 'pending' });
      setView('success');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            Institutional Legal Records
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
              {view === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                >
                  <div className="mb-10">
                    <h1 className="text-3xl font-display font-semibold tracking-tight">Secure Sign In</h1>
                    <p className="text-sm text-slate mt-2">Access the legal records portal</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Email / User ID</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-line bg-white px-4 py-3 text-sm focus:border-seal focus:shadow-sm outline-none transition-all duration-200"
                        placeholder="user@registry.gov.in"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-line bg-white px-4 py-3 text-sm focus:border-seal focus:shadow-sm outline-none transition-all duration-200"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-3 bg-maroon/10 border border-maroon/20 rounded-md text-sm text-maroon-dark">
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 rounded-md bg-ink hover:bg-ink-2 text-white py-3.5 text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                  >
                    {loading ? 'Authenticating...' : (
                      <>Sign In <ArrowRight size={16} /></>
                    )}
                  </button>
                  
                  <div className="mt-8 pt-8 border-t border-line text-center">
                    <p className="text-sm text-slate">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => { setError(''); setView('register'); }} className="font-semibold text-ink hover:text-seal transition-colors">
                        Request Access
                      </button>
                    </p>
                  </div>
                </motion.form>
              )}

              {view === 'register' && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-display font-semibold tracking-tight">Request Access</h1>
                    <p className="text-sm text-slate mt-2">Client onboarding for shared records</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input type="text" required value={regForm.fullName} onChange={(e) => setRegForm({...regForm, fullName: e.target.value})} className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:border-seal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Email</label>
                      <input type="email" required value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:border-seal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Phone Number (Optional)</label>
                      <input type="tel" value={regForm.phone} onChange={(e) => setRegForm({...regForm, phone: e.target.value})} className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:border-seal outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Password</label>
                        <input type="password" required value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:border-seal outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide">Confirm</label>
                        <input type="password" required value={regForm.confirm} onChange={(e) => setRegForm({...regForm, confirm: e.target.value})} className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:border-seal outline-none" />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-3 bg-maroon/10 border border-maroon/20 rounded-md text-sm text-maroon-dark">
                      {error}
                    </motion.div>
                  )}

                  <div className="mt-8 flex gap-3">
                    <button type="button" onClick={() => { setError(''); setView('login'); }} className="px-6 py-3 text-sm font-semibold text-slate hover:text-ink transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 rounded-md bg-ink hover:bg-ink-2 text-white py-3 text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm flex justify-center items-center gap-2">
                      {loading ? 'Submitting...' : (
                        <>Submit Request <Lock size={14} /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {view === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-verified/10 border-2 border-verified text-verified rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield size={32} />
                  </div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Registration Submitted</h2>
                  <p className="text-slate text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                    Your request has been submitted for administrative review. Your account will become available after a registry administrator approves it.
                  </p>
                  <button onClick={() => setView('login')} className="rounded-md border border-line bg-white px-8 py-2.5 text-sm font-semibold text-ink hover:border-seal hover:shadow-sm transition-all">
                    Return to Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
