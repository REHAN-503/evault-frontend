import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { FileText, Shield, LayoutDashboard, History, LogOut, Search, Bell, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Seal from './Seal';

const NAV = {
  lawyer: [
    { to: '/lawyer', label: 'Documents', icon: FileText },
    { to: '/lawyer/audit', label: 'Audit Trail', icon: History },
  ],
  judge: [
    { to: '/judge', label: 'Verification Queue', icon: Shield },
    { to: '/judge/audit', label: 'Audit Trail', icon: History },
  ],
  admin: [
    { to: '/admin', label: 'System Status', icon: LayoutDashboard },
    { to: '/admin/audit', label: 'Global Audit', icon: History },
  ],
  client: [
    { to: '/client', label: 'My Records', icon: FileText },
  ],
};

const ROLE_LABEL = {
  lawyer: 'Counsel',
  judge: 'Court',
  admin: 'Registry',
  client: 'Client',
};

export default function PortalShell({ role, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = NAV[role] || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const NavLinks = () => (
    <div className="space-y-1 mt-4">
      <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-light">Menu</div>
      {items.map((item) => {
        const Icon = item.icon;
        const activeItem = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeItem ? 'bg-seal/10 text-seal-dark shadow-sm' : 'text-slate hover:bg-slate/5 hover:text-ink hover:translate-x-1'
            }`}
          >
            <Icon size={16} className={activeItem ? 'text-seal-dark' : 'text-slate-light'} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row font-body text-ink selection:bg-seal/20 selection:text-seal-dark relative overflow-hidden">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-seal/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-verified/5 blur-[120px] pointer-events-none z-0"></div>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-line z-20 shadow-sm relative">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-seal to-verified"></div>
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-line">
          <Seal status="verified" size={24} animate={false} />
          <span className="font-display font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-ink to-slate">eVault</span>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="px-3 py-2 mb-2 bg-gradient-to-br from-paper-dim to-white rounded-md flex items-center justify-between border border-line shadow-sm">
            <span className="text-xs font-medium text-ink-2">Workspace</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate bg-white px-1.5 py-0.5 rounded border border-line shadow-sm">{ROLE_LABEL[role]}</span>
          </div>
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-line">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="group flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate hover:bg-maroon/5 hover:text-maroon rounded-md transition-all duration-200"
          >
            <LogOut size={16} className="text-slate-light group-hover:text-maroon transition-colors" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between border-b border-line bg-white/80 backdrop-blur-md px-4 h-14 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Seal status="verified" size={20} animate={false} />
          <span className="font-display font-semibold text-base">eVault</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-slate hover:text-ink transition-colors">
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-20 bg-white/95 backdrop-blur-md pt-14 flex flex-col"
          >
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
              <NavLinks />
            </nav>
            <div className="p-4 border-t border-line">
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-2 text-sm font-medium text-maroon hover:bg-maroon/5 px-3 py-2 rounded-md transition-colors w-full"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-paper/50">
        {/* Top Header */}
        <header className="hidden md:flex h-16 bg-white/80 backdrop-blur-md border-b border-line items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 flex items-center gap-4">
            {/* Search (visual only for shell) */}
            <div className="relative w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light group-focus-within:text-seal transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search records, hashes, or cases..." 
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-paper-dim border border-transparent rounded-md focus:bg-white focus:border-seal focus:shadow-sm focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-slate-light hover:text-ink transition-all duration-200 hover:scale-110 relative"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-seal rounded-full border-2 border-white animate-pulse"></span>
            </button>

              <AnimatePresence>
              {notificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 right-48 w-80 bg-white border border-line rounded-lg shadow-xl z-50 overflow-hidden origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-line bg-paper-dim/50 flex justify-between items-center">
                    <span className="text-sm font-semibold text-ink">Notifications</span>
                    <button 
                      onClick={() => {
                        import('sonner').then(({ toast }) => toast.success('All notifications marked as read'));
                        setNotificationsOpen(false);
                      }} 
                      className="text-xs text-seal hover:text-seal-dark font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { id: 1, title: 'Document Verified', desc: 'Case CR-2023-89 verified by Judge', time: '10m ago', unread: true },
                      { id: 2, title: 'Ledger Sync', desc: 'EVM ledger successfully synchronized', time: '1h ago', unread: false },
                      { id: 3, title: 'Access Granted', desc: 'You have been granted access to DOC-8123', time: '2h ago', unread: false },
                    ].map(n => (
                      <div key={n.id} className={`p-4 border-b border-line last:border-b-0 hover:bg-paper-dim/30 transition-colors cursor-pointer ${n.unread ? 'bg-seal/5' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-medium ${n.unread ? 'text-seal-dark' : 'text-ink'}`}>{n.title}</span>
                          <span className="text-[10px] text-slate font-medium">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-line text-center bg-paper-dim/30 hover:bg-paper-dim transition-colors cursor-pointer">
                    <span className="text-xs font-medium text-slate">View all activity</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 pl-6 border-l border-line">
              <div className="text-right">
                <p className="text-sm font-medium text-ink leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate">{user?.email}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-paper-dim to-line border border-line flex items-center justify-center text-slate shadow-sm">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
