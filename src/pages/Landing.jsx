import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seal from '../components/Seal';

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-center items-center">
      <header className="fixed top-0 w-full max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Seal status="verified" size={28} animate={false} />
          <span className="font-display text-lg">eVault</span>
        </div>
        <Link
          to="/login"
          className="rounded-lg bg-ink text-paper text-sm px-5 py-2 hover:bg-ink-2 transition-colors"
        >
          Registry Access
        </Link>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl text-center px-6"
      >
        <div className="flex justify-center mb-8">
          <Seal status="verified" size={80} animate={true} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">
          Legal Records Management
        </h1>
        <p className="text-slate text-lg mb-10 max-w-md mx-auto">
          Secure, immutable storage and verification of court evidence and case filings.
        </p>
        <Link
          to="/login"
          className="inline-block rounded-lg bg-ink text-paper px-8 py-3.5 text-sm font-medium hover:bg-ink-2 transition-colors shadow-sm"
        >
          Sign In to Registry
        </Link>
      </motion.main>
      
      <footer className="fixed bottom-0 w-full text-center py-6">
        <p className="text-xs text-slate uppercase tracking-widest">Ministry of Law &amp; Justice</p>
      </footer>
    </div>
  );
}
