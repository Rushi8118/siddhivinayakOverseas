import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Globe, Mail, Lock, ArrowRight, CheckCircle, Star, User, Phone, MessageCircle } from 'lucide-react'
import { updateProfile } from '../lib/supabaseClient'
import SEO from '../components/SEO'
import { COUNTRY_CODES, detectCountryCode } from '../data/countryCodes'

const benefits = [
  'Track your visa application in real-time',
  'Access personalized document checklists',
  'Get expert support from certified consultants',
  'Receive instant updates on policy changes',
]

export default function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [contactCountryCode, setContactCountryCode] = useState('+91')
  const [whatsappNumber, setWhatsAppNumber] = useState('')
  const [whatsappCountryCode, setWhatsAppCountryCode] = useState('+91')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneDetected, setPhoneDetected] = useState(null)
  const [waDetected, setWaDetected] = useState(null)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      if (!signUp) throw new Error('Authentication service unavailable')

      const { data, error } = await signUp(email, password, `${firstName} ${lastName}`)

      if (error) {
        toast.error(error.message)
      } else {
        // Update user profile with additional info
        if (data?.user) {
          const formattedContact = `${contactCountryCode} ${contactNumber}`
          const formattedWhatsApp = whatsappNumber ? `${whatsappCountryCode} ${whatsappNumber}` : ''
          
          await updateProfile(data.user.id, {
            phone: formattedContact,
            whatsapp_number: formattedWhatsApp,
            desired_country: country,
            full_name: `${firstName} ${lastName}`
          })
        }
        
        toast.success('Account created successfully! Please check your email to confirm.')
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      <SEO 
        title="Create Account" 
        description="Join thousands of successful candidates. Create an account to start your immigration journey, get expert support, and track your visa status."
      />
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/logo-white.svg" alt="Siddhivinayak Overseas" className="h-12 w-auto" />
          </Link>
          
          <div className="glass-premium rounded-3xl p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-slate-400">Start your immigration journey today</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="label">First Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 " />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="input-glass !pl-12 text-white"
                      placeholder="Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="label">Last Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="input-glass !pl-12 text-white"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-glass !pl-12 text-white"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Number */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} className="text-royal-400" /> Contact Number
                    </label>
                    {phoneDetected && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', color: '#4ade80',
                        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                        borderRadius: '9999px', padding: '2px 8px'
                      }}>✓ {phoneDetected.flag} {phoneDetected.name}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      style={{ width: '110px', flexShrink: 0 }}
                      className="input-glass text-white bg-navy-900 text-sm"
                      value={contactCountryCode}
                      onChange={e => setContactCountryCode(e.target.value)}
                    >
                      {COUNTRY_CODES.map((c, i) => (
                        <option key={i} value={c.code} className="bg-navy-900">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="contactNumber"
                      type="tel"
                      required
                      style={{ flex: 1, minWidth: 0 }}
                      className="input-glass text-white"
                      placeholder={`e.g. ${contactCountryCode} 9876...`}
                      value={contactNumber}
                      onChange={e => {
                        const val = e.target.value
                        const det = detectCountryCode(val)
                        if (det) {
                          setContactCountryCode(det.code)
                          setContactNumber(det.number)
                          setPhoneDetected(det)
                          setTimeout(() => setPhoneDetected(null), 3000)
                        } else {
                          setContactNumber(val)
                          setPhoneDetected(null)
                        }
                      }}
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={13} className="text-green-400" /> WhatsApp Number
                    </label>
                    {waDetected && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', color: '#4ade80',
                        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                        borderRadius: '9999px', padding: '2px 8px'
                      }}>✓ {waDetected.flag} {waDetected.name}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      style={{ width: '110px', flexShrink: 0 }}
                      className="input-glass text-white bg-navy-900 text-sm"
                      value={whatsappCountryCode}
                      onChange={e => setWhatsAppCountryCode(e.target.value)}
                    >
                      {COUNTRY_CODES.map((c, i) => (
                        <option key={i} value={c.code} className="bg-navy-900">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="whatsappNumber"
                      type="tel"
                      style={{ flex: 1, minWidth: 0 }}
                      className="input-glass text-white"
                      placeholder={`e.g. ${whatsappCountryCode} 9876...`}
                      value={whatsappNumber}
                      onChange={e => {
                        const val = e.target.value
                        const det = detectCountryCode(val)
                        if (det) {
                          setWhatsAppCountryCode(det.code)
                          setWhatsAppNumber(det.number)
                          setWaDetected(det)
                          setTimeout(() => setWaDetected(null), 3000)
                        } else {
                          setWhatsAppNumber(val)
                          setWaDetected(null)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="country" className="label">Desired Country</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select
                    id="country"
                    name="country"
                    required
                    className="input-glass !pl-12 text-white bg-navy-900"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="" className="text-slate-400 bg-navy-900">Select Destination</option>
                    <option value="Canada" className="text-white bg-navy-900">Canada</option>
                    <option value="Australia" className="text-white bg-navy-900">Australia</option>
                    <option value="UK" className="text-white bg-navy-900">United Kingdom</option>
                    <option value="Germany" className="text-white bg-navy-900">Germany</option>
                    <option value="Other" className="text-white bg-navy-900">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="label">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="input-glass !pl-12 text-white"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="input-glass !pl-12 text-white"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  required
                  className="mt-1 rounded border-white/20 bg-white/5 text-royal-500 focus:ring-royal-500" 
                />
                <label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-royal-400 hover:text-royal-300">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-royal-400 hover:text-royal-300">Privacy Policy</Link>
                </label>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                {loading ? (
                  'Creating account...'
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-20 right-10 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)' }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
              <Globe size={26} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SiddhivinayakOverseas</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start your global{' '}
              <span className="gradient-text">journey today</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-md">
              Join 50,000+ clients who have successfully achieved their immigration dreams with our expert guidance.
            </p>
          </motion.div>
          
          {/* Benefits */}
          <div className="space-y-4 mb-12">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-teal-400" />
                </div>
                <span className="text-slate-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-gold-400 fill-gold-400" />
              ))}
            </div>
            <p className="text-slate-300 text-sm mb-4">
              &quot;The team at SiddhivinayakOverseas made my PR application process seamless. 
              Highly recommend their services!&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                PS
              </div>
              <div>
                <div className="text-white font-medium text-sm">Priya Sharma</div>
                <div className="text-slate-500 text-xs">Canada PR - 2024</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
