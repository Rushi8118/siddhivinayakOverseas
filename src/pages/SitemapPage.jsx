import { motion } from 'framer-motion'
import { Map, Globe, FileText, Users, Phone, ChevronRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const sitemapData = [
  {
    category: 'Main Pages',
    icon: Globe,
    color: 'text-royal-400',
    bg: 'rgba(37,99,235,0.12)',
    links: [
      { name: 'Home', path: '/', desc: 'Welcome to SiddhivinayakOverseas' },
      { name: 'Programs', path: '/programs', desc: 'Immigration and visa programs' },
      { name: 'Apply Now', path: '/apply', desc: 'Start your free application' },
      { name: 'Contact Us', path: '/contact', desc: 'Get in touch with our team' },
    ],
  },
  {
    category: 'Services',
    icon: FileText,
    color: 'text-teal-400',
    bg: 'rgba(20,184,166,0.12)',
    links: [
      { name: 'Work Permit', path: '/services/work-permit', desc: 'International employment visa assistance' },
      { name: 'Study Visa', path: '/services/study-visa', desc: 'Student visa for top universities' },
      { name: 'Job Assistance', path: '/services/job-assistance', desc: 'Career placement abroad' },
    ],
  },
  {
    category: 'Countries',
    icon: Map,
    color: 'text-gold-400',
    bg: 'rgba(245,158,11,0.12)',
    links: [
      { name: 'Canada 🇨🇦', path: '/countries/canada', desc: 'Express Entry, PNP, and more' },
      { name: 'Australia 🇦🇺', path: '/countries/australia', desc: 'Skilled migration and study' },
      { name: 'Germany 🇩🇪', path: '/countries/germany', desc: 'Work visa and job seeker visa' },
      { name: 'United Kingdom 🇬🇧', path: '/countries/uk', desc: 'Skilled Worker and student visas' },
      { name: 'USA 🇺🇸', path: '/countries/usa', desc: 'H-1B, student, and visitor visas' },
    ],
  },
  {
    category: 'Account',
    icon: Users,
    color: 'text-purple-400',
    bg: 'rgba(139,92,246,0.12)',
    links: [
      { name: 'Login', path: '/login', desc: 'Sign in to your account' },
      { name: 'Sign Up', path: '/signup', desc: 'Create a new account' },
      { name: 'Dashboard', path: '/dashboard', desc: 'Manage your applications' },
    ],
  },
  {
    category: 'Legal',
    icon: Phone,
    color: 'text-green-400',
    bg: 'rgba(34,197,94,0.12)',
    links: [
      { name: 'Privacy Policy', path: '/privacy', desc: 'How we handle your data' },
      { name: 'Terms of Service', path: '/terms', desc: 'Rules governing our services' },
      { name: 'Cookie Policy', path: '/cookies', desc: 'Our use of cookies' },
      { name: 'Sitemap', path: '/sitemap', desc: 'This page' },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-24">
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link to="/" className="hover:text-royal-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300">Sitemap</span>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
              <Map size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-royal-400 font-semibold uppercase tracking-widest mb-1">Navigation</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Sitemap</h1>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-slate-400 leading-relaxed">
              A complete overview of all pages available on <span className="text-white font-semibold">SiddhivinayakOverseas</span>. Use this page to quickly navigate to any section of our website.
            </p>
          </div>
        </motion.div>

        {/* Sitemap Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {sitemapData.map((section, i) => (
            <motion.div key={section.category} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: section.bg }}>
                  <section.icon size={18} className={section.color} />
                </div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">{section.category}</h2>
              </div>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
                    >
                      <div>
                        <span className={`text-sm font-medium text-slate-300 group-hover:${section.color} transition-colors`}>
                          {link.name}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                      </div>
                      <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-slate-600 text-sm mt-12">
          Last updated: April 18, 2026 &nbsp;·&nbsp; SiddhivinayakOverseas © {new Date().getFullYear()}
        </motion.p>
      </div>
    </div>
  )
}
