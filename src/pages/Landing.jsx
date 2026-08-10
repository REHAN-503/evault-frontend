import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seal from '../components/Seal';

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink font-body flex flex-col relative overflow-hidden selection:bg-seal/20 selection:text-seal-dark">
      
      {/* Premium Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-seal/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-verified/10 blur-[120px] pointer-events-none" />

      <header className="px-6 md:px-10 py-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5"
        >
          <Seal status="verified" size={28} animate={false} />
          <span className="font-display font-semibold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-ink to-slate">eVault</span>
        </motion.div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-seal/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-white/50 backdrop-blur-sm p-6 rounded-full border border-white shadow-xl">
            <Seal status="verified" size={72} animate={true} />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="font-display text-5xl md:text-6xl font-semibold tracking-tight mb-6 text-ink drop-shadow-sm"
        >
          Secure Legal Records <br className="hidden md:block"/> Management
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="text-slate text-lg md:text-xl mb-12 max-w-2xl leading-relaxed"
        >
          The institutional blockchain-backed registry for court documentation, evidence, and cryptographically verifiable legal records.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <Link 
            to="/login"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-ink px-10 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-ink-2"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-seal to-verified opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            <span className="relative">Access Registry Portal</span>
          </Link>
        </motion.div>
      </main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="py-8 text-center text-xs text-slate relative z-10"
      >
        &copy; {new Date().getFullYear()} Ministry of Law and Justice. SIH1284. <br />
        <span className="opacity-50">EVM Ledger Node: Operational</span>
      </motion.footer>
    </div>
  );
}
