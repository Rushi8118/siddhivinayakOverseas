import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Globe, Mail, Lock, ArrowRight, CheckCircle, Star } from 'lucide-react'

const benefits = [
  'Track your visa application in real-time',
  'Access personalized document checklists',
  'Get expert support from certified consultants',
  'Receive instant updates on policy changes',
]

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
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

      const { error } = await signUp(email, password)

      if (error) {
        toast.error(error.message)
      } else {
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
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
              <Globe size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SiddhivinayakOverseas</span>
          </Link>
          
          <div className="glass-premium rounded-3xl p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-slate-400">Start your immigration journey today</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-glass pl-12"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input-glass pl-12"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Must be at least 6 characters</p>
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
                    className="input-glass pl-12"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
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
                  <a href="#" className="text-royal-400 hover:text-royal-300">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-royal-400 hover:text-royal-300">Privacy Policy</a>
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
