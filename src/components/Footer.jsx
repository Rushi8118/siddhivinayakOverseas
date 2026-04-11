import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Globe, Mail, Phone, MapPin, ArrowRight, Shield, Award, Clock, 
  MessageCircle
} from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa'

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
  { name: 'New Zealand', path: '/programs' },
]

const company = [
  { name: 'About Us', path: '/about' },
  { name: 'Our Team', path: '/about' },
  { name: 'Careers', path: '/careers' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

const trustBadges = [
  { icon: Shield, label: 'ICCRC Certified', color: 'text-royal-400' },
  { icon: Award, label: 'ISO 9001:2015', color: 'text-teal-400' },
  { icon: Clock, label: '24/7 Support', color: 'text-gold-400' },
]

const socialLinks = [
  { icon: FaFacebook, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
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
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-glass flex-1"
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
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
                <Globe size={24} className="text-white" />
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
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white hover:border-royal-500/30 transition-colors"
                  aria-label={social.label}
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
                <span>123 Immigration Tower,<br />Toronto, Canada M5H 2N2</span>
              </li>
              <li>
                <a 
                  href="tel:+18005558472" 
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Phone size={16} className="text-royal-400 flex-shrink-0" />
                  +1 (800) 555-VISA
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@globalvisapro.com" 
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Mail size={16} className="text-royal-400 flex-shrink-0" />
                  info@globalvisapro.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/18005558472"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-green-400 transition-colors"
                >
                  <MessageCircle size={16} className="text-green-400 flex-shrink-0" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} SiddhivinayakOverseas. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/18005558472"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 text-white"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </motion.a>
    </footer>
  )
}
