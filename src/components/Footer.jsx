import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mail, Phone, MapPin, ArrowRight, Shield, Award, Clock
} from 'lucide-react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'

const services = [
  { name: 'Work Permit', path: '/services/work-permit' },
  { name: 'Study Visa', path: '/services/study-visa' },
  { name: 'Job Assistance', path: '/services/job-assistance' },
  { name: 'PR Application', path: '/programs' },
  { name: 'Family Visa', path: '/programs' },
  { name: 'Business Visa', path: '/programs' },
]

const countries = [
  { name: 'Canada', path: '/countries/canada' },
  { name: 'Australia', path: '/countries/australia' },
  { name: 'Germany', path: '/countries/germany' },
  { name: 'United Kingdom', path: '/countries/uk' },
  { name: 'USA', path: '/countries/usa' },
  { name: 'New Zealand', path: '/countries/new-zealand' },
]

const company = [
  { name: 'About Us', path: '/contact' },
  { name: 'Our Team', path: '/contact' },
  { name: 'Careers', path: '/contact' },
  { name: 'Contact', path: '/contact' },
]

const trustBadges = [
  { icon: Shield, label: 'ICCRC Certified', color: 'text-royal-400' },
  { icon: Award, label: 'ISO 9001:2015', color: 'text-teal-400' },
  { icon: Clock, label: '24/7 Support', color: 'text-gold-400' },
]

const socialLinks = [
  { icon: FaFacebook,  href: '#',                             label: 'Facebook',  hoverColor: '#1877F2' },
  { icon: FaInstagram, href: '#',                             label: 'Instagram', hoverColor: '#E1306C' },
  { icon: FaWhatsapp,  href: 'https://wa.me/919925064666',    label: 'WhatsApp',  hoverColor: '#25D366' },
]

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-white/5 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
      
      {/* Newsletter Section */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Stay Updated on Immigration News
              </h3>
              <p className="text-slate-400">
                Get the latest visa updates, policy changes, and immigration tips delivered to your inbox.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => {
                e.preventDefault()
                const email = e.target.email.value
                if (email) {
                  toast.success('Subscribed! You\'ll receive immigration updates soon.')
                  e.target.reset()
                }
              }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input-glass flex-1"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Subscribe <ArrowRight size={16} />
                </motion.button>
              </form>
              <p className="text-xs text-slate-500 mt-3">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-royal-500/20">
                <img src="/favicon.svg" alt="SiddhivinayakOverseas" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">SiddhivinayakOverseas</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted immigration partner for over 15 years. We&apos;ve helped 50,000+ clients achieve 
              their dreams of living, working, and studying abroad.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm">
                  <badge.icon size={16} className={badge.color} />
                  <span className="text-slate-400">{badge.label}</span>
                </div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ '--hover-color': social.hoverColor }}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 transition-all social-icon"
                  aria-label={social.label}
                  onMouseEnter={e => e.currentTarget.style.color = social.hoverColor}
                  onMouseLeave={e => e.currentTarget.style.color = ''}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.path} 
                    className="text-slate-400 hover:text-royal-400 text-sm transition-colors inline-block"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Countries</h4>
            <ul className="space-y-3">
              {countries.map((country) => (
                <li key={country.name}>
                  <Link 
                    to={country.path} 
                    className="text-slate-400 hover:text-royal-400 text-sm transition-colors inline-block"
                  >
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-slate-400 hover:text-royal-400 text-sm transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-royal-400 mt-0.5 flex-shrink-0" />
                <span>620 6th Floors Pragti IT Park World<br />Kiranchock To Yogichok Road , Surat , Gujarat</span>
              </li>
              <li>
                <a 
                  href="tel:+919925064666" 
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Phone size={16} className="text-royal-400 flex-shrink-0" />
                  +91 99250 64666
                  +44 7471489599
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@siddhivinayakoverseas.com" 
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Mail size={16} className="text-royal-400 flex-shrink-0" />
                  info@siddhivinayakoverseas.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/919925064666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-green-400 transition-colors"
                >
                  <FaWhatsapp size={16} className="text-green-400 flex-shrink-0" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Copyright — top / left */}
            <p className="text-slate-500 text-sm order-first">
              &copy; {new Date().getFullYear()} <span className="text-slate-400 font-medium">SiddhivinayakOverseas</span>. All rights reserved.
            </p>
            {/* Legal links — right side */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link to="/privacy" className="text-slate-500 hover:text-royal-400 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-500 hover:text-gold-400 text-sm transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-slate-500 hover:text-teal-400 text-sm transition-colors">Cookie Policy</Link>
              <Link to="/sitemap" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
