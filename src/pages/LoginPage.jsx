import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Globe, Mail, Lock, ArrowRight, Shield, Users, Award } from 'lucide-react'

const trustFeatures = [
  { icon: Shield, label: 'Secure & Encrypted', desc: 'Your data is protected with enterprise-grade security' },
  { icon: Users, label: '50,000+ Clients', desc: 'Trusted by thousands worldwide' },
  { icon: Award, label: 'ICCRC Certified', desc: 'Licensed immigration consultants' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!signIn) throw new Error('Authentication service unavailable')

      const { error } = await signIn(email, password)

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Logged in successfully!')
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)' }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
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
              Welcome back to your{' '}
              <span className="gradient-text">immigration journey</span>
            </h1>
            <p className="text-lg text-slate-400 mb-12 max-w-md">
              Access your dashboard to track applications, manage documents, and stay updated on your visa status.
            </p>
          </motion.div>
          
          {/* Trust Features */}
          <div className="space-y-4">
            {trustFeatures.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} className="text-royal-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{feature.label}</div>
                  <div className="text-slate-500 text-sm">{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
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
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Sign in to your account</h2>
              <p className="text-slate-400">Enter your credentials to access your dashboard</p>
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5 text-royal-500 focus:ring-royal-500" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-royal-400 hover:text-royal-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>
          
          <p className="text-center text-slate-500 text-xs mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-white">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
