import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight, Shield, Award, Clock, GraduationCap } from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin } from 'react-icons/fa'
import toast from 'react-hot-toast'

const services = [
  { name: 'Study in UK',                path: '/countries/uk' },
  { name: 'Study in Germany',           path: '/countries/germany' },
  { name: 'Study in France',            path: '/countries/france' },
  { name: 'UK Visa & COS Assistance',   path: '/services/study-visa' },
  { name: 'University Admissions',      path: '/programs' },
  { name: 'Pre-Departure Support',      path: '/services/study-visa' },
]

const countries = [
  { name: 'United Kingdom', path: '/countries/uk' },
  { name: 'Germany',        path: '/countries/germany' },
  { name: 'France',         path: '/countries/france' },
]

const company = [
  { name: 'About Us', path: '/contact' },
  { name: 'Our Team', path: '/contact' },
  { name: 'Reviews',  path: '/reviews' },
  { name: 'Contact',  path: '/contact' },
]

const trustBadges = [
  { icon: Shield, label: 'UKVI Compliant', color: 'text-gold-600' },
  { icon: Award,  label: 'Certified Counsellors', color: 'text-sky-700' },
  { icon: Clock,  label: '24/7 Student Support', color: 'text-navy-700' },
]

const socialLinks = [
  { icon: FaFacebook,  href: '#',                          label: 'Facebook',  hoverColor: '#1877F2' },
  { icon: FaInstagram, href: '#',                          label: 'Instagram', hoverColor: '#E1306C' },
  { icon: FaLinkedin,  href: '#',                          label: 'LinkedIn',  hoverColor: '#0A66C2' },
  { icon: FaWhatsapp,  href: 'https://wa.me/919925064666', label: 'WhatsApp',  hoverColor: '#25D366' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-sky-100 border-t border-sky-200/70">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />

      {/* Newsletter */}
      <div className="relative border-b border-sky-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy-900 mb-3 tracking-tight">
                Study-abroad updates, once a month.
              </h3>
              <p className="text-navy-700/80 leading-relaxed">
                Scholarship alerts, UKVI policy changes, intake reminders and offers from partner universities &mdash; straight to your inbox.
              </p>
            </div>
            <div>
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  const email = e.target.email.value
                  if (email) {
                    toast.success('Subscribed! You will receive updates soon.')
                    e.target.reset()
                  }
                }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input-glass flex-1"
                  required
                  aria-label="Email address for newsletter"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-gold whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Subscribe <ArrowRight size={16} />
                </motion.button>
              </form>
              <p className="text-xs text-navy-700/60 mt-3">
                By subscribing, you agree to our <Link to="/privacy" className="underline hover:text-gold-700">Privacy Policy</Link>. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold">
                <GraduationCap size={24} className="text-navy-900" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-display font-bold text-navy-900 tracking-tight text-xl leading-tight">Siddhivinayak</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold -mt-0.5">Overseas</div>
              </div>
            </Link>
            <p className="text-navy-700/80 text-sm leading-relaxed mb-5 max-w-sm">
              Premium overseas education consultancy for UK, Germany &amp; France.
              Trusted by Indian students and families for premium admissions, UK Visa &amp; COS assistance.
            </p>

            <div className="flex flex-wrap gap-4 mb-5">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm">
                  <badge.icon size={16} className={badge.color} />
                  <span className="text-navy-700/85 font-medium">{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-white/85 border border-sky-200 flex items-center justify-center text-navy-700 transition-all shadow-soft"
                  aria-label={social.label}
                  onMouseEnter={e => e.currentTarget.style.color = social.hoverColor}
                  onMouseLeave={e => e.currentTarget.style.color = ''}
                >
                  <social.icon size={17} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.name}>
                  <Link to={s.path} className="text-navy-700/80 hover:text-gold-700 text-sm transition-colors inline-block">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h4 className="font-display text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">Destinations</h4>
            <ul className="space-y-2.5">
              {countries.map((c) => (
                <li key={c.name}>
                  <Link to={c.path} className="text-navy-700/80 hover:text-gold-700 text-sm transition-colors inline-block">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-navy-700/80 hover:text-gold-700 text-sm transition-colors inline-block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="font-display text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-navy-700/80">
                <MapPin size={16} className="text-gold-600 mt-0.5 flex-shrink-0" />
                <span>
                  620, 6th Floor, Pragti IT Park<br />
                  Kiran Chowk to Yogi Chowk Road<br />
                  Surat, Gujarat, India
                </span>
              </li>
              <li>
                <a href="tel:+919925064666" className="flex items-center gap-3 text-sm text-navy-800 hover:text-gold-700 transition-colors font-medium">
                  <Phone size={16} className="text-gold-600 flex-shrink-0" />
                  +91 99250 64666
                </a>
              </li>
              <li>
                <a href="tel:+447471489599" className="flex items-center gap-3 text-sm text-navy-700/80 hover:text-gold-700 transition-colors">
                  <Phone size={16} className="text-sky-600 flex-shrink-0" />
                  +44 7471 489599 (UK)
                </a>
              </li>
              <li>
                <a href="mailto:info@siddhivinayakoverseas.com" className="flex items-center gap-3 text-sm text-navy-700/80 hover:text-gold-700 transition-colors break-all">
                  <Mail size={16} className="text-gold-600 flex-shrink-0" />
                  info@siddhivinayakoverseas.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919925064666"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-navy-700/80 hover:text-green-600 transition-colors"
                >
                  <FaWhatsapp size={16} className="text-green-600 flex-shrink-0" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-sky-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-navy-700/70 text-sm order-first">
              &copy; {new Date().getFullYear()} <span className="text-navy-900 font-semibold">Siddhivinayak Overseas</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link to="/privacy"  className="text-navy-700/70 hover:text-gold-700 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms"    className="text-navy-700/70 hover:text-gold-700 text-sm transition-colors">Terms of Service</Link>
              <Link to="/cookies"  className="text-navy-700/70 hover:text-gold-700 text-sm transition-colors">Cookie Policy</Link>
              <Link to="/sitemap"  className="text-navy-700/70 hover:text-gold-700 text-sm transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
