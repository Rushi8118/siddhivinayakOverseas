import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown, User, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signOut as supabaseSignOut } from '../lib/supabaseClient'

const services = [
  { name: 'Work Permit', path: '/services/work-permit', desc: 'International employment visas' },
  { name: 'Study Visa', path: '/services/study-visa', desc: 'Student visa assistance' },
  { name: 'Job Assistance', path: '/services/job-assistance', desc: 'Career placement abroad' },
]

const countries = [
  { name: 'Canada', path: '/countries/canada', flag: '\u{1F1E8}\u{1F1E6}' },
  { name: 'Australia', path: '/countries/australia', flag: '\u{1F1E6}\u{1F1FA}' },
  { name: 'Germany', path: '/countries/germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { name: 'United Kingdom', path: '/countries/uk', flag: '\u{1F1EC}\u{1F1E7}' },
  { name: 'USA', path: '/countries/usa', flag: '\u{1F1FA}\u{1F1F8}' },
]

// Animation variants for smoother transitions
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: 8,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeIn' }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: 8,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
}

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    x: '100%',
    transition: { type: 'spring', damping: 30, stiffness: 300 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  },
  exit: { 
    opacity: 0, 
    x: '100%',
    transition: { type: 'spring', damping: 30, stiffness: 300 }
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState(null)
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-3 glass-dark shadow-premium' 
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25"
              >
                <Globe size={22} className="text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-royal-400 transition-colors">
                  SiddhivinayakOverseas
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/">Home</NavLink>
              
              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setDropdown('services')} 
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="nav-link flex items-center gap-1.5 px-4 py-2">
                  Services 
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-200 ${dropdown === 'services' ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {dropdown === 'services' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 pt-2"
                    >
                      <div className="glass-dark rounded-2xl p-3 min-w-[240px] shadow-premium border border-white/5">
                        {services.map((s, i) => (
                          <motion.div
                            key={s.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link 
                              to={s.path} 
                              className="flex flex-col px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                            >
                              <span className="font-medium text-sm">{s.name}</span>
                              <span className="text-xs text-slate-500 group-hover:text-slate-400">{s.desc}</span>
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
                <button className="nav-link flex items-center gap-1.5 px-4 py-2">
                  Countries 
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-200 ${dropdown === 'countries' ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {dropdown === 'countries' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 pt-2"
                    >
                      <div className="glass-dark rounded-2xl p-3 min-w-[200px] shadow-premium border border-white/5">
                        {countries.map((c, i) => (
                          <motion.div
                            key={c.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link 
                              to={c.path} 
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                            >
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
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    <User size={16} /> Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="nav-link px-4 py-2">
                    Login
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm glass-dark border-l border-white/5 lg:hidden overflow-y-auto"
            >
              <div className="p-6 pt-24">
                <div className="space-y-2">
                  <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>
                    Home
                  </MobileNavLink>
                  
                  {/* Services Section */}
                  <div className="pt-4">
                    <div className="text-xs font-semibold text-royal-400 uppercase tracking-widest mb-3 px-3">
                      Services
                    </div>
                    {services.map((s, i) => (
                      <motion.div
                        key={s.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                      >
                        <Link 
                          to={s.path} 
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <span className="font-medium">{s.name}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">{s.desc}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Countries Section */}
                  <div className="pt-4">
                    <div className="text-xs font-semibold text-royal-400 uppercase tracking-widest mb-3 px-3">
                      Countries
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {countries.map((c, i) => (
                        <motion.div
                          key={c.path}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 + 0.15 }}
                        >
                          <Link 
                            to={c.path} 
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <span>{c.flag}</span>
                            <span className="text-sm">{c.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <MobileNavLink to="/programs" onClick={() => setMobileOpen(false)}>
                      Programs
                    </MobileNavLink>
                    <MobileNavLink to="/blog" onClick={() => setMobileOpen(false)}>
                      Blog
                    </MobileNavLink>
                    <MobileNavLink to="/contact" onClick={() => setMobileOpen(false)}>
                      Contact
                    </MobileNavLink>
                  </div>
                  
                  {/* Auth Section */}
                  <div className="pt-6 mt-6 border-t border-white/5">
                    {user ? (
                      <div className="space-y-2">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <User size={18} /> Dashboard
                        </Link>
                        <button 
                          onClick={() => { handleSignOut(); setMobileOpen(false); }}
                          className="flex items-center gap-3 px-3 py-3 w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link 
                          to="/login" 
                          onClick={() => setMobileOpen(false)}
                          className="btn-outline text-center py-3 rounded-xl"
                        >
                          Login
                        </Link>
                        <Link to="/signup" onClick={() => setMobileOpen(false)}>
                          <button className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                            <Sparkles size={16} /> Get Started
                          </button>
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

// Desktop Nav Link Component
function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? 'text-white' : 'text-slate-400 hover:text-white'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-royal-500 to-teal-500 rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}

// Mobile Nav Link Component
function MobileNavLink({ to, onClick, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`block px-3 py-3 rounded-xl font-medium transition-all ${
        isActive 
          ? 'text-white bg-white/5' 
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}
