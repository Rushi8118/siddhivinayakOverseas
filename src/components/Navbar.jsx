import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, LogOut, FileText, Phone, GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signOut as supabaseSignOut } from '../lib/supabaseClient'

const services = [
  { name: 'Study in UK',                  path: '/countries/uk',          desc: 'Top-ranked universities & 2-yr PSW' },
  { name: 'Study in Germany',             path: '/countries/germany',     desc: 'Low tuition, strong job market' },
  { name: 'Study in France',              path: '/countries/france',      desc: 'Business schools & 12-month APS' },
  { name: 'UK Visa & COS Assistance',     path: '/services/study-visa',   desc: 'End-to-end visa filing & COS' },
  { name: 'University Admissions',        path: '/programs',              desc: 'SOP, LOR & application support' },
]

const countries = [
  { name: 'United Kingdom', path: '/countries/uk',      flag: '🇬🇧' },
  { name: 'Germany',        path: '/countries/germany', flag: '🇩🇪' },
  { name: 'France',         path: '/countries/france',  flag: '🇫🇷' },
]

const dropdownVariants = {
  hidden:  { opacity: 0, y: 8,  scale: 0.97, transition: { duration: 0.15, ease: 'easeIn' } },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.2,  ease: 'easeOut' } },
  exit:    { opacity: 0, y: 8,  scale: 0.97, transition: { duration: 0.15, ease: 'easeIn' } },
}

const mobileMenuVariants = {
  hidden:  { opacity: 0, x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } },
  visible: { opacity: 1, x: 0,      transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit:    { opacity: 0, x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } },
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown]   = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdown(null)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSignOut = async () => {
    await supabaseSignOut()
    navigate('/')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 py-3"
        style={{
          background: scrolled ? 'rgba(240, 249, 255, 0.88)' : 'rgba(240, 249, 255, 0.35)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          boxShadow: scrolled ? '0 8px 32px rgba(15, 42, 68, 0.10)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group min-w-0">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-glow-gold bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center"
              >
                <GraduationCap size={22} className="text-navy-900" strokeWidth={2.3} />
              </motion.div>
              <div className="hidden sm:block min-w-0">
                <div className="font-display font-bold text-navy-900 leading-tight tracking-tight text-lg truncate group-hover:text-gold-600 transition-colors">
                  Siddhivinayak
                </div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-gold-600 font-semibold -mt-0.5">
                  Overseas
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              <NavLink to="/">Home</NavLink>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdown('services')}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1.5 px-3.5 py-2">
                  Services
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdown === 'services' && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 pt-2">
                      <div className="rounded-2xl p-3 min-w-[280px] shadow-premium border border-white/70 bg-white/95 backdrop-blur-xl">
                        {services.map((s, i) => (
                          <motion.div key={s.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                            <Link to={s.path} className="flex flex-col px-4 py-2.5 rounded-xl text-navy-800 hover:text-gold-700 hover:bg-gold-50 transition-all group">
                              <span className="font-semibold text-sm">{s.name}</span>
                              <span className="text-xs text-navy-700/65 group-hover:text-gold-600">{s.desc}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Countries Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdown('countries')}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1.5 px-3.5 py-2">
                  Countries
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdown === 'countries' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdown === 'countries' && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 pt-2">
                      <div className="rounded-2xl p-3 min-w-[220px] shadow-premium border border-white/70 bg-white/95 backdrop-blur-xl">
                        {countries.map((c, i) => (
                          <motion.div key={c.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                            <Link to={c.path} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-navy-800 hover:text-gold-700 hover:bg-gold-50 transition-all">
                              <span className="text-lg">{c.flag}</span>
                              <span className="text-sm font-medium">{c.name}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/programs">Programs</NavLink>
              <NavLink to="/reviews">Reviews</NavLink>
              <NavLink to="/contact">Contact</NavLink>

              <Link
                to="/apply"
                className="relative ml-2 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gold-700 hover:text-gold-800 transition-colors group"
              >
                <FileText size={14} />
                Apply Now
                <motion.span
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-gold-500 to-sky-500 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </Link>
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="tel:+919925064666"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-navy-800 hover:text-gold-700 hover:bg-gold-50 transition-all text-sm font-semibold"
                aria-label="Call Siddhivinayak Overseas"
              >
                <Phone size={15} /> <span className="hidden xl:inline">+91 99250 64666</span>
              </a>
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-navy-800 hover:text-gold-700 hover:bg-gold-50 transition-all text-sm font-medium">
                    <User size={16} /> Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm font-medium">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/signup">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-gold text-sm px-5 py-2.5">
                    Get Started
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-11 h-11 rounded-xl bg-white/80 border border-white/90 flex items-center justify-center text-navy-900 shadow-soft"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
              style={{ background: 'rgba(15, 42, 68, 0.35)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-gradient-to-b from-sky-50 to-white border-l border-white/90 lg:hidden overflow-y-auto shadow-premium"
            >
              <div className="p-6 pt-24">
                <div className="space-y-1">
                  <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>

                  <div className="pt-4">
                    <div className="text-[11px] font-bold text-gold-600 uppercase tracking-widest mb-2 px-3">Services</div>
                    {services.map((s, i) => (
                      <motion.div key={s.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 + 0.1 }}>
                        <Link to={s.path} onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-navy-800 hover:text-gold-700 hover:bg-gold-50 rounded-xl transition-all">
                          <span className="font-semibold text-sm">{s.name}</span>
                          <span className="block text-[11px] text-navy-700/70 mt-0.5">{s.desc}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <div className="text-[11px] font-bold text-gold-600 uppercase tracking-widest mb-2 px-3">Countries</div>
                    <div className="grid grid-cols-1 gap-1">
                      {countries.map((c, i) => (
                        <motion.div key={c.path} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 + 0.15 }}>
                          <Link to={c.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-navy-800 hover:text-gold-700 hover:bg-gold-50 rounded-xl transition-all">
                            <span className="text-lg">{c.flag}</span>
                            <span className="text-sm font-medium">{c.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-1">
                    <MobileNavLink to="/programs" onClick={() => setMobileOpen(false)}>Programs</MobileNavLink>
                    <MobileNavLink to="/reviews"  onClick={() => setMobileOpen(false)}>Reviews</MobileNavLink>
                    <MobileNavLink to="/contact"  onClick={() => setMobileOpen(false)}>Contact</MobileNavLink>
                    <Link to="/apply" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-gold-700 hover:text-gold-800 hover:bg-gold-50 transition-all">
                      <FileText size={18} /> Apply Now
                    </Link>
                  </div>

                  <div className="pt-6 mt-4 border-t border-navy-900/10 space-y-3">
                    <a href="tel:+919925064666" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gold-50 text-navy-900 font-semibold">
                      <Phone size={18} className="text-gold-600" /> +91 99250 64666
                    </a>
                    {user ? (
                      <div className="space-y-2">
                        <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-navy-800 hover:bg-gold-50 rounded-xl transition-all">
                          <User size={18} /> Dashboard
                        </Link>
                        <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="flex items-center gap-3 px-3 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center py-3 rounded-xl">Login</Link>
                        <Link to="/signup" onClick={() => setMobileOpen(false)}>
                          <button className="btn-gold w-full py-3">Get Started</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? 'text-navy-900' : 'text-navy-800/80 hover:text-gold-700'}`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-gradient-to-r from-gold-500 to-sky-500 rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}

function MobileNavLink({ to, onClick, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-3 rounded-xl font-medium transition-all ${isActive ? 'text-gold-700 bg-gold-50' : 'text-navy-800 hover:text-gold-700 hover:bg-gold-50'}`}
    >
      {children}
    </Link>
  )
}
