import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Bell, Mail, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    icon: Eye,
    color: 'text-royal-400',
    bg: 'rgba(37,99,235,0.12)',
    title: 'Information We Collect',
    content: [
      'Personal identification information (name, email address, phone number, WhatsApp number)',
      'Immigration-related details you share during the application process (passport information, visa history, educational qualifications)',
      'Device and usage data (IP address, browser type, pages visited, time spent on site)',
      'Communication records when you contact us via phone, email, or chat',
      'Payment information processed securely through certified payment gateways (we do not store card details)',
    ],
  },
  {
    icon: Database,
    color: 'text-teal-400',
    bg: 'rgba(20,184,166,0.12)',
    title: 'How We Use Your Information',
    content: [
      'Processing your visa, work permit, and immigration applications',
      'Providing personalised immigration advice and program recommendations',
      'Sending important updates about your application status and immigration policies',
      'Improving our website, services, and customer experience',
      'Complying with legal obligations and regulatory requirements under Indian and international law',
      'Marketing communications (only with your explicit consent)',
    ],
  },
  {
    icon: Shield,
    color: 'text-gold-400',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Data Security',
    content: [
      'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption',
      'Access to personal data is restricted to authorised personnel on a need-to-know basis',
      'We conduct regular security audits and vulnerability assessments',
      'Our systems are hosted on ISO 27001-certified infrastructure',
      'In the unlikely event of a data breach, we will notify affected users within 72 hours',
    ],
  },
  {
    icon: Lock,
    color: 'text-purple-400',
    bg: 'rgba(139,92,246,0.12)',
    title: 'Data Sharing & Third Parties',
    content: [
      'We never sell your personal data to third parties',
      'Data may be shared with immigration authorities, embassies, and consulates as required for your application',
      'We use trusted service providers (e.g., cloud hosting, payment processors) who are contractually bound to protect your data',
      'We may disclose information if required by law or a valid government order',
      'Analytics partners receive only anonymised, aggregated data',
    ],
  },
  {
    icon: Bell,
    color: 'text-green-400',
    bg: 'rgba(34,197,94,0.12)',
    title: 'Your Rights',
    content: [
      'Right to access the personal data we hold about you',
      'Right to rectify inaccurate or incomplete information',
      'Right to erasure ("right to be forgotten") subject to legal retention requirements',
      'Right to restrict or object to certain processing activities',
      'Right to data portability in a machine-readable format',
      'Right to withdraw consent at any time for marketing communications',
    ],
  },
  {
    icon: Mail,
    color: 'text-royal-400',
    bg: 'rgba(37,99,235,0.12)',
    title: 'Cookies',
    content: [
      'We use essential cookies to ensure the website functions correctly',
      'Analytics cookies help us understand how visitors use our site (can be opted out)',
      'Preference cookies remember your settings and language choices',
      'You can manage cookies through your browser settings or our Cookie Preference Centre',
      'See our Cookie Policy for full details',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-24">
      {/* Background */}
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-10"
        >
          <Link to="/" className="hover:text-royal-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300">Privacy Policy</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-royal-400 font-semibold uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-slate-400 leading-relaxed">
              At <span className="text-white font-semibold">SiddhivinayakOverseas</span>, we are committed to protecting your personal data and your right to privacy. This policy explains what information we collect, why we collect it, and how we use it. It applies to all services offered by SiddhivinayakOverseas, including our website, consultation services, and visa application assistance.
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Last updated: <span className="text-slate-400">April 18, 2026</span> &nbsp;·&nbsp; Effective date: <span className="text-slate-400">April 18, 2026</span>
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: section.bg }}>
                  <section.icon size={20} className={section.color} />
                </div>
                <h2 className="text-lg font-bold text-white">{i + 1}. {section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-royal-500 to-teal-500 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 glass-premium rounded-2xl p-8 text-center"
        >
          <h3 className="text-white font-bold text-xl mb-2">Questions about your data?</h3>
          <p className="text-slate-400 text-sm mb-6">Contact our Data Protection Officer at any time.</p>
          <a
            href="mailto:privacy@siddhivinayakoverseas.com"
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Mail size={16} /> privacy@siddhivinayakoverseas.com
          </a>
        </motion.div>

        {/* Related links */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {[
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Cookie Policy', to: '/cookies' },
            { label: 'Sitemap', to: '/sitemap' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-xl glass text-sm text-slate-400 hover:text-royal-400 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
