import { motion } from 'framer-motion'
import { Scale, AlertCircle, CheckCircle, XCircle, FileText, RefreshCw, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    icon: CheckCircle,
    color: 'text-teal-400',
    bg: 'rgba(20,184,166,0.12)',
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using SiddhivinayakOverseas services, you agree to these Terms of Service.',
      'If you do not agree to any part, you must discontinue use of our services immediately.',
      'We reserve the right to update these terms; continued use constitutes acceptance.',
    ],
  },
  {
    icon: FileText,
    color: 'text-royal-400',
    bg: 'rgba(37,99,235,0.12)',
    title: 'Our Services',
    content: [
      'We provide immigration consulting, visa application assistance, and documentation support.',
      'We act as authorised immigration consultants and do not guarantee visa approvals.',
      'Free consultations are preliminary assessments only and do not constitute legal advice.',
    ],
  },
  {
    icon: AlertCircle,
    color: 'text-gold-400',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Client Responsibilities',
    content: [
      'You must provide accurate, complete, and truthful information for all applications.',
      'Submission of false information may result in termination of services without refund.',
      'You are responsible for meeting deadlines communicated by our team or immigration authorities.',
    ],
  },
  {
    icon: Scale,
    color: 'text-purple-400',
    bg: 'rgba(139,92,246,0.12)',
    title: 'Fees & Refund Policy',
    content: [
      'Service fees are outlined in your individual client agreement.',
      'Government filing fees and third-party costs are separate from our consulting fees.',
      'Refunds are governed by the refund clause in your service agreement; processing fees are non-refundable.',
    ],
  },
  {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'rgba(239,68,68,0.12)',
    title: 'Limitation of Liability',
    content: [
      'SiddhivinayakOverseas is not liable for decisions made by immigration authorities or embassies.',
      'Our liability is limited to the fees paid for the specific service in question.',
      'We do not guarantee job placements, admissions, or permanent residency outcomes.',
    ],
  },
  {
    icon: RefreshCw,
    color: 'text-green-400',
    bg: 'rgba(34,197,94,0.12)',
    title: 'Intellectual Property',
    content: [
      'All website content is owned by SiddhivinayakOverseas.',
      'You may not reproduce or modify any content without prior written consent.',
      'Unauthorised use of our brand name or logo is strictly prohibited.',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-24">
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link to="/" className="hover:text-royal-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300">Terms of Service</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-royal-500 flex items-center justify-center shadow-lg shadow-gold-500/25">
              <Scale size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gold-400 font-semibold uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h1>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-slate-400 leading-relaxed">
              Please read these Terms carefully before using <span className="text-white font-semibold">SiddhivinayakOverseas</span> services. These terms govern your relationship with us and set out your rights and obligations.
            </p>
            <p className="text-slate-500 text-sm mt-4">Last updated: <span className="text-slate-400">April 18, 2026</span> &nbsp;·&nbsp; Jurisdiction: <span className="text-slate-400">Surat, Gujarat, India</span></p>
          </div>
        </motion.div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={section.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: section.bg }}>
                  <section.icon size={20} className={section.color} />
                </div>
                <h2 className="text-lg font-bold text-white">{i + 1}. {section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gold-500 to-royal-500 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-10 glass-premium rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-3">Governing Law & Disputes</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            These Terms shall be governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts of Surat, Gujarat. We encourage resolution through our internal grievance mechanism first.
          </p>
        </motion.div>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {[{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Cookie Policy', to: '/cookies' }, { label: 'Contact Us', to: '/contact' }].map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-2 rounded-xl glass text-sm text-slate-400 hover:text-gold-400 transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
