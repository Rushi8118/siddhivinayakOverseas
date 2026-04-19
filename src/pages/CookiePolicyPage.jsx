import { motion } from 'framer-motion'
import { ShieldCheck, Settings, BarChart2, Shield, Sliders, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const cookieTypes = [
  {
    name: 'Essential Cookies',
    badge: 'Always Active',
    badgeColor: 'text-teal-400',
    badgeBg: 'rgba(20,184,166,0.15)',
    icon: Shield,
    iconColor: 'text-teal-400',
    iconBg: 'rgba(20,184,166,0.12)',
    desc: 'These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as setting your privacy preferences, logging in, or filling in forms.',
    examples: ['Session authentication', 'Security tokens', 'Load balancing', 'Cookie consent state'],
  },
  {
    name: 'Analytics Cookies',
    badge: 'Optional',
    badgeColor: 'text-royal-400',
    badgeBg: 'rgba(37,99,235,0.15)',
    icon: BarChart2,
    iconColor: 'text-royal-400',
    iconBg: 'rgba(37,99,235,0.12)',
    desc: 'These cookies allow us to count visits and traffic sources so we can measure and improve site performance. All information is aggregated and anonymous.',
    examples: ['Page view tracking', 'User journey analytics', 'Performance monitoring', 'Traffic source attribution'],
  },
  {
    name: 'Preference Cookies',
    badge: 'Optional',
    badgeColor: 'text-gold-400',
    badgeBg: 'rgba(245,158,11,0.15)',
    icon: Settings,
    iconColor: 'text-gold-400',
    iconBg: 'rgba(245,158,11,0.12)',
    desc: 'These cookies enable the website to remember choices you make such as your language or region, and provide enhanced, personalised features.',
    examples: ['Language preference', 'Region/country setting', 'Currency display', 'Accessibility settings'],
  },
  {
    name: 'Marketing Cookies',
    badge: 'Optional',
    badgeColor: 'text-purple-400',
    badgeBg: 'rgba(139,92,246,0.15)',
    icon: Sliders,
    iconColor: 'text-purple-400',
    iconBg: 'rgba(139,92,246,0.12)',
    desc: 'These cookies may be set through our site by our advertising partners to build a profile of your interests. They do not store directly personal information.',
    examples: ['Retargeting ads', 'Social media pixels', 'Campaign performance', 'Interest-based ads'],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-28 pb-24">
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link to="/" className="hover:text-royal-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300">Cookie Policy</span>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-royal-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-teal-400 font-semibold uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Cookie Policy</h1>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-slate-400 leading-relaxed">
              <span className="text-white font-semibold">SiddhivinayakOverseas</span> uses cookies and similar tracking technologies to enhance your browsing experience. This policy explains what cookies are, which ones we use, and how you can manage them.
            </p>
            <p className="text-slate-500 text-sm mt-4">Last updated: <span className="text-slate-400">April 18, 2026</span></p>
          </div>
        </motion.div>

        {/* What are cookies */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">What Are Cookies?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you use the site. Cookies cannot execute programs or deliver viruses to your device.
          </p>
        </motion.div>

        {/* Cookie Types */}
        <div className="space-y-5">
          {cookieTypes.map((type, i) => (
            <motion.div key={type.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-2xl p-8">
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: type.iconBg }}>
                    <type.icon size={20} className={type.iconColor} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{type.name}</h2>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: type.badgeBg, color: type.badgeColor.replace('text-', '') }}>
                  <span className={type.badgeColor}>{type.badge}</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{type.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                {type.examples.map((ex) => (
                  <div key={ex} className="flex items-center gap-2 text-slate-500 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-teal-500 to-royal-500 flex-shrink-0" />
                    {ex}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* How to manage */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8 glass-premium rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-3">Managing Your Cookie Preferences</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            You can control cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Note that disabling cookies may affect website functionality. You can also opt out of analytics by using browser extensions like uBlock Origin or Google Analytics Opt-out.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {['Chrome Settings', 'Firefox Settings', 'Safari Settings', 'Edge Settings'].map((b) => (
              <div key={b} className="glass rounded-xl px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                {b}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related links */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {[{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms of Service', to: '/terms' }, { label: 'Sitemap', to: '/sitemap' }].map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-2 rounded-xl glass text-sm text-slate-400 hover:text-teal-400 transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
