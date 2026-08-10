import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../api/auth';
import { FileText, Shield, LayoutDashboard, History, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
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
};

const ROLE_LABEL = {
  lawyer: 'Lawyer / Client',
  judge: 'Judge / Court',
  admin: 'Registry Admin',
};

export default function PortalShell({ role, user, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = NAV[role] || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const activeItem = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
              activeItem ? 'bg-white/10 text-white' : 'text-paper/65 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} className={activeItem ? 'opacity-100' : 'opacity-70'} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-ink text-paper shadow-2xl z-10">
        <div className="flex items-center gap-2.5 px-6 py-8">
          <Seal status="verified" size={26} animate={false} />
          <span className="font-display text-lg tracking-wide">eVault</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <NavLinks />
        </nav>

        <div className="px-5 py-6 mt-auto">
          <p className="text-[10px] text-paper/50 uppercase tracking-widest font-bold mb-1">{ROLE_LABEL[role]}</p>
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="mt-4 flex items-center gap-2 text-xs font-medium text-paper/60 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between border-b border-line bg-paper px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Seal status="verified" size={24} animate={false} />
          <span className="font-display text-base font-semibold">eVault</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-ink">
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-ink pt-16 flex flex-col text-paper">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <NavLinks />
          </nav>
          <div className="px-5 py-6">
            <p className="text-[10px] text-paper/50 uppercase tracking-widest mb-1">{ROLE_LABEL[role]}</p>
            <p className="text-sm font-medium mb-4 text-white">{user?.name}</p>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 text-sm font-medium text-paper/60"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-paper">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 px-4 md:px-10 py-6 md:py-10 max-w-6xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
